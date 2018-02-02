import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import {
  List,
} from 'material-ui';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
  classes: PropTypes.object.isRequired,
  children: PropTypes.any,
};

export default compose(
  DragDropContext(HTML5Backend),
)(ReorderableList);
