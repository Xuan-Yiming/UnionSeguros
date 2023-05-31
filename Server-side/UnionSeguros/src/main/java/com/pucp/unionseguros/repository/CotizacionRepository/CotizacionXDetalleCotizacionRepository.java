package com.pucp.unionseguros.repository.CotizacionRepository;

import com.pucp.unionseguros.model.Cotizacion.CotizacionXDetalleCotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CotizacionXDetalleCotizacionRepository extends JpaRepository<CotizacionXDetalleCotizacion,Integer> {
    public List<CotizacionXDetalleCotizacion> findCotizacionXDetalleCotizacionsByFidCotizacion_Id(Integer idIngresado);

}
