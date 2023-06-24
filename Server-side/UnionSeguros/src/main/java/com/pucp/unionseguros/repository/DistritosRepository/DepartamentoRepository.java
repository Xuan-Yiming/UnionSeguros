package com.pucp.unionseguros.repository.DistritosRepository;

import com.pucp.unionseguros.model.Distritos.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Integer> {

    public Departamento findDepartamentoById(Integer idDepartamento);
}
