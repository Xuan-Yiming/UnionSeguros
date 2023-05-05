<<<<<<< HEAD
/*
Nombre del archivo:    RolesController
Autor:                Tadeo Gallegos
Descripcion:        Archivo controller de la clase Roles
*/

=======
>>>>>>> 9414ed6f0c2b7a672da300273dac0d67e1d736a7
package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.service.PersonasService.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/roles")
public class RolesController {
    final private RolesService rolesService;

    @Autowired
    public RolesController(RolesService rolesService) {
        this.rolesService = rolesService;
    }

    @GetMapping("/listarTodos")
    public List<Roles> listarRoles(){
        return rolesService.listarRoles();
    }

    @GetMapping("/listarActivos")
    public List<Roles> listarRolesActivos(){
        return rolesService.ListarRolesActivos();
    }

    @PostMapping("/insertar")
    public Roles insertarNuevoRoles(Roles roles){
        return rolesService.insertarRol(roles);
    }
}
