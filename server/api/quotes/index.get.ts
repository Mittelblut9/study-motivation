import z from 'zod';

const moodsGetSchema = z.object({
    moodId: z.string().min(1, 'Mood is required'),
});

export default defineEventHandler(async (event) => {
    const user = await getUserSession(event);
    if (!user?.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const query = await getValidatedQuery(event, event => moodsGetSchema.parse(event));

    const moodId = Number(query.moodId);
    if (isNaN(moodId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid moodId',
        });
    }

    const relationQuotest = await useDrizzle().query.usersToQuotesRelations.findMany({
        where: (usersToQuotesRelations, { eq }) => eq(usersToQuotesRelations.userId, user.user.id),
    });

    const relationQuotesForMood = await useDrizzle().query.moodsToQuotesRelations.findMany({
        where: (moodsToQuotesRelations, { eq }) => eq(moodsToQuotesRelations.moodId, moodId),
    });

    const quotes = [];

    for (const relation of relationQuotest) {
        const quote = await useDrizzle().query.quotes.findFirst({
            where: (quotes, { eq }) => eq(quotes.id, relation.quoteId),
        });

        const isRelatedToMood = relationQuotesForMood.some(r => r.quoteId === quote.id);
        if (isRelatedToMood) {
            quotes.push(quote);
        }
    }

    return quotes;
});
