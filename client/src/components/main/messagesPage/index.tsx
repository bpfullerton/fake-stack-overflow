import { useEffect, useState } from 'react';
import { ChannelSortBase, DefaultGenerics, StreamChat } from 'stream-chat';
import {
  Channel as ChannelComponent,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';
import useUserContext from '../../../hooks/useUserContext';

import 'stream-chat-react/dist/css/v2/index.css';
import { userLogin } from '../../../services/userService';
import './index.css';

const MessagesPage = () => {
  const { user } = useUserContext();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [newChatNames, setNewChatNames] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const clientAttempt = StreamChat.getInstance('eb4nygr27qx2');
      if (!clientAttempt.userID) {
        const token = await userLogin(user.username);
        await clientAttempt.connectUser({ id: user.username, name: user.username }, token);
      }

      setClient(clientAttempt);
      // setChannel(channels[0]);
    };

    init();
  }, [user.username]);

  if (/* !channel || */ !client) {
    return <LoadingIndicator />;
  }

  const filters = { members: { $in: [user.username] } };
  const sort: ChannelSortBase<DefaultGenerics> = { last_message_at: -1 };
  const options = { limit: 5 };

  return (
    <div className='messages-container'>
      <Chat client={client}>
        <div className='sidebar'>
          <ChannelList filters={filters} sort={sort} options={options} />
          <div>
            <form
              onSubmit={async event => {
                // TODO: sentence parsing for multiple people
                // error handling for malformed sentence
                // checking if person exists in system/database...?
                // Doesn't delete the channel even when the users are deleted,
                // so some additional checks are needed
                try {
                  event.preventDefault();
                  const newChannelID = `chat_${user.username}_${Date.now()}`; // Example dynamic ID
                  const chatMembers = [user.username, ...newChatNames.split(',')];
                  const existingChannel = await client.queryChannels({
                    members: { $eq: chatMembers },
                  });

                  if (existingChannel.length === 0) {
                    const newChannel = client.channel('messaging', newChannelID, {
                      members: chatMembers,
                    });
                    newChannel.watch();
                    setNewChatNames('');
                  } else {
                    /* empty */
                  }
                } catch (error) {
                  // eslint-disable-next-line no-console
                  console.error(error);
                }
              }}>
              <label>
                Make a new chat (separate multiple names with &apos;,&apos;)
                <input
                  type='text'
                  value={newChatNames}
                  onChange={event => {
                    setNewChatNames(event.target.value);
                  }}
                  id='newChatInput'
                />
              </label>
              <input type='submit' value='Submit' />
            </form>
          </div>
        </div>
        <div className='display'>
          <ChannelComponent>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
          </ChannelComponent>
        </div>
      </Chat>
    </div>
  );
};

export default MessagesPage;
