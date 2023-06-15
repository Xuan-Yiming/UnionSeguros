package com.pucp.unionseguros.repository.SOATRepository;

import com.pucp.unionseguros.model.SOAT.SOAT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SOATRepository extends JpaRepository<SOAT,Integer> {

    public List<SOAT> findSOATSByActivoIsTrue();

    @Query("SELECT s FROM SOAT s INNER JOIN Poliza po INNER JOIN Vehiculo v INNER JOIN Cliente c INNER JOIN PlanSOAT p " +
            "WHERE CONCAT(s.id, c.nombre, c.apellidoPaterno, c.apellidoMaterno, v.placa, p.nombrePlan) " +
            "LIKE CONCAT('%', ?1, '%') AND s.activo = true " +
            "AND po.id = s.fidPoliza.id AND po.fidCliente.id = c.id AND po.fidVehiculo.id = v.id AND s.fidPlanSoat.id = p.id " +
            "ORDER BY s.fechaDeEmision ASC ")
    public List<SOAT> findSOATParametros(String busqueda);
}
