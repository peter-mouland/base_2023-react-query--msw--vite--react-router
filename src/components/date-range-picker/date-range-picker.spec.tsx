import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { CalendarDateRangePicker } from './index.ts';

// eslint-disable-next-line react/prop-types
const TestContext = ({ children }) => (
    <BrowserRouter>
        <Routes>
            <Route path="/:symbol?" element={children} isExact={false} />
        </Routes>
    </BrowserRouter>
);

describe('CalendarDateRangePicker', () => {
    test('renders button UI', () => {
        render(
            <TestContext>
                <CalendarDateRangePicker />
            </TestContext>,
        );
        expect(screen.getByRole('button', { name: 'Pick a date' })).toBeInTheDocument();
    });
    test.skip('renders range picker when button clicked', () => {
        render(
            <TestContext>
                <CalendarDateRangePicker />
            </TestContext>,
        );
        userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
        screen.debug();
        expect(screen.getByText('August')).toBeInTheDocument();
    });
});
