package com.pucp.unionseguros.repository.VehiculoRepository;

import com.pucp.unionseguros.model.Vehiculo.MarcaVehiculo;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarcaVehiculoRepository extends JpaRepository<MarcaVehiculo,Integer> {
    public MarcaVehiculo findMarcaVehiculoById(Integer idMarca);

    public List<MarcaVehiculo> findMarcaVehiculosByActivoIsTrue();



    @Query("SELECT d FROM MarcaVehiculo d WHERE d.activo = true AND CONCAT(d.marca,d.id) LIKE  CONCAT('%',?1,'%') ")
    public List<MarcaVehiculo> buscarMarcasVehiculosPorParametro(String busqueda);
}
