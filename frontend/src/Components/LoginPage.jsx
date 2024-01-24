import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';

import { useAuth } from '../providers/AuthProvider';
import routes from '../routes';

const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const navigation = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t('validation.required')),
    password: Yup.string().required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await auth.logIn(values);
        navigation(routes.mainPage());
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          toast.error(t('errors.error401'));
          return;
        }
        toast.error(t('errors.errorConection'));
        rollbar.error('Error logging in', error);
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
                  src={`${process.env.PUBLIC_URL}/images/login.jpg`}
                  roundedCircle
                />
              </Col>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-12 col-md-6"
              >
                <h1 className="text-center mb-4">{t('logInPage.title')}</h1>
                <FloatingLabel
                  controlId="username"
                  label={t('logInPage.username')}
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={formik.values.username}
                    placeholder="username"
                    name="username"
                    isInvalid={authFailed}
                    onChange={formik.handleChange}
                    required
                    autoFocus
                    disabled={formik.isSubmitting}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="password"
                  label={t('logInPage.password')}
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    value={formik.values.password}
                    placeholder="password"
                    name="password"
                    isInvalid={authFailed}
                    onChange={formik.handleChange}
                    required
                    disabled={formik.isSubmitting}
                    ref={target}
                  />
                  {authFailed ? (
                    <div className="invalid-tooltip">
                      {t('logInPage.authFailed')}
                    </div>
                  ) : null}
                </FloatingLabel>
                <Button
                  variant="outline-primary"
                  type="submit"
                  size="lg"
                  className="mb-3 w-100"
                  disabled={formik.isSubmitting}
                >
                  {t('logInPage.submitBtn')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-muted text-center">
                <span>{t('logInPage.noAccount')}</span>
                {' '}
                <Link to="/signup">{t('logInPage.signUp')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
