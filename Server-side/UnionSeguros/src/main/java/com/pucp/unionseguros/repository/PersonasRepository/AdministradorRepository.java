package com.pucp.unionseguros.repository.PersonasRepository;

import com.pucp.unionseguros.model.Personas.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    public List<Administrador> findAdministradorsByActivoIsTrue();

    public Administrador findAdministradorByIdAndActivoIsTrue(Integer id);
}
