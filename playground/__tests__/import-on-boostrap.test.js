const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { setupStrapi, cleanupStrapi } = require('./helpers');

jest.setTimeout(20000);

afterEach(async () => {
  // Disable importOnBootstrap
  await exec('sed -i "s/importOnBootstrap: true/importOnBootstrap: false/g" config/plugins.ts');

  await cleanupStrapi();
  await exec('rm -rf config/sync');
});

describe('Test the importOnBootstrap feature', () => {
  test('Without a database', async () => {
    // Do the initial export and remove the database.
    await exec('yarn cs export -y');
    await exec('rm -rf .tmp');

    // Manually change the plugins.ts to enable importOnBoostrap.
    await exec('sed -i "s/importOnBootstrap: false/importOnBootstrap: true/g" config/plugins.ts');

    // Start up Strapi to initiate the importOnBootstrap function.
    await setupStrapi();

    expect(strapi).toBeDefined();
  });

  test('With a database', async () => {
    // Delete any existing database and do an export.
    await exec('rm -rf .tmp');
    await exec('yarn cs export -y');

    // Manually change the plugins.ts to enable importOnBoostrap.
    await exec('sed -i "s/importOnBootstrap: false/importOnBootstrap: true/g" config/plugins.ts');

    // Remove a config file to make sure the importOnBoostrap
    // function actually attempts to import.
    await exec('rm -rf config/sync/admin-role.strapi-editor.json');

    // Start up Strapi to initiate the importOnBootstrap function.
    await setupStrapi();

    expect(strapi).toBeDefined();
  });
});
