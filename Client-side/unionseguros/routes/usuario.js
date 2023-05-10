var express = require('express');
var router = express.Router();

/* GET usuario page. */
router.get('/', function(req, res, next) {
  res.render('client/pages/usuario');
});

module.exports = router;
