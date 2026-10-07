import { REST, Routes } from 'discord.js';
import commands from './commands';
import config from './config';

const rest = new REST({ version: '10' }).setToken(config.token);

async function main() {
  const payload = commands.map((command) => command.data.toJSON());
  const route = config.guildId
    ? Routes.applicationGuildCommands(config.clientId, config.guildId)
    : Routes.applicationCommands(config.clientId);
  const scope = config.guildId ? `guild ${config.guildId}` : 'global';

  console.log('Registering slash commands...');
  let failed = 0;

  // POST upserts by name, so commands from other services are left alone
  for (const cmd of payload) {
    try {
      await rest.post(route, { body: cmd });
    } catch (error) {
      failed++;
      console.error(`Failed to register /${cmd.name}`, error);
    }
  }

  console.log(`Registered ${payload.length - failed}/${payload.length} ${scope} commands (upsert)`);
}

main();