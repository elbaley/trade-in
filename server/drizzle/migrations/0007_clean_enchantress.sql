CREATE TABLE `trade_offers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`selections` text NOT NULL,
	`offer_price` integer NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text,
	`phone_number` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
