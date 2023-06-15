/*
Nombre del archivo:    CotizacionController
Autor:                Sergio Dadic
Descripcion:        Archivo controller de la clase Cotizacion
*/
package com.pucp.unionseguros.controller.CotizacionController;

import com.pucp.unionseguros.model.Cotizacion.Cotizacion;
import com.pucp.unionseguros.service.CotizacionService.CotizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/cotizacion")
public class CotizacionController {

    private final CotizacionService cotizacionService;

    @Autowired
    public CotizacionController(CotizacionService cotizacionService) {
        this.cotizacionService = cotizacionService;
    }

    @GetMapping("/listarCotizacionesActivas")
    public List<Cotizacion> getCotizaciones(){
        return  cotizacionService.listarCotizacionActivas();
    }

    @PostMapping("/insertar")
    public int insertarCotizacion(@RequestBody Cotizacion cotizacion){
        return cotizacionService.insertarCotizacion(cotizacion);
    }
    @PutMapping("/modificar")
    public Cotizacion modificarCotizacion(@RequestBody Cotizacion cotizacion){
        return cotizacionService.updateCotizacion(cotizacion);
    }

    @PutMapping(params = "eliminar",path = "/eliminar")
    public void eliminarCotizacion(@RequestParam(name = "eliminar") Integer id){
        cotizacionService.eliminarCotizacion(id);
    }
    @GetMapping(params = "busqueda",path ="/listarCotiazacionesActivos")
    public List<Cotizacion> listarCotizacionesActivos(@RequestParam(name = "busqueda") String busqueda){
        return cotizacionService.listarCotizacionesActivos(busqueda);
    }
}
