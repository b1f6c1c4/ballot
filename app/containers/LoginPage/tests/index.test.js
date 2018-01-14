import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledLoginPage as LoginPage, mapDispatchToProps } from '../index';

import * as loginPageActions from '../actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<LoginPage />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <LoginPage
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
