import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LeoProfanity from 'leo-profanity';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

import { actions as channelsActions } from '../../slices/channelsSlice';
import * as modalSlice from '../../slices/modalSlice';

const NotRemovableChannel = ({
  name, id, isCurrentChannel, handleSelect,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={() => handleSelect(Number(id))}
      variant={isCurrentChannel(id) ? 'secondary' : 'light'}
      className="w-100 rounded-0 text-start text-truncate"
    >
      <span className="me-1">{t('channels.channelSign')}</span>
      {name}
    </Button>
  );
};

const RemovableChannel = ({
  name,
  id,
  isCurrentChannel,
  handleSelect,
  handleRemove,
  handleRename,
}) => {
  const { t } = useTranslation();

  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <NotRemovableChannel
        name={name}
        id={id}
        isCurrentChannel={isCurrentChannel}
        handleSelect={handleSelect}
      />
      <Dropdown.Toggle
        split
        variant={isCurrentChannel(id) ? 'primary' : 'ligth'}
        id="dropdown-split-basic"
      >
        <span className="visually-hidden">{t('channels.control')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRemove(Number(id))}>
          {t('channels.remove')}
        </Dropdown.Item>
        <Dropdown.Item onClick={handleRename(Number(id), name)}>
          {t('channels.rename')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Channels = ({ channels, currentChannel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const profanityFilter = LeoProfanity;

  const isCurrentChannel = (currentId) => {
    const { id } = currentChannel;
    return currentId === id;
  };

  const handleSelect = (id) => {
    dispatch(channelsActions.setCurrentChannel(id));
  };

  const handleAdd = () => {
    dispatch(modalSlice.actions.open({ type: 'add' }));
  };

  const handleRename = (id, name) => () => {
    const context = {
      channelId: id,
      channelName: name,
    };

    dispatch(modalSlice.actions.open({ type: 'rename', context }));
  };

  const handleRemove = (id) => () => {
    const context = {
      channelId: id,
    };

    dispatch(modalSlice.actions.open({ type: 'remove', context }));
  };

  return (
    <Col
      xs={4}
      md={2}
      className="border-end px-0 bg-light flex-column h-100 d-flex"
    >
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.title')}</b>
        <Button
          onClick={handleAdd}
          variant="outline-primary"
          className="p-0 d-flex btn-group-vertical"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width={20}
            height={20}
          >
            <rect x="9.5" y="5" width="1" height="10" />
            <rect x="5" y="9.5" width="10" height="1" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map(({ name, id, removable }) => {
          if (removable) {
            return (
              <li key={id} className="nav-item w-100">
                <RemovableChannel
                  name={profanityFilter.clean(name)}
                  id={id}
                  isCurrentChannel={isCurrentChannel}
                  handleSelect={handleSelect}
                  handleRemove={handleRemove}
                  handleRename={handleRename}
                />
              </li>
            );
          }
          return (
            <li key={id} className="nav-item w-100">
              <NotRemovableChannel
                name={profanityFilter.clean(name)}
                id={id}
                isCurrentChannel={isCurrentChannel}
                handleSelect={handleSelect}
              />
            </li>
          );
        })}
      </ul>
    </Col>
  );
};

export default Channels;
