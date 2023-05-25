/*
Nombre del archivo:    RolesController
Autor:                Tadeo Gallegos
Descripcion:        Archivo controller de la clase Roles
*/

package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.service.PersonasService.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

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
    @PutMapping("/modificar")
    public Roles modificarRoles(@RequestBody Roles roles){
        return  rolesService.updateRoles(roles);
    }

    @PutMapping("/eliminar")
    public  Roles eliminarRoles(@RequestBody Roles roles){
        return  rolesService.deleteRoles(roles);
    }
}
