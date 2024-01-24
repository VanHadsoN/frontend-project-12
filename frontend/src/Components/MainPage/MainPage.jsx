import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LeoProfanity from 'leo-profanity';

import { channelsSelectors } from '../../slices/channelsSlice';
import { messagesSelectors } from '../../slices/messagesSlice';
import { loadingStatusSelectors } from '../../slices/loadingStatusSlice';
import { useServer } from '../../providers/ServerProvider';
import fetchInitialData from '../../slices/thunk';
import routes from '../../routes';
import Channels from './Channels';
import Messages from './Messages';
import Modal from '../modals/index';

const profanityFilter = LeoProfanity;

const Error = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="text-center">
      <Card.Body>
        <Card.Title>{t('errors.smthWentWrong')}</Card.Title>
        <Button onClick={() => navigate(routes.loginPage())}>
          {t('buttons.reloadBtn')}
        </Button>
      </Card.Body>
    </Card>
  );
};

const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <div className="m-auto w-auto">
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">{t('loadingStatus')}</span>
      </Spinner>
    </div>
  );
};

const Children = () => {
  const loadingStatus = useSelector(loadingStatusSelectors.getStatus);
  const channels = useSelector(channelsSelectors.selectAllChannels);
  const currentChannel = useSelector(channelsSelectors.selectCurrentChannel);
  const currentChannelMessages = useSelector(
    messagesSelectors.selectCurrentChannelMessages,
  );

  switch (loadingStatus) {
    case 'successful':
      return (
        <>
          <Channels channels={channels} currentChannel={currentChannel} />
          <Messages
            channel={currentChannel}
            messages={currentChannelMessages}
            filter={profanityFilter}
          />
        </>
      );

    case 'failed':
      return <Error />;

    default:
      return <LoadingState />;
  }
};

const MainPage = () => {
  const dispatch = useDispatch();
  const { getServerData, connectSocket, disconnectSocket } = useServer();

  useEffect(() => {
    dispatch(fetchInitialData(getServerData));
    connectSocket();

    return () => disconnectSocket();
  }, [dispatch, connectSocket, disconnectSocket, getServerData]);

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-nowrap">
          <Children />
        </Row>
      </Container>
      <Modal />
    </>
  );
};

export default MainPage;
