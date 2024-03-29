// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/braceguard.sqlite3'
    },

    migrations: {
      tabelName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
    useNullAsDefault: true,
    seeds: {
      directory: `${__dirname}/src/database/seeds`
    }
  },

  

};
