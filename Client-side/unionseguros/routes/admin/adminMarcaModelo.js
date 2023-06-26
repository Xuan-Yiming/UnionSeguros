var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('admin/pages/marcaModelo');
});

router.get('/general', function (req, res, next) {
    res.render('admin/pages/marcaModeloGenral');
});

module.exports = router;