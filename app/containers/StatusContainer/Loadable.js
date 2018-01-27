/**
 *
 * Asynchronously loads the component for StatusContainer
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "StatusContainer" */ './index'),
  loading: () => null,
});
