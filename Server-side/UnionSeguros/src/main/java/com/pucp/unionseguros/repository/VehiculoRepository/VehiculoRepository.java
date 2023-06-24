package com.pucp.unionseguros.repository.VehiculoRepository;

import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo,Integer> {

    public Vehiculo findVehiculoByPlaca(String placaIngresada);
    Page<Vehiculo> findAll(Pageable pageable);

    @Query("SELECT v FROM Vehiculo v INNER JOIN Modelo mo INNER JOIN MarcaVehiculo ma INNER JOIN Persona p " +
            "WHERE CONCAT(v.placa, mo.modelo, ma.marca, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.numeroDocumento) " +
            "LIKE CONCAT('%', ?1, '%') " +
            "AND v.activo = true AND v.fidModelo.id = mo.id AND mo.fidMarcaVehiculo.id = ma.id AND v.fidPersona.id = p.id " +
            "ORDER BY v.placa ASC")
    public List<Vehiculo> findVehiculoParametro(String busqueda);
    @Modifying
    @Query("UPDATE Vehiculo v SET v.activo = false WHERE v.id = ?1")
    void eliminarVehiculo(Integer id);

    Vehiculo findVehiculoById(Integer idIngresado);
}
