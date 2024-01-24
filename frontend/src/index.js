import ReactDOM from 'react-dom/client';
import './index.css';
import runApp from './init';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('chat'));
  root.render(await runApp());
};

app();
