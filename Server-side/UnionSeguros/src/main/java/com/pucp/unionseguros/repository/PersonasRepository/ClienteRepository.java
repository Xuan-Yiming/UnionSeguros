package com.pucp.unionseguros.repository.PersonasRepository;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.model.Personas.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente,Integer> {
    public Cliente findClienteByNumeroDocumentoAndActivoIsTrue(String numeroDocumentoIngresado);

    public Cliente findClienteByIdAndActivoIsTrue(Integer id);

    public Cliente findClienteByEmailAndActivoIsTrue(String emailIngresado);

    @Query("SELECT p.fidRoles FROM Cliente p "+
            "    WHERE p.id=:id")
    public Roles getRol(int id);


    @Query("SELECT a FROM Cliente a WHERE a.activo = true AND CONCAT(a.nombre, a.apellidoPaterno, " +
            "a.apellidoMaterno, a.numeroDocumento, a.id, a.email, a.baneado) " +
            "LIKE CONCAT('%', ?1, '%') " +
            "ORDER BY a.nombre ASC, a.apellidoPaterno ASC,a.apellidoMaterno ASC")
    public List<Cliente> listCliente(String busqueda);


    //public Cliente findClienteByNumeroDocumentoAndFidTipoDocumentoAndContrasenaIsEmptyOrContrasenaIsNull(String numDocumentoIngresado, TipoDocumento TipoDocumento);
}
