import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledLoginContainer as LoginContainer, mapDispatchToProps } from '../index';

import * as loginPageActions from '../actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<LoginContainer />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <LoginContainer
        // Selectors
        isLoading={false}
        // Actions
        onSubmitLoginAction={jest.fn()}
      />,
    ).dive();
    expect(renderedComponent).toBeDefined();
  });
});

describe('mapDispatchToProps', () => {
  // Actions
  describe('onSubmitLoginAction', () => {
    it('should be injected', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      expect(result.onSubmitLoginAction).toBeDefined();
    });

    it('should dispatch submitLogin when called', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      result.onSubmitLoginAction();
      expect(dispatch).toHaveBeenCalledWith(loginPageActions.submitLogin());
    });
  });
});
