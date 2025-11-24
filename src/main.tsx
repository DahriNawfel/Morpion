import ReactDOM from 'react-dom/client'
import App from './App'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Pas trouvé #root, tu t'es goon toi-même.");
}

ReactDOM.createRoot(rootElement).render(
  <App />
);
    