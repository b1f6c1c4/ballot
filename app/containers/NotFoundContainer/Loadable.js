/**
 *
 * Asynchronously loads the component for NotFoundContainer
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "NotFoundContainer" */ './index'),
  loading: () => null,
});
