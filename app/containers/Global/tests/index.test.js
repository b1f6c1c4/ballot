import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledGlobal as Global, mapDispatchToProps } from '../index';

import * as globalActions from '../actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<Global />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <Global
        // Selectors
        isDrawerOpen={false}
        hasCredential={false}
        // Actions
        onToggleDrawerOpenAction={jest.fn()}
      />,
    ).dive();
    expect(renderedComponent).toBeDefined();
  });
});

describe('mapDispatchToProps', () => {
  // Actions
  describe('onToggleDrawerOpenAction', () => {
    it('should be injected', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      expect(result.onToggleDrawerOpenAction).toBeDefined();
    });

    it('should dispatch toggleDrawerOpen when called', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      result.onToggleDrawerOpenAction();
      expect(dispatch).toHaveBeenCalledWith(globalActions.toggleDrawerOpen());
    });
  });
});
