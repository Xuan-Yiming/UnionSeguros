var express = require('express');
var router = express.Router();

/* GET beneficioSeguroVehicular page. */
router.get('/', function(req, res, next) {
  res.render('admin/pages/beneficioSeguroVehicular');
});

module.exports = router;