import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import init from './init';

const renderApp = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const app = await init();
  root.render(app);
};

renderApp();
