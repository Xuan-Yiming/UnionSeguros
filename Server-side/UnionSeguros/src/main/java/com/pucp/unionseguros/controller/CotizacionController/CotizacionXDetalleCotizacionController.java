package com.pucp.unionseguros.controller.CotizacionController;

import com.pucp.unionseguros.service.CotizacionService.CotizacionXDetalleCorizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Service
@RestController
@RequestMapping(path = "api/v1/cotizacionXDetalleCotizacion")
public class CotizacionXDetalleCotizacionController {

    private final CotizacionXDetalleCorizacionService cotizacionXDetalleCorizacionService;

    @Autowired
    public CotizacionXDetalleCotizacionController(CotizacionXDetalleCorizacionService cotizacionXDetalleCorizacionService) {
        this.cotizacionXDetalleCorizacionService = cotizacionXDetalleCorizacionService;
    }
}
