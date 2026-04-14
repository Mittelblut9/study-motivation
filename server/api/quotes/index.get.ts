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

    const quotes = [];

    for (const relation of relationQuotest) {
        const quote = await useDrizzle().query.quotes.findFirst({
            where: (quotes, { eq }) => eq(quotes.id, relation.quoteId),
        });

        if (quote) {
            quotes.push(quote);
        }
    }

    return quotes;
});
