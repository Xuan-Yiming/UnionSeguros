var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var data = {
    tipoDocumento: req.body.tipoDocumento,
    numeroDocumento: req.body.numeroDocumento,
    placa: req.body.placa,
  };

  if (data.tipoDocumento == null || data.numeroDocumento == null || data.placa == null) {
    res.redirect('/error');
  }else{
    res.render('client/pages/SOATProceso',{
      data: data
    });
  }
});

module.exports = router;
