package com.pucp.unionseguros.repository.PersonasRepository;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.TipoDocumento;
import com.pucp.unionseguros.model.Personas.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /*
    @Query(nativeQuery = true,value = "SELECT id_persona,email,contrasena,fecha_creacion,activo FROM usuario \n" +
            "    WHERE CONCAT(CAST(id_persona AS CHAR), email,contrasena, CAST(fecha_creacion AS CHAR),CAST(activo AS CHAR)) \n" +
            "    LIKE CONCAT('%', ?1, '%')")*/
    @Query("SELECT p FROM Usuario p "+
            "WHERE CONCAT(CAST(p.fechaCreacion AS string )," +
            "CAST(CASE WHEN p.activoUsuario = true THEN 'activo' ELSE 'desactivado' END AS string)," +
            "p.nombre,p.apellidoMaterno,p.apellidoPaterno,p.id) \n" +
            "LIKE CONCAT('%', ?1, '%') " +
            "ORDER BY p.nombre ASC, p.apellidoPaterno ASC,p.apellidoMaterno ASC")
    public List<Usuario> findUsuario(String busqueda);

    @Query("SELECT p.id FROM Usuario p "+
            "    WHERE p.email=:email and p.contrasena=:contrasena")
    public Integer inicioSesion(String email,String contrasena);


    @Query("SELECT p.id FROM Usuario p WHERE p.email=:correoIngresado AND p.token=:TokenIngresado")
    public Integer verificarInformacionDeTokquen(String correoIngresado, String TokenIngresado);

    public Usuario findUsuarioByNumeroDocumento(String numeroDocumentoIngresado);

    public Usuario findUsuarioByEmail(String emailIngresado);

    @Query("SELECT usu FROM Usuario usu WHERE usu.numeroDocumento=:numDocumentIngresado AND " +
            "usu.fidTipoDocumento=:fidTipoDocIngresado AND  (usu.contrasena IS NULL OR usu.contrasena = '') ")
    public Usuario verificarExistenciaDeCliente(String numDocumentIngresado, TipoDocumento fidTipoDocIngresado);

    @Query("SELECT usu FROM Usuario  usu WHERE usu.email=:correoIngresado")
    public Usuario verificarCorreoIngresadoLibre(String correoIngresado);
}
