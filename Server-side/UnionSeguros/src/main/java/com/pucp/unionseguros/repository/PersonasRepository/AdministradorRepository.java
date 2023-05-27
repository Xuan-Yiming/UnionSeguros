package com.pucp.unionseguros.repository.PersonasRepository;

import com.pucp.unionseguros.model.Personas.Administrador;
import com.pucp.unionseguros.model.Personas.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    public List<Administrador> findAdministradorsByActivoIsTrue();

    public Administrador findAdministradorByIdAndActivoIsTrue(Integer id);

    public Administrador findAdministradorByNumeroDocumentoAndActivoIsTrue(String numeroDocumentoIngresado);

    @Query("SELECT p.fidRoles FROM Administrador p "+
            "    WHERE p.id=:id")
    public Roles getRol(int id);

    @Query("SELECT a FROM Administrador a WHERE a.activo = true AND CONCAT(a.nombre, a.apellidoPaterno, " +
            "a.apellidoMaterno, a.numeroDocumento, a.id, a.email) " +
            "LIKE CONCAT('%', ?1, '%') " +
            "ORDER BY a.nombre ASC, a.apellidoPaterno ASC,a.apellidoMaterno ASC")
    public List<Administrador> listAdministrador(String busqueda);


}
