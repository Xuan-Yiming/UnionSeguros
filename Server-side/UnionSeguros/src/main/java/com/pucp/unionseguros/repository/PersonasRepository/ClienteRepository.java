package com.pucp.unionseguros.repository.PersonasRepository;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente,Integer> {
    public Cliente findClienteByNumeroDocumentoAndActivoIsTrue(String numeroDocumentoIngresado);

    public Cliente findClienteByIdAndActivoIsTrue(Integer id);

    @Query("SELECT p.fidRoles FROM Cliente p "+
            "    WHERE p.id=:id")
    public Roles getRol(int id);

}
