/**
 *
 * Asynchronously loads the component for LoginPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "LoginPage" */ './index'),
  loading: () => null,
});
