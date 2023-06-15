package com.pucp.unionseguros.service.CotizacionService;

import com.pucp.unionseguros.model.Cotizacion.DetalleCotizacion;
import com.pucp.unionseguros.repository.CotizacionRepository.DetalleCotizacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DetalleCotizacionService {

    private final DetalleCotizacionRepository detalleCotizacionRepository;

    @Autowired
    public DetalleCotizacionService(DetalleCotizacionRepository detalleCotizacionRepository) {
        this.detalleCotizacionRepository = detalleCotizacionRepository;
    }

    public List<DetalleCotizacion> listarDetallesActivos(){
        List<DetalleCotizacion> lista = null;
        lista = detalleCotizacionRepository.findAllByActivoIsTrue();

        return  lista;

    }

    public List<DetalleCotizacion> listarTODOS(){
        List<DetalleCotizacion> lista = null;
        lista = detalleCotizacionRepository.findAll();
        return lista;
    }
    public int insertarDetalleCotizacion(DetalleCotizacion detalleCotizacion){
        DetalleCotizacion savedDetalleCotizacion = detalleCotizacionRepository.saveAndFlush(detalleCotizacion);
        return savedDetalleCotizacion.getId();
    }

    public DetalleCotizacion modificarDetalleCotizacion(DetalleCotizacion detalleCotizacion){
        return detalleCotizacionRepository.save(detalleCotizacion);
    }

    public DetalleCotizacion eliminarDetalleCotizacionPorID(Integer idIngresado){
        DetalleCotizacion foundDetalleCotizacion = detalleCotizacionRepository.findDetalleCotizacionById(idIngresado);
        foundDetalleCotizacion.setActivo(false);
        return detalleCotizacionRepository.save(foundDetalleCotizacion);

    }

    public List<DetalleCotizacion> buscarDetallesDeCotizacionPorParametros(String Busqueda){
        List<DetalleCotizacion> lista = null;

        lista = detalleCotizacionRepository.listarDetallesPorNombreOId(Busqueda);
        return  lista;
    }


}
