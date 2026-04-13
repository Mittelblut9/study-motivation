export default defineEventHandler(async (event) => {
    const user = await getUserSession(event);
    if (!user.loggedIn) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const quotes = await useDrizzle().query.quotes.findMany({
        where: (quotes, { eq }) => eq(quotes.id, user.user.id),
        orderBy: (quotes, { desc }) => desc(quotes.id),
    });

    return quotes;
});
