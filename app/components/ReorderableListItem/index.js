import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { DragSource, DropTarget } from 'react-dnd';

class ReorderableListItem extends React.PureComponent {
  render() {
    const {
      children,
      connectDragSource,
      connectDropTarget,
    } = this.props;

    return compose(
      connectDropTarget,
      connectDragSource,
    )(children);
  }
}

ReorderableListItem.propTypes = {
  children: PropTypes.any,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

const itemSource = {
  beginDrag: ({ index }) => ({ index }),
  canDrag: ({ disabled }) => !disabled,
};

const itemTarget = {
  canDrop(props, monitor) {
    const { index: from } = monitor.getItem();
    const { index: to } = props;

    return from !== to;
  },

  drop(props, monitor) {
    const { index: from } = monitor.getItem();
    const { index: to } = props;

    props.onReorder({
      from,
      to,
    });
  },
};


const connectTarget = (connect) => ({
  connectDropTarget: connect.dropTarget(),
});

const connectSource = (connect) => ({
  connectDragSource: connect.dragSource(),
});

export default compose(
  DropTarget('ReorderableListItem', itemTarget, connectTarget),
  DragSource('ReorderableListItem', itemSource, connectSource),
)(ReorderableListItem);
