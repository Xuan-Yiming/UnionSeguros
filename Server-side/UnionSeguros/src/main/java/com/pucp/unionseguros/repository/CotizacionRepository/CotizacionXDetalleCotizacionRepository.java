package com.pucp.unionseguros.repository.CotizacionRepository;

import com.pucp.unionseguros.model.Cotizacion.CotizacionXDetalleCotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CotizacionXDetalleCotizacionRepository extends JpaRepository<CotizacionXDetalleCotizacion,Integer> {
}
