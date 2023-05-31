package com.pucp.unionseguros.controller.CotizacionController;

import com.pucp.unionseguros.service.CotizacionService.DetalleCotizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Service
@RestController
@RequestMapping(path = "api/v1/detalleCotizacion")
public class DetalleCotizacionController {
    private final DetalleCotizacionService detalleCotizacionService;

    @Autowired
    public DetalleCotizacionController(DetalleCotizacionService detalleCotizacionService) {
        this.detalleCotizacionService = detalleCotizacionService;
    }
}
