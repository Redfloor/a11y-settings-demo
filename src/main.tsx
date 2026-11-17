import '@fontsource/opendyslexic/400.css';
import '@fontsource/opendyslexic/700.css';
import './theme/base.css';
import './i18n/i18n';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {App} from './App';

const root = document.getElementById('root');
if (root === null) {
    throw new Error('No #root element in index.html');
}

createRoot(root).render(
    <StrictMode>
        <App/>
    </StrictMode>,
);
