import axios from 'axios';
import io from 'socket.io-client';
import { createContext, useMemo, useCallback } from 'react';
import { chatContextRoutes, appRoutes } from '../routes';
import { addMessage } from '../slices/messagesSlice';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice';
import store from '../slices';
import { useAuthorization } from '../hooks';

export const ChatContext = createContext({});

const ChatContextProvider = ({ children }) => {
  const timeout = 4000;
  const { user } = useAuthorization();

  const socket = io(appRoutes.chatPagePath(), { autoConnect: true });

  socket.on('newMessage', (message) => {
    store.dispatch(addMessage(message));
  });
  socket.on('newChannel', (channel) => {
    store.dispatch(addChannel(channel));
  });
  socket.on('removeChannel', (channel) => {
    store.dispatch(removeChannel(channel.id));
  });
  socket.on('renameChannel', (channel) => {
    store.dispatch(renameChannel({ id: channel.id, changes: { name: channel.name } }));
  });

  const addNewMessage = useCallback(async (message) => {
    const { data } = await socket
      .timeout(timeout)
      .emitWithAck('newMessage', message);

    return data;
  }, [socket, timeout]);

  const addNewChannel = useCallback(async (channel) => {
    const { data } = await socket
      .timeout(timeout)
      .emitWithAck('newChannel', channel);

    return data;
  }, [socket, timeout]);

  const removeSelectedChannel = useCallback(async (id) => {
    const { data } = await socket
      .timeout(timeout)
      .emitWithAck('removeChannel', { id });

    return data;
  }, [socket, timeout]);

  const renameSelectedChannel = useCallback(async (updateChannel) => {
    const { data } = await socket
      .timeout(timeout)
      .emitWithAck('renameChannel', updateChannel);

    return data;
  }, [socket, timeout]);

  const getServerData = useCallback(async () => {
    const response = await axios.get(chatContextRoutes.data(), { headers: { Authorization: `Bearer ${user.token}` } });
    return response;
  }, [user]);

  const contextValue = useMemo(() => ({
    addNewMessage,
    addNewChannel,
    removeSelectedChannel,
    renameSelectedChannel,
    getServerData,
    socket,
  }), [addNewMessage, addNewChannel, removeSelectedChannel, renameSelectedChannel, getServerData,
    socket]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
