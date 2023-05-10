var express = require('express');
var router = express.Router();

/* GET detalleCliente page. */
router.get('/', function(req, res, next) {
  res.render('admin/pages/detalleCliente');
});

module.exports = router;