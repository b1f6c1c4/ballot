import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledLoading as Loading } from '../index';

Enzyme.configure({ adapter: new Adapter() });

describe('<Loading />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <Loading />,
    ).dive();
    expect(renderedComponent).toBeDefined();
  });
});
