package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.CalculoPrima;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalculoPrimaRepository extends JpaRepository<CalculoPrima,Integer> {

    CalculoPrima findCalculoPrimaByMarcaAndModeloAndAndAnioFabricacion(String marcaIngresada, String modeloIngresado,Integer anhoIngresado);
}
