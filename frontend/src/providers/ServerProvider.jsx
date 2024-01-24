import { createContext, useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import * as MessagesSlice from '../slices/messagesSlice.js';
import * as ChannelsSlice from '../slices/channelsSlice.js';
import { useAuth } from './AuthProvider.jsx';
import routes from '../routes.js';

const ServerContext = createContext();
const useServer = () => useContext(ServerContext);

const ServerProvider = ({ socket, children }) => {
  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth();
  const TIMEOUT = 4000;

  const context = useMemo(() => {
    const sendMessage = async (message) => {
      await socket.timeout(TIMEOUT).emit('newMessage', message);
    };

    const addChannel = async (name) => {
      const { data } = await socket
        .timeout(TIMEOUT)
        .emitWithAck('newChannel', { name });
      dispatch(ChannelsSlice.actions.addChannel(data));
      dispatch(ChannelsSlice.actions.setCurrentChannel(data.id));
    };

    const removeChannel = async (id) => {
      await socket.timeout(TIMEOUT).emit('removeChannel', { id });
    };

    const renameChannel = async (id, name) => {
      await socket.timeout(TIMEOUT).emit('renameChannel', { id, name });
    };

    const getServerData = async () => {
      const route = routes.data();
      const headers = getAuthHeader();
      const response = await axios.get(route, { headers });
      return response;
    };

    const connectSocket = () => {
      socket.on('newMessage', (message) => {
        dispatch(MessagesSlice.actions.addMessage(message));
      });
      socket.on('newChannel', (channel) => {
        dispatch(ChannelsSlice.actions.addChannel(channel));
      });
      socket.on('removeChannel', ({ id }) => {
        dispatch(ChannelsSlice.actions.removeChannel(id));
      });
      socket.on('renameChannel', ({ name, id }) => {
        dispatch(ChannelsSlice.actions.renameChannel({ id, name }));
      });
    };

    const disconnectSocket = () => socket.off();

    return {
      sendMessage,
      addChannel,
      removeChannel,
      renameChannel,
      getServerData,
      connectSocket,
      disconnectSocket,
    };
  }, [dispatch, socket, getAuthHeader]);

  return (
    <ServerContext.Provider value={context}>{children}</ServerContext.Provider>
  );
};

export default ServerProvider;
export { ServerContext, useServer };
