ALTER TABLE `model_trade_condition_options` RENAME COLUMN "label" TO "label_key";--> statement-breakpoint
ALTER TABLE `model_trade_condition_options` RENAME COLUMN "description" TO "description_key";--> statement-breakpoint
ALTER TABLE `model_trade_condition_questions` RENAME COLUMN "question" TO "question_key";--> statement-breakpoint
ALTER TABLE `translations` ADD `key` text NOT NULL;