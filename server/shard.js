const Api = require('kubernetes-client');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Mongos, Server } = require('mongodb');
const logger = require('./logger');

const execute = (top) => async (cmd) => {
  logger.info(`Executing ${JSON.stringify(cmd)}`);
  top.command('admin', cmd, {}, (ex, rx) => {
    if (ex) {
      logger.error(ex);
      throw rx;
    }
    logger.info(`Server response: ${JSON.stringify(rx)}`);
    if (rx.result.ok === 1) {
      return rx;
    }
    throw rx;
  });
};

module.exports = async () => {
  const cfg = Api.config.getInCluster();
  logger.info('Got credential from mounted k8s');
  const core = new Api.Core(cfg);

  logger.info('Fetching services with tier maingdb');
  try {
    const data = await core.namespaces.services.matchLabels({
      tier: 'maindb',
    }).getPromise();

    const services = data.items.map((it) => it.metadata.name);
    logger.info(`Services: ${JSON.stringify(services)}`);

    const ids = services.map((sv) => sv.match(/^mongodb-shard(\d+)-headless-service$/)[1]);
    logger.info(`Indexes: ${JSON.stringify(ids)}`);

    const cmds = ids.map((i) => ({
      addShard: `${cfg.namespace}-shard${i}/mongodb-shard${i}-0.mongodb-shard${i}-headless-service.${cfg.namespace}.svc.cluster.local:27017`,
      name: `shard${i}`,
    }));

    const mongos = new Mongos([
      new Server('localhost', 27017),
    ]);
    await mongos.connect();

    const rxs = await Promise.all(cmds.map(execute(mongos)));
    logger.info('Done setting up mongos.');
    return rxs;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
