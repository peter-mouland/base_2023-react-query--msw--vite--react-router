import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { SymbolsComboBox } from './index.ts';

// eslint-disable-next-line react/prop-types
const TestContext = ({ children }) => (
    <BrowserRouter>
        <Routes>
            <Route path="/:symbol?" element={children} isExact={false} />
        </Routes>
    </BrowserRouter>
);

describe('SymbolsComboBox', () => {
    test('renders button UI', () => {
        render(
            <TestContext>
                <SymbolsComboBox options={[]} />
            </TestContext>,
        );
        expect(screen.getByRole('combobox', { name: 'Select Symbol...' })).toBeInTheDocument();
    });
});
