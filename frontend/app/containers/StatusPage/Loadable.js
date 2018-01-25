/**
 *
 * Asynchronously loads the component for StatusPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "StatusPage" */ './index'),
  loading: () => null,
});
