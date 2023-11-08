import axios from 'axios';
import { createContext, useMemo, useCallback } from 'react'; // Import useCallback
import { useDispatch } from 'react-redux';
import { addChannel, setCurrentChannel } from '../slices/channelsSlice';
import { chatContextRoutes } from '../routes';

export const ChatContext = createContext({});

const ChatContextProvider = ({ socket, children }) => {
  const dispatch = useDispatch();
  const timeout = 4000;

  const addNewMessage = useCallback(async (message) => {
    await socket
      .timeout(timeout)
      .emit('newMessage', message);
  }, [socket, timeout]);

  const addNewChannel = useCallback(async (channel) => {
    const { data } = await socket
      .timeout(timeout)
      .emitWithAck('newChannel', channel);

    dispatch(addChannel(data));
    dispatch(setCurrentChannel(data.id));
  }, [socket, dispatch, timeout]);

  const removeSelectedChannel = useCallback(async (id) => {
    await socket
      .timeout(timeout)
      .emit('removeChannel', { id });
  }, [socket, timeout]);

  const renameSelectedChannel = useCallback(async (updateChannel) => {
    await socket
      .timeout(timeout)
      .emit('renameChannel', updateChannel);
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
  }), [addNewMessage, addNewChannel, removeSelectedChannel, renameSelectedChannel, getServerData]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
