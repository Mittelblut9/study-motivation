CREATE TABLE `users_to_moods_relations` (
	`user_id` integer NOT NULL,
	`mood_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `mood_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mood_id`) REFERENCES `moods`(`id`) ON UPDATE no action ON DELETE cascade
);
