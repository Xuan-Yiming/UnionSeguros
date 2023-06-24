package com.pucp.unionseguros.service.CotizacionService;

import com.pucp.unionseguros.model.Cotizacion.CotizacionXDetalleCotizacion;
import com.pucp.unionseguros.repository.CotizacionRepository.CotizacionXDetalleCotizacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CotizacionXDetalleCorizacionService {
    private final CotizacionXDetalleCotizacionRepository cotizacionXDetalleCotizacionRepository;

    @Autowired
    public CotizacionXDetalleCorizacionService(CotizacionXDetalleCotizacionRepository cotizacionXDetalleCotizacionRepository) {
        this.cotizacionXDetalleCotizacionRepository = cotizacionXDetalleCotizacionRepository;
    }


    public List<CotizacionXDetalleCotizacion> insertarCotizacionXDetalle(List<CotizacionXDetalleCotizacion> listainsertada){
        List<CotizacionXDetalleCotizacion> lista = null;
        lista = cotizacionXDetalleCotizacionRepository.saveAllAndFlush(listainsertada);
        return  lista;
    }

    public List<CotizacionXDetalleCotizacion> listarCotizaXDetalle(){
        List<CotizacionXDetalleCotizacion> lista = null;
        lista = cotizacionXDetalleCotizacionRepository.findAll();
        return lista;
    }

    public List<CotizacionXDetalleCotizacion> listarDetallesPorIdCotizacion(Integer idcotizacion){
        List<CotizacionXDetalleCotizacion> lista = null;
        lista = cotizacionXDetalleCotizacionRepository.findCotizacionXDetalleCotizacionsByFidCotizacion_Id(idcotizacion);
        return lista;
    }
}
