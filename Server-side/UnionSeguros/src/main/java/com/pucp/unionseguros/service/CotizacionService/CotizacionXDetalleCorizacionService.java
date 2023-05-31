package com.pucp.unionseguros.service.CotizacionService;

import com.pucp.unionseguros.repository.CotizacionRepository.CotizacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CotizacionXDetalleCorizacionService {
    private final CotizacionRepository cotizacionRepository;

    @Autowired
    public CotizacionXDetalleCorizacionService(CotizacionRepository cotizacionRepository) {
        this.cotizacionRepository = cotizacionRepository;
    }
}
