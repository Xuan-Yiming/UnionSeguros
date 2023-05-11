package com.pucp.unionseguros.repository.VehiculoRepository;

import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo,Integer> {

    public Vehiculo findVehiculoByPlaca(String placaIngresada);
    Page<Vehiculo> findAll(Pageable pageable);
}
