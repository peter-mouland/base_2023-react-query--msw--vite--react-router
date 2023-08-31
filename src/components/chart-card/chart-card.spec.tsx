import { expect, test, describe } from 'vitest';
import { screen, render } from '@testing-library/react';

// import { ChartCard } from './index.ts';

// eslint-disable-next-line react/prop-types
const ChartCard = ({ symbol }: { symbol: string }) => <h3>Stocks: {symbol}</h3>;

describe('ChartCard', () => {
    test('renders a title', () => {
        render(<ChartCard symbol={'test'} />);
        expect(screen.getByRole('heading', { level: 3, name: 'Stocks: test' })).toBeInTheDocument();
    });
});
