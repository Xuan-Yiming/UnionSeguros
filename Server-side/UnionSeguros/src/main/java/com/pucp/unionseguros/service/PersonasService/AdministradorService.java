package com.pucp.unionseguros.service.PersonasService;

import com.pucp.unionseguros.model.Personas.Administrador;
import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.repository.PersonasRepository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdministradorService {
    final private AdministradorRepository administradorRepository;

    @Autowired
    public AdministradorService(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    public int ingresarAdministrador(Administrador administrador){
        Administrador savedAdministrador = administradorRepository.saveAndFlush(administrador);
        return  savedAdministrador.getId();
    }

    public List<Administrador> listarAdministradoresActivos(){
        return administradorRepository.findAdministradorsByActivoIsTrue();
    }
    public Administrador updateAdministrador(Administrador administrador){
        Administrador foundAdministrador = administradorRepository.findAdministradorByIdAndActivoIsTrue(administrador.getId());
        foundAdministrador = administrador;
        return administradorRepository.save(foundAdministrador);

    }

    public Administrador deleteAdministrador(Administrador administrador){
        Administrador foundAdministrador = administradorRepository.findAdministradorByIdAndActivoIsTrue(administrador.getId());
        foundAdministrador.setActivo(false);
        return administradorRepository.save(foundAdministrador);

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
