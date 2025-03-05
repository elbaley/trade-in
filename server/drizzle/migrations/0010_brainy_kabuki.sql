PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trade_offers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`selections` text NOT NULL,
	`offer_price` integer NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text,
	`phone_number` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_trade_offers`("id", "model_id", "selections", "offer_price", "first_name", "last_name", "email", "phone_number", "status", "created_at") SELECT "id", "model_id", "selections", "offer_price", "first_name", "last_name", "email", "phone_number", "status", "created_at" FROM `trade_offers`;--> statement-breakpoint
DROP TABLE `trade_offers`;--> statement-breakpoint
ALTER TABLE `__new_trade_offers` RENAME TO `trade_offers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;