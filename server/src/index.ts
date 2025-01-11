/**
 * Application methods
 */
import bootstrap from './bootstrap';
import destroy from './destroy';
import register from './register';

/**
 * Plugin server methods
 */
import config from './config';
import controllers from './controllers';
import middlewares from './middlewares';
import policies from './policies';
import services from './services';
import routes from './routes';

export default {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  policies,
  middlewares,
};
