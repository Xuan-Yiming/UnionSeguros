package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Administrador;
import com.pucp.unionseguros.service.PersonasService.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/administrador")
public class AdministradorController {
    final private AdministradorService administradorService;

    @Autowired
    public AdministradorController(AdministradorService administradorService) {
        this.administradorService = administradorService;
    }

    @GetMapping("/listarTodosActivos")
    public List<Administrador> listarAdministradoresActivos(){
        List<Administrador> lista = new ArrayList<>();
        lista = administradorService.listarAdministradoresActivos();
        return  lista;
    }

    @PostMapping("/ingresar")
    public int registrarNuevoAdministrador(Administrador administrador){
        return  administradorService.ingresarAdministrador(administrador);
    }
}
