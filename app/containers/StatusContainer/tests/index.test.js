import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { styledStatusContainer as StatusContainer, mapDispatchToProps } from '../index';

import * as statusPageActions from '../actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<StatusContainer />', () => {
  it('should render', () => {
    const renderedComponent = shallow(
      <StatusContainer
        // Selectors
        version="the-v"
        commitHash="the-h"
        // Actions
        onFetchStatusAction={jest.fn()}
      />,
    ).dive();
    expect(renderedComponent).toBeDefined();
  });
});

describe('mapDispatchToProps', () => {
  // Actions
  describe('onFetchStatusAction', () => {
    it('should be injected', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      expect(result.onFetchStatusAction).toBeDefined();
    });

    it('should dispatch fetchStatus when called', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      result.onFetchStatusAction();
      expect(dispatch).toHaveBeenCalledWith(statusPageActions.fetchStatus());
    });
  });
});
