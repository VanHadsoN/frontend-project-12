import { toast } from 'react-toastify';
import { useEffect } from 'react';
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
