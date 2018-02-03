import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import {
  List,
} from 'material-ui';
import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';

class ReorderableList extends React.PureComponent {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { children, ...other } = this.props;

    return (
      <List {...other}>
        {children}
      </List>
    );
  }
}

ReorderableList.propTypes = {
  children: PropTypes.any,
};

export default compose(
  DragDropContext(MultiBackend(HTML5toTouch)),
)(ReorderableList);
