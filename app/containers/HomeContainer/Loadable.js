/**
 *
 * Asynchronously loads the component for HomeContainer
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "HomeContainer" */ './index'),
  loading: () => null,
});
