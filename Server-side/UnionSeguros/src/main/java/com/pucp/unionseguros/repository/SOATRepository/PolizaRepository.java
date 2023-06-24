package com.pucp.unionseguros.repository.SOATRepository;

import com.pucp.unionseguros.model.SOAT.Poliza;
import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolizaRepository extends JpaRepository<Poliza,Integer> {
    Poliza findPolizaByFidVehiculoAndActivoIsTrue(Vehiculo vehiculoIngresado);
}
