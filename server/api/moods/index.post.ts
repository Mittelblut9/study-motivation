import { captureException } from '@sentry/browser';
import { inArray } from 'drizzle-orm/sql/expressions/conditions';
import z from 'zod';

const moodsSchema = z.object({
    moods: z.array(z.string().min(1)),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, event => moodsSchema.parse(event));

    const user = await getUserSession(event);
    if (!user?.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const newMoods = body.moods;
    const userId = user.user.id;
    try {
        useDrizzle().transaction((tx) => {
            const relations = tx.select().from(tables.usersToMoodsRelations).where(eq(tables.usersToMoodsRelations.userId, userId)).all();
            const moodsInDatabase = tx.select().from(tables.moods).where(inArray(tables.moods.id, relations.map(r => r.moodId))).all();

            const existingMoodsMap = new Map(moodsInDatabase.map(mood => [mood.id, mood]));

            const moodsToAdd = newMoods.filter(mood => ![...existingMoodsMap.values()].some(existingMood => existingMood.name === mood));
            const moodsToRemove = [...existingMoodsMap.values()].filter(existingMood => !newMoods.includes(existingMood.name));

            for (const moodName of moodsToAdd) {
                const newMood = tx.insert(tables.moods).values({
                    name: moodName,
                }).returning().get();
                tx.insert(tables.usersToMoodsRelations).values({
                    userId,
                    moodId: newMood.id,
                }).run();
            }

            for (const mood of moodsToRemove) {
                tx.delete(tables.usersToMoodsRelations).where(and(
                    eq(tables.usersToMoodsRelations.userId, userId),
                    eq(tables.usersToMoodsRelations.moodId, mood.id),
                )).run();

                const remainingRelations = tx.select().from(tables.usersToMoodsRelations).where(eq(tables.usersToMoodsRelations.moodId, mood.id)).all();
                if (remainingRelations.length === 0) {
                    tx.delete(tables.moods).where(eq(tables.moods.id, mood.id)).run();
                }
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving moods:', error);
        captureException(error);
        throw createError({
            statusCode: 500,
            message: 'Failed to save moods',
        });
    }
});
