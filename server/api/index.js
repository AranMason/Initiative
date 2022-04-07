var express = require('express'),
  router = express.Router();

// api end points
const initiative = require('./initiative');

// router.get("/test", ())

router.use('/initiative', initiative);

module.exports = router;
