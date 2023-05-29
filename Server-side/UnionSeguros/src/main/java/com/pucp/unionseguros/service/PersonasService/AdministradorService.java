package com.pucp.unionseguros.service.PersonasService;

import com.pucp.unionseguros.model.Personas.Administrador;
import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.repository.PersonasRepository.AdministradorRepository;
import com.pucp.unionseguros.repository.PersonasRepository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AdministradorService {
    final private AdministradorRepository administradorRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public AdministradorService(AdministradorRepository administradorRepository,
                                UsuarioRepository usuarioRepository) {
        this.administradorRepository = administradorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public int ingresarAdministrador(Administrador administrador){
        List<Usuario> foundUsuario = null, foundEmaailAdministrador=null;

        foundUsuario = usuarioRepository.findUsuario(administrador.getNumeroDocumento());

        foundEmaailAdministrador =  usuarioRepository.findUsuario(administrador.getEmail().toString());

        if (foundUsuario != null) {
            return 0 ;
        }else if(foundEmaailAdministrador!=null){
            return -1;
        }
        Administrador savedAdministrador = administradorRepository.saveAndFlush(administrador);
        return  savedAdministrador.getId();

    }

    public List<Administrador> listarAdministradoresActivos(){
        return administradorRepository.findAdministradorsByActivoIsTrue();
    }
    public Administrador updateAdministrador(Administrador administrador){
        return administradorRepository.save(administrador);

    }

    public Administrador deleteAdministrador(Administrador administrador){
//        Administrador foundAdministrador = administradorRepository.findAdministradorByIdAndActivoIsTrue(administrador.getId());
//        foundAdministrador.setActivo(false);
        administrador.setActivo(false);
        return administradorRepository.save(administrador);

    }


    public List<Administrador> listarAdministradoresActivos(String busqueda){
        List<Administrador> lista = new ArrayList<>();
        lista = administradorRepository.listAdministrador(busqueda);
        return  lista;
    }

    public Integer getRol(int id){
        Roles rol;
        Integer fidRol;
        rol=administradorRepository.getRol(id);
        fidRol=rol.getIdRole();
        if (rol == null) fidRol=0;
        return  fidRol;
    }
}
