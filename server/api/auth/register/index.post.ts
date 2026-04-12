import { captureException } from '@sentry/nuxt';
import { z } from 'zod';

const authSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, event => authSchema.parse(event));

    const { name, email, password } = body;

    const user = await useDrizzle().query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });

    if (user) {
        throw createError({
            statusCode: 401,
            message: 'User already exists',
        });
    }

    const hashedPassword = await hashPassword(password);

    try {
        const newUser = await useDrizzle().insert(tables.users).values({
            name,
            email,
            password: hashedPassword,
        }).returning();

        await setUserSession(event, {
            user: {
                id: newUser[0].id,
                name: newUser[0].name,
                email: newUser[0].email,
            },
        });
        sendRedirect(event, '/auth/login');
    } catch (error) {
        captureException(error);
        consola.error('Error creating user', error);
        throw createError({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
