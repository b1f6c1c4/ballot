/**
 *
 * Asynchronously loads the component for LoginContainer
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "LoginContainer" */ './index'),
  loading: () => null,
});
