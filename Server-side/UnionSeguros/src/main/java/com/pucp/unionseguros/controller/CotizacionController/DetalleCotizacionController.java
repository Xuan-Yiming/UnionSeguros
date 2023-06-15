package com.pucp.unionseguros.controller.CotizacionController;

import com.pucp.unionseguros.model.Cotizacion.DetalleCotizacion;
import com.pucp.unionseguros.service.CotizacionService.DetalleCotizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/detalleCotizacion")
public class DetalleCotizacionController {
    private final DetalleCotizacionService detalleCotizacionService;

    @Autowired
    public DetalleCotizacionController(DetalleCotizacionService detalleCotizacionService) {
        this.detalleCotizacionService = detalleCotizacionService;
    }

    @GetMapping("/listarTodos")
    public List<DetalleCotizacion> listarTodosDetalles(){
        return  detalleCotizacionService.listarTODOS();
    }

    @GetMapping("/listarTodosActivos")
    public List<DetalleCotizacion> listarTodosDetallesACTIVOS(){
        return detalleCotizacionService.listarDetallesActivos();
    }

    @PostMapping("/insertar")
    public int insertarDetalleCotizacion(@RequestBody DetalleCotizacion detalleCotizacion){
        return detalleCotizacionService.insertarDetalleCotizacion(detalleCotizacion);
    }

    @PutMapping("/modificar")
    public  DetalleCotizacion modificarDetalleCotizacion(@RequestBody DetalleCotizacion detalleCotizacion){
        return  detalleCotizacionService.modificarDetalleCotizacion(detalleCotizacion);
    }

    @PutMapping(params = "idIngresado",path = "/eliminar")
    public DetalleCotizacion eliminarDetalleCotizacionPorID(@RequestParam(name = "idIngresado") Integer IdIngresado){
        return  detalleCotizacionService.eliminarDetalleCotizacionPorID(IdIngresado);
    }

    @GetMapping(params = "busqueda",path = "/buscarPorParametros")
    public List<DetalleCotizacion> BuscarDetallesDeCotizacion(@RequestParam(name = "busqueda") String busqueda){
        return detalleCotizacionService.buscarDetallesDeCotizacionPorParametros(busqueda);
    }


}
