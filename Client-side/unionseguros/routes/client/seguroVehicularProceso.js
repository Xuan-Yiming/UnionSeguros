var express = require('express');
var router = express.Router();

/* GET seguroVehicularProceso page. */
router.get('/', function(req, res, next) {
  res.render('client/pages/seguroVehicularProceso');
});

module.exports = router;
