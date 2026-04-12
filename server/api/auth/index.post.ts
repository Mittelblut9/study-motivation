import z from 'zod';

const authSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, event => authSchema.parse(event));

    const { email, password } = body;

    const hashedPassword = await hashPassword(password);

    if (!await verifyPassword(hashedPassword, password)) {
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        });
    }

    const user = await useDrizzle().query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        });
    }

    await setUserSession(event, {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
    setResponseStatus(event, 201);
});
