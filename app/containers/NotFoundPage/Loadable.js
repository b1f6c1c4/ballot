/**
 *
 * Asynchronously loads the component for NotFoundPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "NotFoundPage" */ './index'),
  loading: () => null,
});
