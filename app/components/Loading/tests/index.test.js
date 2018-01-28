import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledLoading as Loading } from '../index';

Enzyme.configure({ adapter: new Adapter() });

describe('<Loading />', () => {
  it('should not render if delaying', () => {
    const renderedComponent = shallow(
      <Loading
        pastDelay={false}
      />,
    ).dive();
    expect(renderedComponent.getElement()).toBeNull();
  });
  it('should render if not delaying', () => {
    const renderedComponent = shallow(
      <Loading
        pastDelay
      />,
    ).dive();
    expect(renderedComponent.getElement()).not.toBeNull();
  });
  it('should render if error', () => {
    const renderedComponent = shallow(
      <Loading
        error={{}}
      />,
    ).dive();
    expect(renderedComponent.getElement()).not.toBeNull();
  });
});
