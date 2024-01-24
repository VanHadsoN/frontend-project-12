import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useServer } from '../../providers/ServerProvider';
import { selectors as modalSelectors } from '../../slices/modalSlice';

const Remove = ({ handleClose }) => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const { removeChannel } = useServer();
  const { channelId } = useSelector(modalSelectors.getModalContext);

  const handleRemove = async () => {
    try {
      await removeChannel(channelId);
      handleClose();
      toast(t('modals.remove.toast'));
    } catch (error) {
      toast.error(t('errors.errorConection'));
      rollbar.error('Error removing channel', error);
    }
  };

  return (
    <>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('modals.remove.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.remove.body')}</p>
        <div className="d-flex justify-content-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="me-2"
          >
            {t('buttons.cancelBtn')}
          </Button>
          <Button type="submit" variant="danger" onClick={handleRemove}>
            {t('modals.remove.submitBtn')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
