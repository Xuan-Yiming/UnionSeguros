var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();

// Start the server
const PORT = 8080;
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static('public'));
var usersRouter = require('./routes/users');
app.use('/users', usersRouter);
//pagina de inicio
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

//pagina de SOAT
var SOATProcesoRouter = require('./routes/SOATProceso');
app.use('/SOATProceso', SOATProcesoRouter);
var SOATRouter = require('./routes/SOAT');
app.use('/SOAT', SOATRouter)

//pagina de seguro vehicular
var seguroVehicularRouter = require('./routes/seguroVehicular');
app.use('/seguroVehicular', seguroVehicularRouter);
var seguroVehicularProcesoRouter = require('./routes/seguroVehicularProceso');
app.use('/seguroVehicularProceso', seguroVehicularProcesoRouter);

//pagina de usuario
var usuarioRouter = require('./routes/usuario');
app.use('/usuario', usuarioRouter);
var loginRouter = require('./routes/login');
app.use('/login', loginRouter);

//pagina de administrador
var adminLoginRouter = require('./routes/admin/adminLogin');
app.use('/admin/login', adminLoginRouter);

var adminPlanSOATRouter = require('./routes/admin/adminPlanSOAT');
app.use('/admin/planSOAT', adminPlanSOATRouter);

var adminDetallePlanSOATRouter = require('./routes/admin/adminDetallePlanSOAT');
app.use('/admin/detallePlanSOAT', adminDetallePlanSOATRouter);

var adminSeguroVehicularRouter = require('./routes/admin/adminSeguroVehicular');
app.use('/admin/seguroVehicular', adminSeguroVehicularRouter);

var adminBeneficioSeguroVehicularRouter = require('./routes/admin/adminBeneficioSeguroVehicular');
app.use('/admin/beneficioSeguroVehicular', adminBeneficioSeguroVehicularRouter);

var adminUsuariosRouter = require('./routes/admin/adminUsuarios');
app.use('/admin/usuarios', adminUsuariosRouter);

var adminDetalleUsuarioRouter = require('./routes/admin/adminDetalleUsuario');
app.use('/admin/detalleUsuario', adminDetalleUsuarioRouter);

var adminAuditoriaRouter = require('./routes/admin/adminAuditoria');
app.use('/admin/auditoria', adminAuditoriaRouter);

var adminClientesRouter = require('./routes/admin/adminClientes');
app.use('/admin/clientes', adminClientesRouter);

var adminDetalleClienteRouter = require('./routes/admin/adminDetalleCliente');
app.use('/admin/detalleCliente', adminDetalleClienteRouter);

var adminVehiculosRouter = require('./routes/admin/adminVehiculos');
app.use('/admin/vehiculos', adminVehiculosRouter);

var adminDetalleVehiculoRouter = require('./routes/admin/adminDetalleVehiculo');
app.use('/admin/detalleVehiculo', adminDetalleVehiculoRouter);

var adminVentasRouter = require('./routes/admin/adminVentas');
app.use('/admin/ventas', adminVentasRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
