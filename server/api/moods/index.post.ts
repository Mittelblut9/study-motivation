import { captureException } from '@sentry/browser';
import { inArray } from 'drizzle-orm/sql/expressions/conditions';
import z from 'zod';

const moodsSchema = z.object({
    moods: z.array(
        z.object({
            id: z.number(),
            name: z.string().min(1),
        }),
    ),
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
        const returnMoods = [];

        useDrizzle().transaction((tx) => {
            const relations = tx.select().from(tables.usersToMoodsRelations).where(eq(tables.usersToMoodsRelations.userId, userId)).all();
            const moodsInDatabase = tx.select().from(tables.moods).where(inArray(tables.moods.id, relations.map(r => r.moodId))).all();

            const existingMoodsMap = new Map(moodsInDatabase.map(mood => [mood.id, mood]));

            const moodsToAdd = newMoods.filter(mood => ![...existingMoodsMap.values()].some(existingMood => existingMood.name === mood.name));
            const moodsToRemove = [...existingMoodsMap.values()].filter(existingMood => !newMoods.some(mood => mood.name === existingMood.name));

            for (const mood of moodsToAdd) {
                const newMood = tx.insert(tables.moods).values({
                    name: mood.name,
                }).returning().get();
                tx.insert(tables.usersToMoodsRelations).values({
                    userId,
                    moodId: newMood.id,
                }).run();
                returnMoods.push({
                    oldId: mood.id,
                    id: newMood.id,
                    name: newMood.name,
                });
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

        return returnMoods;
    } catch (error) {
        console.error('Error saving moods:', error);
        captureException(error);
        throw createError({
            statusCode: 500,
            message: 'Failed to save moods',
        });
    }
});
