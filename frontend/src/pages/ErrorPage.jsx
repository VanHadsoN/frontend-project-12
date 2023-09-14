import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
    const { t } = useTranslation();

    return (
    <div id="error-page" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h1>{t('404.title')}</h1>
        <p>{t('404.text')}</p>
        <p>
        <i>
            <b>{t('404.descr')}</b>
        </i>
        </p>
    </div>
    );
};

export default ErrorPage;
