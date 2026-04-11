export const cachedQuotes = defineCachedFunction(
    async (userId: number) =>
        await useDrizzle().select().from(tables.usersToQuotesRelations).where(eq(tables.usersToQuotesRelations.userId, userId)).innerJoin(tables.quotes, eq(tables.usersToQuotesRelations.quoteId, tables.quotes.id)),
    {
        name: 'quotes',
        maxAge: 60 * 60,
    }
);

export async function invalidateQuotesCache() {
    await useStorage('cache').removeItem('nitro:functions:quotes:.json');
}
