const express = require('express');
const bodyParser = require('body-parser');
const anony = require('./anonymity');

const router = express.Router();

const submitTicket = async (data) => {
  // TODO
  const tId = 'd82f714ec7a98ff372d72c7ba20146cc58cce58379f61249727a391ff3f4e953';

  return {
    status: 202,
    json: {
      tId,
      data,
    },
  };
};

// eslint-disable-next-line
const checkTicket = async (tId) => {
  // TODO

  return {
    status: 202,
    json: undefined,
  };
};

router.use(anony(), bodyParser.urlencoded({
  extended: false,
}));

router.post('/tickets', async (req, res, next) => {
  try {
    switch (req.accepts(['json', 'html'])) {
      case 'json':
        {
          const rst = await submitTicket(req.body);
          res.status(rst.status).json(rst.json);
        }
        return;
      case 'html':
        {
          const rst = await submitTicket(req.body.enc);
          if (rst.status === 202) {
            res.status(rst.status).send(`Ticket staged. Your tId is <pre>${rst.json.tId}</pre>`);
          } else {
            res.status(rst.status).send(`Error occured: <pre>${rst.json.error}</pre>`);
          }
        }
        return;
      default:
        res.status(406).send();
    }
  } catch (e) {
    next(e);
  }
});

router.get('/tickets/', async (req, res, next) => {
  try {
    switch (req.accepts(['json', 'html'])) {
      case 'json':
        {
          const rst = await checkTicket(req.query.tId);
          res.status(rst.status).json(rst.json);
        }
        return;
      case 'html':
        {
          const rst = await checkTicket(req.query.tId);
          if (rst.status === 202) {
            res.status(rst.status).send('Still processing.');
          } else if (rst.status === 200) {
            res.status(rst.status).send('Success.');
          } else {
            res.status(rst.status).send(`Error occured: <pre>${rst.json.error}</pre>`);
          }
        }
        return;
      default:
        res.status(406).send();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
