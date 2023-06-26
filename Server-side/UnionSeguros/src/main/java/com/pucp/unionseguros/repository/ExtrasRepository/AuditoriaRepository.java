package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria,Integer> {

    @Query("SELECT a FROM Auditoria a " +
            "INNER JOIN Persona p " +
            "WHERE CONCAT(p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.numeroDocumento) " +
            "LIKE CONCAT('%', ?1, '%') " +
            "AND p.activoPersona = true " +
            "AND a.fidUsuario.id = p.id " +
            "ORDER BY a.tiempo ASC")
    public List<Auditoria> findAuditoriaParametro(String busqueda);

    public List<Auditoria> findAuditoriasById(Integer idIngresado);
}
