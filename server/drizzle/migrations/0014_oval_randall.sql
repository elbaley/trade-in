ALTER TABLE `users` DROP COLUMN `full_name`;--> statement-breakpoint
ALTER TABLE `users` ADD `full_name` text GENERATED ALWAYS AS ("first_name" || ' ' ||  "last_name") VIRTUAL;