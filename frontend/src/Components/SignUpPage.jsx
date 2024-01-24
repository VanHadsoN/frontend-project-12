import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { useAuth } from '../providers/AuthProvider';
import routes from '../routes';

const SignUpPage = () => {
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const [authFailed, setAuthFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(t('errors.error401'));
  const rollbar = useRollbar();
  const navigation = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('validation.required'))
      .min(3, t('validation.min3'))
      .max(20, t('validation.max20')),
    password: Yup.string()
      .required(t('validation.required'))
      .min(6, t('validation.min6'))
      .matches(/[a-zA-Z0-9]/, t('validation.correctSymbols')),
    passwordConfirmation: Yup.string()
      .required(t('validation.required'))
      .oneOf([Yup.ref('password'), null], t('validation.passwordConfirmation')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: async ({ username, password }) => {
      try {
        await signUp(username, password);
        navigation(routes.mainPage());
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 409) {
          setAuthFailed(true);
          setErrorMessage(t('errors.error409'));
          return;
        }
        toast.error(t('errors.errorConnection'));
        rollbar.error('Error signing up', error);
      }
    },
  });

  const target = useRef(null);

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col
                xs={12}
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <Image
                  src={`${process.env.PUBLIC_URL}/images/signup.jpg`}
                  roundedCircle
                />
              </Col>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-12 col-md-6"
              >
                <h1 className="text-center mb-4">{t('signUpPage.title')}</h1>
                <FloatingLabel
                  controlId="username"
                  label={t('signUpPage.username')}
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={formik.values.username}
                    placeholder="username"
                    name="username"
                    isInvalid={
                      !!formik.errors.username && formik.touched.username
                    }
                    onChange={formik.handleChange}
                    required
                    autoFocus
                    disabled={formik.isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {t(formik.errors.username)}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                  controlId="password"
                  label={t('signUpPage.password')}
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    value={formik.values.password}
                    placeholder="password"
                    name="password"
                    isInvalid={
                      !!formik.errors.password && formik.touched.password
                    }
                    onChange={formik.handleChange}
                    required
                    disabled={formik.isSubmitting}
                    ref={target}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {t(formik.errors.password)}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                  controlId="passwordConfirmation"
                  label={t('signUpPage.passwordConfirmation')}
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    value={formik.values.passwordConfirmation}
                    placeholder="passwordConfirmation"
                    name="passwordConfirmation"
                    isInvalid={
                      !!formik.errors.passwordConfirmation
                      && formik.touched.passwordConfirmation
                    }
                    onChange={formik.handleChange}
                    required
                    disabled={formik.isSubmitting}
                    ref={target}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {t(formik.errors.passwordConfirmation)}
                  </Form.Control.Feedback>
                </FloatingLabel>
                {authFailed ? (
                  <Alert variant="danger">{errorMessage}</Alert>
                ) : null}
                <Button
                  variant="outline-primary"
                  type="submit"
                  size="lg"
                  className="mb-3 w-100"
                  disabled={formik.isSubmitting}
                >
                  {t('signUpPage.submitBtn')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
