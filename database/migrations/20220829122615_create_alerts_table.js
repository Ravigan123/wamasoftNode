/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("alerts", (table) => {
		table.increments("id").primary();
		table.integer("id_server").unsigned();
		table.foreign("id_server").references("servers.id");
		table.integer("id_title").unsigned().notNullable();
		table.foreign("id_title").references("titles.id");
		table.string("type").notNullable();
		table.string("action").notNullable();
		table.string("alert_worth").notNullable();
		table.string("telegram_user").notNullable();
		table.string("id_chat").notNullable();
		table.timestamps(false, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("alerts");
};
