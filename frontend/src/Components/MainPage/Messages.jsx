import { useTranslation } from 'react-i18next';

import Col from 'react-bootstrap/Col';

import MessagesForm from './MessagesForm';
import MessagesList from './MessagesList';

const Messages = ({ channel, messages, filter }) => {
  const { t } = useTranslation();

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{`# ${filter.clean(channel.name)}`}</b>
          </p>
          <span className="text-muted">
            {t('messages.counter.count', { count: messages.length })}
          </span>
        </div>
        <MessagesList messages={messages} channelId={channel.id} />
        <div className="mt-auto px-5 py-3">
          <MessagesForm channelId={channel.id} />
        </div>
      </div>
    </Col>
  );
};

export default Messages;
