package com.pucp.unionseguros.repository.CotizacionRepository;

import com.pucp.unionseguros.model.Cotizacion.DetalleCotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleCotizacionRepository extends JpaRepository<DetalleCotizacion,Integer> {
}
