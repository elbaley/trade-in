PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_model_trade_condition_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`label_key` text NOT NULL,
	`description_key` text NOT NULL,
	`deduction` integer NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `model_trade_condition_questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_model_trade_condition_options`("id", "question_id", "label_key", "description_key", "deduction") SELECT "id", "question_id", "label_key", "description_key", "deduction" FROM `model_trade_condition_options`;--> statement-breakpoint
DROP TABLE `model_trade_condition_options`;--> statement-breakpoint
ALTER TABLE `__new_model_trade_condition_options` RENAME TO `model_trade_condition_options`;--> statement-breakpoint
PRAGMA foreign_keys=ON;