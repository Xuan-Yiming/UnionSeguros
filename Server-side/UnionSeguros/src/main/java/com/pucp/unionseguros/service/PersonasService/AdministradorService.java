package com.pucp.unionseguros.service.PersonasService;

import com.pucp.unionseguros.model.Personas.Administrador;
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
}
