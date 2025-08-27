import React from 'react';
import { Child } from './child';
import { render } from '@testing-library/react';

test('child component should render', () => {
    const { asFragment } = render(<Child name={'test'}/>);
    expect(asFragment()).toMatchSnapshot();
});
