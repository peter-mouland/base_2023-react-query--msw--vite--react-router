import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/dashboard.tsx';
import './main.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/:symbol?" element={<Dashboard />} isExact={false} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);
