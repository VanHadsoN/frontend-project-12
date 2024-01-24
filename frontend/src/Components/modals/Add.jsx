import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { channelsSelectors } from '../../slices/channelsSlice';
import { useServer } from '../../providers/ServerProvider';

const Add = ({ handleClose }) => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const channels = useSelector(channelsSelectors.selectAllChannelsNames);
  const { addChannel } = useServer();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required(t('validation.required'))
      .notOneOf(channels, t('validation.channelAlreadyExists'))
      .min(3, t('validation.min3'))
      .max(20, t('validation.max20')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async ({ name }) => {
      try {
        await addChannel(name);
        formik.resetForm();
        handleClose();
        toast(t('modals.add.toast'));
      } catch (error) {
        toast.error(t('errors.errorConection'));
        rollbar.error('Error adding channel', error);
      } finally {
        inputRef.current.focus();
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('modals.add.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={!!formik.errors.name && formik.touched.name}
              name="name"
              id="name"
              className="mb-2"
            />
            <Form.Label className="visually-hidden">
              {t('modals.add.name')}
            </Form.Label>
            {formik.errors.name ? (
              <div className="invalid-feedback">{t(formik.errors.name)}</div>
            ) : null}
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                {t('buttons.cancelBtn')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formik.isSubmitting}
              >
                {t('modals.add.submitBtn')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Add;
