import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import useAuth from '../hooks/useAuth.jsx';
import routes from '../routes.js';
import showToast from '../toastify/showToast.js';

const LoginPage = () => {
  const [authenticated, setAuthenticated] = useState(true);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const auth = useAuth();
  const inputEl = useRef();

  const signupSchema = yup.object({
    username: yup.string()
      .min(3, t('errors.usernameMin'))
      .max(20, t('errors.usernamemax'))
      .required(t('errors.required')),
    password: yup.string()
      .min(5, t('errors.passwordMin'))
      .required(t('errors.required')),
  });

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(routes.loginPath(), values);

        auth.setToken(response.data);
        auth.logIn();

        navigate(routes.chatPagePath());
      } catch (error) {
        formik.setSubmitting(false);
        showToast(t('toastify.connectionError'), 'error');
        if (error.isAxiosError && error.response.status === 401) {
          setAuthenticated(false);
          inputEl.current.select();
          return;
        }
        throw error;
      }
    },
  });

  return (
    <div className="container-fluid" style={{ marginTop: '10vh' }}>
      <div className="row justify-content-center pt-4">
        <div className="col-sm-auto">
          <h1 className="mb-3 text-center">{t('loginForm.title')}</h1>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="form-floating mb-3" style={{ width: '400px' }}>
              <Form.Control
                type="text"
                onChange={formik.handleChange}
                value={formik.values.username}
                name="username"
                id="username"
                isInvalid={!authenticated}
                required
                ref={inputEl}
                size="lg"
              />

              <Form.Label htmlFor="username">{t('loginForm.username')}</Form.Label>
            </Form.Group>

            <Form.Group className="form-floating mb-3" style={{ width: '400px' }}>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
                id="password"
                isInvalid={!authenticated}
                required
                size="lg"
              />

              <Form.Label htmlFor="password">{t('loginForm.password')}</Form.Label>

              <Form.Control.Feedback type="invalid" className="invalid-feedback">
                {t('errors.loginForm') || null}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              style={{ width: '400px' }}
              type="submit"
              variant="outline-primary"
            >
              {t('loginForm.submitButton')}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
