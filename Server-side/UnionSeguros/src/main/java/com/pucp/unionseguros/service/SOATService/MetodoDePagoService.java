package com.pucp.unionseguros.service.SOATService;

import com.pucp.unionseguros.model.SOAT.MetodoDePago;
import com.pucp.unionseguros.repository.SOATRepository.MetodoDePagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MetodoDePagoService {
    private final MetodoDePagoRepository metodoDePagoRepository;

    @Autowired
    public MetodoDePagoService(MetodoDePagoRepository metodoDePagoRepository) {
        this.metodoDePagoRepository = metodoDePagoRepository;
    }

    public List<MetodoDePago> listarMetododePagos(){
        return metodoDePagoRepository.findAll();
    }

    public int insertarMetodoDePago(MetodoDePago metodoDePago){
        MetodoDePago savedMetodoDePago = metodoDePagoRepository.saveAndFlush(metodoDePago);
        return  savedMetodoDePago.getId();
    }
}
