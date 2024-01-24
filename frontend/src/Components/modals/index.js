import { useDispatch, useSelector } from 'react-redux';

import Modal from 'react-bootstrap/Modal';

import Add from './Add.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';
import {
  actions as modalActions,
  selectors as modalSelectors,
} from '../../slices/modalSlice.js';

const modals = {
  add: Add,
  remove: Remove,
  rename: Rename,
};

const ModalWindow = () => {
  const dispatch = useDispatch();
  const isOpened = useSelector(modalSelectors.isModalOpened);
  const modalType = useSelector(modalSelectors.getModalType);
  const handleClose = () => dispatch(modalActions.close());

  const CurentModal = modals[modalType];

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={isOpened}
      onHide={handleClose}
    >
      {CurentModal ? <CurentModal handleClose={handleClose} /> : null}
    </Modal>
  );
};

export default ModalWindow;
