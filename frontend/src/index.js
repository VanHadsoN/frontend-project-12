import ReactDOM from 'react-dom/client';
import AppWrapper from './init';

import './index.css';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(await AppWrapper());
};

app();
