ALTER TABLE `users` ADD `first_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `full_name` text GENERATED ALWAYS AS ("first_name" || "last_name") VIRTUAL;--> statement-breakpoint
