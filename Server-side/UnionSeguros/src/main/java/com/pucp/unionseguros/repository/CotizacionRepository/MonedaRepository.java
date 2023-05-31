package com.pucp.unionseguros.repository.CotizacionRepository;

import com.pucp.unionseguros.model.Cotizacion.Moneda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonedaRepository extends JpaRepository<Moneda, Integer> {
}
