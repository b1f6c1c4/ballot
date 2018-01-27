import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledHomeContainer as HomeContainer } from '../index';


Enzyme.configure({ adapter: new Adapter() });

describe('<HomeContainer />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <HomeContainer />,
    ).dive();
    expect(renderedComponent).toBeDefined();
  });
});

