package com.pucp.unionseguros.controller.CotizacionController;

import com.pucp.unionseguros.model.Cotizacion.CotizacionXDetalleCotizacion;
import com.pucp.unionseguros.service.CotizacionService.CotizacionXDetalleCorizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/cotizacionXDetalleCotizacion")
public class CotizacionXDetalleCotizacionController {

    private final CotizacionXDetalleCorizacionService cotizacionXDetalleCorizacionService;

    @Autowired
    public CotizacionXDetalleCotizacionController(CotizacionXDetalleCorizacionService cotizacionXDetalleCorizacionService) {
        this.cotizacionXDetalleCorizacionService = cotizacionXDetalleCorizacionService;
    }

    @GetMapping("/listarTodas")
    public List<CotizacionXDetalleCotizacion> listarTodas(){
        return  cotizacionXDetalleCorizacionService.listarCotizaXDetalle();
    }

    @GetMapping(params = "idCotizacion",path="/listarDetallesPorIDCotizacion")
    public List<CotizacionXDetalleCotizacion> listarDetallesPorIdCotizacion(@RequestParam Integer idCotizacion){
        return cotizacionXDetalleCorizacionService.listarDetallesPorIdCotizacion(idCotizacion);
    }

    @PostMapping("/cotizacionXDetalleCotizacion")
    public List<CotizacionXDetalleCotizacion> insertarCotizacionXDetalle(@RequestBody List<CotizacionXDetalleCotizacion> listaInsertada){
        return cotizacionXDetalleCorizacionService.insertarCotizacionXDetalle(listaInsertada);
    }
}
