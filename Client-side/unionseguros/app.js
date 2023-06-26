var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();

// Start the server
// const PORT = process.env.PORT || 3000

// app.listen(PORT, function () {
//   console.log(`Server listening on port ${PORT}`)
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static('public'));


//CLient
//pagina de inicio
var indexRouter = require('./routes/client/index');
app.use('/', indexRouter);

//pagina de SOAT
var SOATProcesoRouter = require('./routes/client/SOATProceso');
app.use('/SOATProceso', SOATProcesoRouter);
var SOATRouter = require('./routes/client/SOAT');
app.use('/SOAT', SOATRouter)

//pagina de seguro vehicular
var seguroVehicularRouter = require('./routes/client/seguroVehicular');
app.use('/seguroVehicular', seguroVehicularRouter);
var seguroVehicularProcesoRouter = require('./routes/client/seguroVehicularProceso');
app.use('/seguroVehicularProceso', seguroVehicularProcesoRouter);

//pagina de usuario
var usuarioRouter = require('./routes/client/usuario');
app.use('/usuario', usuarioRouter);
var loginRouter = require('./routes/client/login');
app.use('/login', loginRouter);
var iniciarSesionRouter = require('./routes/client/iniciarSesion');
app.use('/iniciarSesion', iniciarSesionRouter);

//recuperar contrasena
var recuperarContrasenaRouter = require('./routes/client/recuperarContrasena');
app.use('/recuperarContrasena', recuperarContrasenaRouter);

//Admin
//pagina de administrador
var adminLoginRouter = require('./routes/admin/adminLogin');
app.use('/admin', adminLoginRouter);
app.use('/admin/login', adminLoginRouter);


//pagina de SOAT
var adminPlanSOATRouter = require('./routes/admin/adminPlanSOAT');
app.use('/admin/planSOAT', adminPlanSOATRouter);
var adminDetallePlanSOATRouter = require('./routes/admin/adminDetallePlanSOAT');
app.use('/admin/detallePlanSOAT', adminDetallePlanSOATRouter);

// //pagina de seguro vehicular
var adminSeguroVehicularRouter = require('./routes/admin/adminSeguroVehicular');
app.use('/admin/seguroVehicular', adminSeguroVehicularRouter);
// var adminBeneficioSeguroVehicularRouter = require('./routes/admin/adminBeneficioSeguroVehicular');
// app.use('/admin/beneficioSeguroVehicular', adminBeneficioSeguroVehicularRouter);

//pagina de usuario
var adminUsuariosRouter = require('./routes/admin/adminUsuario');
app.use('/admin/usuario', adminUsuariosRouter);
var adminDetalleUsuarioRouter = require('./routes/admin/adminDetalleUsuario');
app.use('/admin/detalleUsuario', adminDetalleUsuarioRouter);

var adminAuditoriaRouter = require('./routes/admin/adminAuditoria');
app.use('/admin/auditoria', adminAuditoriaRouter);

// //pagina de usuarioMiCuenta
var usuarioMiCuentaRouter = require('./routes/client/usuarioMiCuenta');
app.use('/usuarioMiCuenta', usuarioMiCuentaRouter);

var usuarioMiCuentaEditarRouter = require('./routes/client/usuarioMiCuentaEditar');
app.use('/usuarioMiCuentaEditar', usuarioMiCuentaEditarRouter);


// //pagina de cliente
var adminClientesRouter = require('./routes/admin/adminCliente');
app.use('/admin/cliente', adminClientesRouter);
var adminDetalleClienteRouter = require('./routes/admin/adminDetalleCliente');
app.use('/admin/detalleCliente', adminDetalleClienteRouter);

// //pagina de vehiculo
var adminVehiculosRouter = require('./routes/admin/adminVehiculos');
app.use('/admin/vehiculo', adminVehiculosRouter);
var adminDetalleVehiculoRouter = require('./routes/admin/adminDetalleVehiculo');
app.use('/admin/detalleVehiculo', adminDetalleVehiculoRouter);
var adminMarcaModeloRouter = require('./routes/admin/adminMarcaModelo');
app.use('/admin/marcaModelo', adminMarcaModeloRouter);
var adminModeloRouter = require('./routes/admin/adminModelo');
app.use('/admin/modelo', adminModeloRouter);
var adminModeloDetalleRouter = require('./routes/admin/adminModeloDetalle');
app.use('/admin/modeloDetalle', adminModeloDetalleRouter);

// //pagina de ventas
var adminVentasRouter = require('./routes/admin/adminVentas');
app.use('/admin/ventas', adminVentasRouter);

// //pagina de cotizaciones
var adminCotizacionesRouter = require('./routes/admin/adminCotizaciones');
app.use('/admin/cotizaciones', adminCotizacionesRouter);

// marcas y modelos
var adminMarcaRouter = require('./routes/admin/adminMarcaModeloGeneral');
app.use("/admin/marcaModeloGeneral", adminMarcaRouter);

// lista negra
var adminListaNegraRouter = require('./routes/admin/adminListaNegra');
app.use('/admin/listaNegra', adminListaNegraRouter);


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
