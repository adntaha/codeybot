import { container } from '@sapphire/framework';
import { Permissions, User } from 'discord.js';
import {
  CodeyCommandDetails,
  CodeyCommandOptionType,
  CodeyCommandResponseType,
  SapphireMessageExecuteType,
} from '../../codeyCommand';
import {
  getCoinBalanceByUserId,
  updateCoinBalanceByUserId,
  UserCoinEvent,
} from '../../components/coin';
import { getCoinEmoji } from '../../components/emojis';

// Update coin balance of a user
const coinUpdateExecuteCommand: SapphireMessageExecuteType = async (
  client,
  messageFromUser,
  args,
) => {
  if (!(<Readonly<Permissions>>messageFromUser.member?.permissions).has('ADMINISTRATOR')) {
    return `You do not have permission to use this command.`;
  }

  // First mandatory argument is user
  const user = <User>args['user'];
  if (!user) {
    throw new Error('please enter a valid user mention or ID for balance adjustment.');
  }

  // Second mandatory argument is amount
  const amount = args['amount'];
  if (typeof amount !== 'number') {
    throw new Error('please enter a valid amount to adjust.');
  }

  // Optional argument is reason
  const reason = args['reason'];

  // Adjust coin balance
  await updateCoinBalanceByUserId(
    user.id,
    <number>amount,
    UserCoinEvent.AdminCoinAdjust,
    <string>(reason ? reason : ''),
    client.user?.id,
  );
  // Get new balance
  const newBalance = await getCoinBalanceByUserId(user.id);

  return `${user.username} now has ${newBalance} Codey coins ${getCoinEmoji()}.`;
};

export const coinUpdateCommandDetails: CodeyCommandDetails = {
  name: 'update',
  aliases: ['u'],
  description: 'Update the coin balance of a user.',
  detailedDescription: `**Examples:**
  \`${container.botPrefix}coin update @Codey 100\``,

  isCommandResponseEphemeral: false,
  messageWhenExecutingCommand: 'Updating coin balance...',
  executeCommand: coinUpdateExecuteCommand,
  codeyCommandResponseType: CodeyCommandResponseType.STRING,

  options: [
    {
      name: 'user',
      description: 'The user to adjust the balance of,',
      type: CodeyCommandOptionType.USER,
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount to adjust the balance of the specified user to,',
      type: CodeyCommandOptionType.NUMBER,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason why we are adjusting the balance,',
      type: CodeyCommandOptionType.STRING,
      required: false,
    },
  ],
  subcommandDetails: {},
};
