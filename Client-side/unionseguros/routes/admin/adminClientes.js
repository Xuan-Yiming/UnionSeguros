var express = require('express');
var router = express.Router();

/* GET clientes page. */
router.get('/', function(req, res, next) {
  res.render('admin/pages/clientes');
});

module.exports = router;