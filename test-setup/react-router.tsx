import {BrowserRouter} from 'react-router-dom'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const renderWithRouter = (ui, { state={}, route = '/' } = {}) => {
    window.history.pushState(state, 'Test page', route)

    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: BrowserRouter }),
    }
}

export const wrapperWithRouter = (ui, { state = {}, route = '/' }) => {
    window.history.pushState(state, 'Test page', route);
    return (
        <BrowserRouter>{ui}</BrowserRouter>
    );
}
