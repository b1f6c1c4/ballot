const _ = require('lodash');
const logger = require('../../logger')('graphql/projection');

const theConfig = {
  // Ballot
  Ballot: {
    proj: {
      bId: '_id',
      q: 'crypto.q',
      g: 'crypto.g',
      h: 'crypto.h',
    },
  },

  // Ballot
  BallotField: {
    prefix: 'fields.',
    typeProj: 'type',
  },

  // Ballot
  StringField: {
    prefix: 'fields.',
    proj: {
      default: [
        'data',
        'data[0]',
      ],
    },
  },

  // Ballot
  EnumField: {
    prefix: 'fields.',
    proj: {
      items: 'data',
    },
  },

  // Ballot
  BallotVoter: {
    prefix: 'voters.',
    proj: {
      iCode: '_id',
    },
  },

  // SignedTicket
  BallotTicket: {
    proj: {
      t: '_id',
    },
  },

  // SignedTicket
  TicketPayload: {
    prefix: 'payload.',
  },
};


const genResolvers = (config) => {
  logger.trace('genResolvers', config);
  if (!config.proj) {
    return {};
  }
  const res = {};
  try {
    Object.keys(config.proj).forEach((k) => {
      const def = config.proj[k];
      if (Array.isArray(def)) {
        if (def[1]) {
          res[k] = (v) => _.get(v, def[1]);
        }
      } else if (typeof def === 'string') {
        res[k] = (v) => _.get(v, def);
      } else {
        throw new Error(`config.proj.${k} not supported: ${typeof def}`);
      }
    });
  } catch (e) {
    logger.fatal('genResolvers', e);
    throw e;
  }
  logger.trace('Generated resolvers', Object.keys(res));
  return res;
};

const stripType = (typeRef) => {
  if (typeRef.ofType) {
    return stripType(typeRef.ofType);
  }
  return typeRef.name;
};

function gen(
  root,
  context,
  type = context.typeCondition.name.value,
) {
  const { config, info } = root;
  logger.debug('Projecting type', type);
  const cfg = config[type];
  if (!cfg) {
    logger.error('Type not found', type);
    return undefined;
  }
  const proj = {};
  const prefix = cfg.prefix || '';
  if (cfg.typeProj) {
    logger.trace('>TypeProj', prefix + cfg.typeProj);
    proj[prefix + cfg.typeProj] = 1;
  }
  const sels = context.selectionSet.selections;
  try {
    sels.forEach((sel) => {
      switch (sel.kind) {
        case 'Field': {
          logger.debug('Projecting field', sel.name.value);
          const def = _.get(cfg.proj, sel.name.value);
          if (!def) {
            if (!sel.selectionSet) {
              logger.trace('>Default', prefix + sel.name.value);
              proj[prefix + sel.name.value] = 1;
            } else {
              const typeRef = info.schema.getType(type);
              if (!typeRef) {
                throw new Error('Type not found', type);
              }
              logger.trace('typeRef', typeRef.toString());
              const field = typeRef.getFields()[sel.name.value];
              if (!field) {
                throw new Error('Field not found', sel.name.value);
              }
              const nextTypeRef = field.type;
              logger.trace('nextTypeRef', nextTypeRef.toString());
              const core = stripType(nextTypeRef);
              logger.trace('Recursive', core);
              Object.assign(proj, gen(root, sel, core));
            }
          } else if (Array.isArray(def)) {
            if (def[0]) {
              logger.trace('>Array', prefix + def[0]);
              proj[prefix + def[0]] = 1;
            }
          } else if (typeof def === 'string') {
            logger.trace('>Simple', prefix + def);
            proj[prefix + def] = 1;
          }
          return;
        }
        case 'InlineFragment': {
          logger.debug('Projecting inline fragment');
          const core = _.get(sel, 'typeCondition.name.value') || type;
          logger.trace('Recursive', core);
          Object.assign(proj, gen(root, sel, core));
          return;
        }
        case 'FragmentSpread':
          logger.debug('Projecting fragment', sel.name.value);
          logger.trace('Recursive', sel.name.value);
          Object.assign(proj, gen(root, info.fragments[sel.name.value]));
          return;
        default:
          throw new Error(`sel.kind not supported: ${sel.kind}`);
      }
    });
    return proj;
  } catch (e) {
    logger.error('Projecting', e);
    return undefined;
  }
}

const genProjection = (config) => (info) => {
  const context = info.fieldNodes[0];
  return _.assign({ _id: 0 }, gen({ config, info }, context, info.returnType));
};

const resolvers = _.mapValues(theConfig, genResolvers);
logger.trace('Proj resolvers', _.mapValues(resolvers, Object.keys));

module.exports = {
  genResolvers,
  genProjection,
  project: genProjection(theConfig),
  resolvers,
};
