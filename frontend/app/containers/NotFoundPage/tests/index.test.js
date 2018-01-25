import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledNotFoundPage as NotFoundPage } from '../index';


Enzyme.configure({ adapter: new Adapter() });

describe('<NotFoundPage />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <NotFoundPage />,
    ).dive();
    expect(renderedComponent).toBeDefined();
  });
});

