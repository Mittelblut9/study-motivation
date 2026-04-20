import z from 'zod';
import { getRandomQuote } from '~~/server/utils/quotes';

const quotesGetSchema = z.object({
    moodId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
    const user = await getUserSession(event);
    if (!user?.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const query = await getValidatedQuery(event, event => quotesGetSchema.parse(event));

    const moodId = Number(query.moodId);
    if (isNaN(moodId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid mood ID',
        });
    }

    const relationQuotest = await useDrizzle().query.usersToQuotesRelations.findMany({
        where: (usersToQuotesRelations, { eq }) => eq(usersToQuotesRelations.userId, user.user.id),
    });

    const relationQuotesForMood = await useDrizzle().query.moodsToQuotesRelations.findMany({
        where: (moodsToQuotesRelations, { eq }) => eq(moodsToQuotesRelations.moodId, moodId),
    });

    const validQuotes = relationQuotesForMood.filter(relationQuote =>
        relationQuotest.some(userQuote => userQuote.quoteId === relationQuote.quoteId)
    );

    if (validQuotes.length === 0) {
        throw createError({
            statusCode: 404,
            message: 'No quotes found for the selected mood',
        });
    }

    const MAX_RETRIES = 10;
    let retries = 0;

    do {
        const randomQuote = getRandomQuote(validQuotes);
        if (!randomQuote) {
            retries++;
            continue;
        }

        const quote = await useDrizzle().query.quotes.findFirst({
            where: (quotes, { eq }) => eq(quotes.id, randomQuote.quoteId),
        });

        if (quote) {
            return quote;
        }

        retries++;
    } while (retries < MAX_RETRIES);

    throw createError({
        statusCode: 404,
        message: 'No quotes found for the selected mood',
    });
});
