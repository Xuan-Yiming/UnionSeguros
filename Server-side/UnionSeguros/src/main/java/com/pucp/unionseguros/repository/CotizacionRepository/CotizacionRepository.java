package com.pucp.unionseguros.repository.CotizacionRepository;

import com.pucp.unionseguros.model.Cotizacion.Cotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CotizacionRepository extends JpaRepository<Cotizacion, Integer> {

    @Modifying
    @Query("update Cotizacion c SET c.activo = false where c.id = ?1")
    void eliminarCotizacion(Integer id);

    @Query("SELECT a FROM Cotizacion a inner join Cliente c inner join Vehiculo v where a.activo = true AND CONCAT(c.nombre, c.apellidoPaterno, " +
            "c.apellidoMaterno, c.numeroDocumento, v.placa, a.fechaCotizacion) " +
            "LIKE CONCAT('%', ?1, '%') " +
            "and a.fidCliente.id=c.id and a.fidVehiculo.id= v.id " +
            " order by c.nombre ASC, c.apellidoPaterno ASC,c.apellidoMaterno ASC")
    public List<Cotizacion> listCotizacion(String busqueda);

    public List<Cotizacion> findCotizacionsByActivoIsTrue();
}
