import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledNotFoundContainer as NotFoundContainer } from '../index';


Enzyme.configure({ adapter: new Adapter() });

describe('<NotFoundContainer />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <NotFoundContainer />,
    ).dive();
    expect(renderedComponent.getElement()).not.toBeNull();
  });
});

