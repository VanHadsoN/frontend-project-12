import { toast } from 'react-toastify';
import { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useRollbar } from '@rollbar/react';
import { useAuthorization, useChatApi } from '../hooks';
import fetchInitialData from '../slices/InitialDataThunk';
import { messagesSelector, currentChannel } from '../selectors';
import ChannelsPanel from '../components/chat/channels-panel/ChannelsPanel';
import ChatPanel from '../components/chat/chat-panel/ChatPanel';
import ModalWindow from '../components/modal/ModalWindow';
import MessageBox from '../components/chat/message-box/MessageBox';
import MessageForm from '../components/chat/MessageForm';
import { ChatContext } from '../context/ChatContext';
import io from 'socket.io-client';
import { appRoutes } from '../routes';

const Chat = () => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getServerData } = useChatApi();
  const { logOut } = useAuthorization();
  const messages = useSelector(messagesSelector.selectAll);
  const currentChannelData = useSelector(currentChannel);
  const currentChannelName = currentChannelData?.name;
  const currentChannelMessages = messages.filter(
    (message) => message.сhannelId === currentChannelData?.id,
  );
  const currentChannelMessagesCount = currentChannelMessages.length;
  const loadingStatus = useSelector((state) => state?.loading?.serverData);

  const { addNewMessage, addNewChannel, removeSelectedChannel, renameSelectedChannel } = useContext(ChatContext);

  useEffect(() => {
    // Создаем массив для хранения сокетов
    const sockets = [];
  
    // Подключаем сокеты
    const newMessageSocket = io(appRoutes.chatPagePath(), { autoConnect: true });
    const newChannelSocket = io(appRoutes.chatPagePath(), { autoConnect: true });
    const removeChannelSocket = io(appRoutes.chatPagePath(), { autoConnect: true });
    const renameChannelSocket = io(appRoutes.chatPagePath(), { autoConnect: true });
  
    // Добавляем сокеты в массив
    sockets.push(newMessageSocket, newChannelSocket, removeChannelSocket, renameChannelSocket);
  
    // Обработчики событий для каждого сокета
    const handleNewMessage = (message) => {
      addNewMessage(message);
    };
  
    const handleNewChannel = (channel) => {
      addNewChannel(channel);
    };
  
    const handleRemoveChannel = (channel) => {
      removeSelectedChannel(channel.id);
    };
  
    const handleRenameChannel = (channel) => {
      renameSelectedChannel({ id: channel.id, changes: { name: channel.name } });
    };
  
    newMessageSocket.on('newMessage', handleNewMessage);
    newChannelSocket.on('newChannel', handleNewChannel);
    removeChannelSocket.on('removeChannel', handleRemoveChannel);
    renameChannelSocket.on('renameChannel', handleRenameChannel);
  
    // Возвращаем функцию очистки (отключения от сокетов)
    return () => {
      // Отключаем обработчики событий для каждого сокета
      newMessageSocket.off('newMessage', handleNewMessage);
      newChannelSocket.off('newChannel', handleNewChannel);
      removeChannelSocket.off('removeChannel', handleRemoveChannel);
      renameChannelSocket.off('renameChannel', handleRenameChannel);
  

    };
  }, [addNewMessage, addNewChannel, removeSelectedChannel, renameSelectedChannel]);

  useEffect(() => {
    dispatch(fetchInitialData(getServerData));
  }, [dispatch, getServerData]);

  useEffect(() => {
    if (loadingStatus === 'failed' || loadingStatus === 'authError') {
      logOut();
      navigate(appRoutes.loginPagePath());
      const errorMessage = loadingStatus === 'failed' ? t('toast.networkError') : t('toast.authError');
      const errorType = loadingStatus === 'failed' ? 'ChatFailed' : 'AuthFailed';
      toast.error(errorMessage);
      rollbar.error(errorType);
    }
  }, [loadingStatus, logOut, navigate, rollbar, t]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <ModalWindow />
        <ChannelsPanel />
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <ChatPanel
              currentChannelName={currentChannelName}
              currentChannelMessagesCount={currentChannelMessagesCount}
            />
            <MessageBox currentChannelMessages={currentChannelMessages} />
            <MessageForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
