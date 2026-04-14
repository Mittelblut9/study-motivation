import { getRandomQuote } from '~~/server/utils/quotes';

export default defineEventHandler(async (event) => {
    const user = await getUserSession(event);
    if (!user?.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const relationQuotest = await useDrizzle().query.usersToQuotesRelations.findMany({
        where: (usersToQuotesRelations, { eq }) => eq(usersToQuotesRelations.userId, user.user.id),
    });

    const MAX_RETRIES = 10;
    let retries = 0;

    do {
        const randomQuote = getRandomQuote(relationQuotest);
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
});
