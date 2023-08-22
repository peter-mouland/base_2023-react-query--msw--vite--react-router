import { expect, test, describe } from 'vitest';
import { screen } from '@testing-library/react';

// import { ChartCard } from './index.ts';

describe('ChartCard', () => {
    // Error: require() of ES Module
    test.skip('renders a title', () => {
        // render(<ChartCard symbol={'test'} />);
        expect(screen.getByRole('h3')).toHaveText('Stocks: test');
    });
});
