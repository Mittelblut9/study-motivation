import { captureException } from '@sentry/browser';

export default defineEventHandler(async (event) => {
    const user = await getUserSession(event);
    if (!user?.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    try {
        const relationMoods = await useDrizzle().query.usersToMoodsRelations.findMany({
            where: (usersToMoodsRelations, { eq }) => eq(usersToMoodsRelations.userId, user.user.id),
        });

        const moods: string[] = [];

        for (const relation of relationMoods) {
            const mood = await useDrizzle().query.moods.findFirst({
                where: (moods, { eq }) => eq(moods.id, relation.moodId),
            });

            if (mood) {
                moods.push(mood.name);
            }
        }

        return moods;
    } catch (error) {
        console.error('Error fetching moods:', error);
        captureException(error);
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch moods',
        });
    }
});
