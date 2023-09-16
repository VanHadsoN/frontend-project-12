import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import fetchData from '../actions/fetchData.js';

import Channels from '../components/Channels.jsx';
import Messages from '../components/Messages.jsx';
import showToast from '../toastify/showToast.js';

const Chat = () => (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
);

const ChatPage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        await dispatch(fetchData());
      } catch (error) {
        if (error.isAxiosError && error.response.status === 409) {
          showToast(t('toastify.connectionError'), 'warning');
        } else {
          showToast(t('toastify.athorizationError'), 'error');
          console.error(error.message);
        }
      }
    };

    handleFetchData();
  }, [dispatch, t]);

  return (<Chat />);
};

export default ChatPage;