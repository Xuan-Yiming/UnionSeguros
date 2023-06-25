package com.pucp.unionseguros.service.PersonasService;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.TipoDocumento;
import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.repository.PersonasRepository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UsuarioService {
    final private UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarUsuarios(){
        return usuarioRepository.findAll();
    }

    public List<Usuario> buscarUsuario(String busqueda){
        List<Usuario> lista = new ArrayList<>();
        lista = usuarioRepository.findUsuario(busqueda);
        return  lista;
    }
    public Usuario login(String email,String contrasena){
//        Integer id;
//        id = usuarioRepository.inicioSesion(email,contrasena);
//        if (id == null) id=0;
//        return  id;

        Usuario foundUsuario = null;
        foundUsuario = usuarioRepository.findUsuarioByEmailAndContrasena(email,contrasena);
        return foundUsuario;
    }

    public Usuario verificarExistenciaDeCliente(String numIngresado, Integer idTipoDocumento){
        Usuario usuario = null;
        TipoDocumento tipoDocumento = new TipoDocumento();
        tipoDocumento.setId(idTipoDocumento);
        usuario = usuarioRepository.verificarExistenciaDeCliente(numIngresado,tipoDocumento);

        if(usuario==null){
            //NO SE ENCONTRO AL CLIENTE NO ESTÁ REGISTRADO EN LA BD
            return null;
        }else{
            //SE ENCONTRO AL USUARIO
            return usuario;
        }

    }

    public boolean CorreoIngresadoDisponible(String correoIngresado){
        boolean success = false;
        Usuario usuario = null;
        usuario = usuarioRepository.verificarCorreoIngresadoLibre(correoIngresado);
        if(usuario==null){
            //NO SE ENCONTRO NINGUN USUARIO CON ESE CORREO Y POR ESO SE DEBERIA CONTINUAR
            success = true;
        }
        return  success;


    }

    public boolean actualizarContrasenia(String correoIngresado,String contrasenia){
        boolean success = false;
        Usuario usuario = null;
        usuario = usuarioRepository.verificarCorreoIngresadoLibre(correoIngresado);

        usuario.setContrasena(contrasenia);

        if(usuario==null){
            return success;
        }
        else {
            success=true;
        }
        usuario=usuarioRepository.save(usuario);

        return  success;
    }

//    public boolean verificarTokenIngresado(String correoIngresado, String tokenIngresado){
//        boolean success= false;
//        Usuario usuario = null;
//        usuario = usuarioRepository.verificarTokenIngresado(correoIngresado,tokenIngresado);
//        if(usuario!=null){
//            success = true;
//        }
//        return success;
//    }

}
