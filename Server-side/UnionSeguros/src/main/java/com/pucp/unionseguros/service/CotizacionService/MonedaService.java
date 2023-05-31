package com.pucp.unionseguros.service.CotizacionService;

import com.pucp.unionseguros.model.Cotizacion.Moneda;
import com.pucp.unionseguros.repository.CotizacionRepository.MonedaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MonedaService {
    private final MonedaRepository monedaRepository;

    @Autowired
    public MonedaService(MonedaRepository monedaRepository) {
        this.monedaRepository = monedaRepository;
    }

    public List<Moneda> listarMonedas(){
        List<Moneda> lista = null;
        lista = monedaRepository.findAll();
        return lista;
    }
}
