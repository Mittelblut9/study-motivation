import { captureException } from '@sentry/node';
import z from 'zod';

const quotesSchema = z.object({
    id: z.number().optional(),
    text: z.string().min(1),
});

const quotesPayloadSchema = z.object({
    newQuotes: z.array(quotesSchema),
    removedQuotes: z.array(quotesSchema),
    updatedQuotes: z.array(quotesSchema),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, event => quotesPayloadSchema.parse(event));

    const user = await getUserSession(event);
    if (!user?.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const quotes = body;
    const userId = user.user.id;
    try {
        useDrizzle().transaction((tx) => {
            for (const quote of quotes.newQuotes) {
                const newQuote = tx.insert(tables.quotes).values({
                    text: quote.text,
                }).returning().get();
                tx.insert(tables.usersToQuotesRelations).values({
                    userId,
                    quoteId: newQuote.id,
                }).run();
            }

            for (const quote of quotes.updatedQuotes) {
                tx.update(tables.quotes).set({
                    text: quote.text,
                }).where(eq(tables.quotes.id, quote.id)).run();
            }

            for (const quote of quotes.removedQuotes) {
                tx.delete(tables.quotes).where(eq(tables.quotes.id, quote.id)).run();
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving quotes:', error);
        captureException(error);
        throw createError({
            statusCode: 500,
            message: 'Failed to save quotes',
        });
    }
});
