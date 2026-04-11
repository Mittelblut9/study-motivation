import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const moods = sqliteTable('moods', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});

export const quotes = sqliteTable('quotes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    text: text('text').notNull(),
});

export const quotesRelations = relations(quotes, ({ many }) => ({
    moods: many(moodsToQuotesRelations),
}));

export const moodsToQuotesRelations = sqliteTable('moods_to_quotes_relations', {
    moodId: integer('mood_id').notNull().references(() => moods.id, { onDelete: 'cascade' }),
    quoteId: integer('quote_id').notNull().references(() => quotes.id, { onDelete: 'cascade' }),
},
t => [
    primaryKey({ columns: [t.moodId, t.quoteId] }),
]);
