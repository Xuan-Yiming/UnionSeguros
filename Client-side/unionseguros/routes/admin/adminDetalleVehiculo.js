var express = require('express');
var router = express.Router();

/* GET detalleUsuario page. */
router.get('/', function(req, res, next) {
  res.render('admin/pages/detailVehiculo');
});

module.exports = router;