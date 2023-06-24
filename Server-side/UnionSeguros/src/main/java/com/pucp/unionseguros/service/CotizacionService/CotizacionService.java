package com.pucp.unionseguros.service.CotizacionService;


import com.pucp.unionseguros.model.Cotizacion.Cotizacion;
import com.pucp.unionseguros.repository.CotizacionRepository.CotizacionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CotizacionService {
    private final CotizacionRepository cotizacionRepository;

    @Autowired
    public CotizacionService(CotizacionRepository cotizacionRepository) {
        this.cotizacionRepository = cotizacionRepository;
    }
    public List<Cotizacion> listarCotizacionActivas(){
        return cotizacionRepository.findCotizacionsByActivoIsTrue();
    }

    public int insertarCotizacion(Cotizacion cotizacion){
        Cotizacion savedCotizacion = cotizacionRepository.saveAndFlush(cotizacion);
        savedCotizacion.setActivo(true);
        return savedCotizacion.getId();
    }
    public Cotizacion updateCotizacion(Cotizacion cotizacion){
        return cotizacionRepository.save(cotizacion);
    }
    @Transactional
    public void eliminarCotizacion(Integer id){
        cotizacionRepository.eliminarCotizacion(id);
    }
    public List<Cotizacion> listarCotizacionesActivos(String busqueda){
        List<Cotizacion> lista = new ArrayList<>();
        lista = cotizacionRepository.listCotizacion(busqueda);
        return  lista;
    }

    public Cotizacion deleteCotizacion(Cotizacion cotizacion){
        cotizacion.setActivo(false);
        return cotizacionRepository.save(cotizacion);
    }
}
