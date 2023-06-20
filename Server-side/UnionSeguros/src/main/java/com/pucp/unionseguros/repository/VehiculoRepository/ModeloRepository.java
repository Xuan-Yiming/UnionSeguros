package com.pucp.unionseguros.repository.VehiculoRepository;

import com.pucp.unionseguros.model.Vehiculo.MarcaVehiculo;
import com.pucp.unionseguros.model.Vehiculo.Modelo;
import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.beans.IntrospectionException;
import java.util.List;
import java.util.Optional;

@Repository
public interface ModeloRepository extends JpaRepository<Modelo,Integer> {

    List<Modelo> findModelosByFidMarcaVehiculo(MarcaVehiculo marcaVehiculo);
    List<Modelo> findModelosByActivoIsTrue();
    @Query("select m from Modelo m inner join MarcaVehiculo mar where m.fidMarcaVehiculo.id = mar.id and m.activo=true and concat(mar.marca, m.modelo, m.id) like concat('%',?1,'%') ")
    List<Modelo> buscarModelosPorNombreIdMarca(String busqueda);

    Modelo findModeloByIdAndActivoIsTrue(Integer idIngresado);
    @Procedure(procedureName = "cargaModelos")
    void cargaModelos();
//    @Modifying
//    @Query("DELETE FROM Modelo m WHERE m.id NOT IN (SELECT MIN(m2.id) FROM Modelo m2 GROUP BY m2.modelo)")
//    void eliminarModelosDuplicadas();
}
