const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = (client) => {
  client.handleRoutes = async (app) => {
    const routeFiles = readdirSync(join(__dirname, '../routes')).filter(file => file.endsWith('.js'));

    for (const file of routeFiles) {
      try {
        const route = require(join(__dirname, '../routes', file));

        if (typeof route !== 'function') {
          client.logger.error(`Route "${file}" does not export a function.`);
          continue;
        }

        route(app, client);
        client.logger.info(`Loaded route: ${file}`);
      } catch (err) {
        client.logger.error(`Failed to load route "${file}": ${err.message}`);
      }
    }
  };
};


