package com.pucp.unionseguros.service.CotizacionService;

import com.pucp.unionseguros.repository.CotizacionRepository.DetalleCotizacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DetalleCotizacionService {

    private final DetalleCotizacionRepository detalleCotizacionRepository;

    @Autowired
    public DetalleCotizacionService(DetalleCotizacionRepository detalleCotizacionRepository) {
        this.detalleCotizacionRepository = detalleCotizacionRepository;
    }
}
