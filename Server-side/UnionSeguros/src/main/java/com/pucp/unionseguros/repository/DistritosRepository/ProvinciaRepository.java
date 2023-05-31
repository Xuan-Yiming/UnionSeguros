package com.pucp.unionseguros.repository.DistritosRepository;

import com.pucp.unionseguros.model.Distritos.Departamento;
import com.pucp.unionseguros.model.Distritos.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinciaRepository extends JpaRepository<Provincia,Integer> {

    public Provincia findProvinciaById(Integer IdProvincia);

    public List<Provincia> findProvinciasByFidDepartamento(Departamento departamento);
}
