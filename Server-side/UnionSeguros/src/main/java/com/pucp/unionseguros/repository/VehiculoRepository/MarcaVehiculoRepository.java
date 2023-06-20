package com.pucp.unionseguros.repository.VehiculoRepository;

import com.pucp.unionseguros.model.Vehiculo.MarcaVehiculo;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarcaVehiculoRepository extends JpaRepository<MarcaVehiculo,Integer> {
    public MarcaVehiculo findMarcaVehiculoById(Integer idMarca);

    public List<MarcaVehiculo> findMarcaVehiculosByActivoIsTrue();

    public MarcaVehiculo findMarcaVehiculoByMarca(String nombreMarca);

    public MarcaVehiculo findMarcaVehiculoByIdAndActivoIsTrue(Integer idIngresado);
    @Query("SELECT d FROM MarcaVehiculo d WHERE d.activo = true AND CONCAT(d.marca,d.id) LIKE  CONCAT('%',?1,'%') ")
    public List<MarcaVehiculo> buscarMarcasVehiculosPorParametro(String busqueda);

    @Procedure(procedureName = "cargaMarca")
    void cargaMarca();


    @Modifying
    @Query("DELETE FROM MarcaVehiculo m WHERE m.id NOT IN (SELECT MIN(m2.id) FROM MarcaVehiculo m2 GROUP BY m2.marca)")
    void eliminarMarcasDuplicadas();
}
