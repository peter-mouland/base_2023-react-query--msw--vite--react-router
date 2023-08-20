import cx from 'classnames';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import schrodersLogo from './assets/schroders.svg';
import styles from './app.module.css';

// Create a client
const queryClient = new QueryClient();
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <h1>
                <a href="https://www.schroders.com/" target="_blank" rel="noreferrer">
                    <img src={schrodersLogo} className={cx(styles.logo)} alt="Schroders" />
                </a>

                {/*<span>Schroders</span>*/}
            </h1>
        </QueryClientProvider>
    );
}

export default App;
