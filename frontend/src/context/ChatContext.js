import axios from 'axios';
import { createContext, useMemo, useCallback } from 'react';
import { chatContextRoutes } from '../routes';
import io from 'socket.io-client';
import { appRoutes } from '../routes';

export const ChatContext = createContext({});

const ChatContextProvider = ({ children }) => {
  const timeout = 4000;

  const socket = io(appRoutes.chatPagePath(), { autoConnect: true });

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
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(chatContextRoutes.data(), { headers: { Authorization: `Bearer ${user.token}` } });
    return response;
  }, []);

  const contextValue = useMemo(() => ({
    addNewMessage,
    addNewChannel,
    removeSelectedChannel,
    renameSelectedChannel,
    getServerData,
    socket
  }), [addNewMessage, addNewChannel, removeSelectedChannel, renameSelectedChannel, getServerData, socket]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
