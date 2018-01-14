import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledHomePage as HomePage } from '../index';


Enzyme.configure({ adapter: new Adapter() });

describe('<HomePage />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <HomePage />,
    ).dive();
    expect(renderedComponent).toBeDefined();
  });
});

