/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
    await knex.schema.createTable('fun_facts', table => {
        table.increments('id').primary();
        table.string('fact').notNullable();
    });

    // Insert default facts
    await knex('fun_facts').insert([
        { fact: "Spotify was founded in 2006 in Stockholm, Sweden." },
        { fact: "The name 'Spotify' was initially a misheard name from a brainstorming session." },
        { fact: "The first song ever played on Spotify's commercial launch was 'The Hardest Button to Button' by The White Stripes." },
        { fact: "Backstage was originally created out of necessity by Spotify to manage their sprawling microservice ecosystem." },
        { fact: "Spotify users listen to over 100 billion hours of music per year." },
        { fact: "The average lifespan of a hit song on Spotify's global top 50 is about 15 weeks." },
        { fact: "In 2020, Spotify listeners streamed more than 3.4 billion hours of podcasts." },
        { fact: "Backstage was open-sourced in 2020 and became an incubated project at the Cloud Native Computing Foundation (CNCF)." },
        { fact: "Spotify's Discovery Weekly algorithm uses a mix of collaborative filtering, NLP, and raw audio analysis." }
    ]);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
    await knex.schema.dropTable('fun_facts');
};
