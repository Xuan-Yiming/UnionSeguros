var express = require('express');
var router = express.Router();

/* GET seguroVehicular page. */
router.get('/', function(req, res, next) {
  res.render('admin/pages/ventas');
});

module.exports = router;