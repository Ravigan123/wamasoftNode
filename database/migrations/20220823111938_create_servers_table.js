/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("servers", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();
		table.json("request").notNullable();
		table.dateTime("req_date").notNullable();
		table.timestamps(false, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("servers");
};
