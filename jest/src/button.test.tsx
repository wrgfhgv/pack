import React from 'react';
import { mount, configure } from 'enzyme';
import { Button } from './button';
import { a } from './a';
// button.test.tsx
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });
test('asd', () => {
  expect('123').toBe('123');
});

test('ddd', () => {
  expect(a()).toBe(123);
});

describe('Basic', () => {
  it('component should render something', () => {
    const wrapper = mount(<Button />);
    expect(wrapper.isEmptyRender()).toBeFalsy();
  });
});
