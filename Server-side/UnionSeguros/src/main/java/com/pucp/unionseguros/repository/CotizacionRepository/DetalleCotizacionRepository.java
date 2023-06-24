package com.pucp.unionseguros.repository.CotizacionRepository;

import com.pucp.unionseguros.model.Cotizacion.DetalleCotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleCotizacionRepository extends JpaRepository<DetalleCotizacion,Integer> {
    public List<DetalleCotizacion> findAllByActivoIsTrue();

    public DetalleCotizacion findDetalleCotizacionById(Integer idIngresado);


    @Query("SELECT d FROM DetalleCotizacion d WHERE d.activo = true AND CONCAT(d.beneficio,d.id,d.monto) LIKE  CONCAT('%',?1,'%') ")
    public List<DetalleCotizacion> listarDetallesPorNombreOId(String busqueda);

}
