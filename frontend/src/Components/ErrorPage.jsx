import { useTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <Card className="text-center h-100">
      <Card.Body>
        <Card.Title>{t('errorPage.title')}</Card.Title>
        <Card.Text>{t('errorPage.body')}</Card.Text>
        <Card.Text>{t('errorPage.errorName')}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ErrorPage;
