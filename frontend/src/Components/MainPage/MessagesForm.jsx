import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { useServer } from '../../providers/ServerProvider';
import { useAuth } from '../../providers/AuthProvider';

const MessagesForm = ({ channelId }) => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const { sendMessage } = useServer();
  const { getUserName } = useAuth();
  const inputRef = useRef();

  const validationSchema = Yup.object({
    body: Yup.string().trim().required(),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    onSubmit: async ({ body }) => {
      const message = {
        body,
        username: getUserName(),
        channelId,
      };
      try {
        await sendMessage(message);
        formik.resetForm();
      } catch (error) {
        toast.error(t('errors.errorConection'));
        rollbar.error('Error sending message', error);
      } finally {
        inputRef.current.focus();
      }
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting) {
      inputRef.current.focus();
    }
  }, [formik.isSubmitting, channelId]);

  return (
    <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup className="has-validation">
        <Form.Control
          value={formik.values.body}
          placeholder={t('messages.messagesForm.placeholder')}
          name="body"
          className="border-0 p-0 ps-2"
          onChange={formik.handleChange}
          ref={inputRef}
          aria-label={t('messages.messagesForm.input')}
        />
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="btn btn-group-vertical"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
            />
            <span className="visually-hidden">
              {t('messages.messagesForm.submitBtn')}
            </span>
          </svg>
        </button>
      </InputGroup>
    </Form>
  );
};

export default MessagesForm;
