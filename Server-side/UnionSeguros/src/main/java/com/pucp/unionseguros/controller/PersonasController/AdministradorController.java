package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Administrador;
import com.pucp.unionseguros.service.PersonasService.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping(params = "busqueda",path ="/listarAdministradoresActivos")
    public List<Administrador> listarAdministradoresActivos(@RequestParam(name = "busqueda") String busqueda){
        return administradorService.listarAdministradoresActivos(busqueda);
    }


    @PostMapping("/insertar")
    public int registrarNuevoAdministrador(@RequestBody Administrador administrador){
        return  administradorService.ingresarAdministrador(administrador);
    }

    @PutMapping("/modificar")
    public Administrador modificarAdministrador(@RequestBody Administrador administrador){
        return administradorService.updateAdministrador(administrador);
    }

    @PutMapping("/eliminar")
    public Administrador eliminarAdministrador(@RequestBody Administrador administrador){
        return administradorService.deleteAdministrador(administrador);
    }

    /*PARTE DE LOGIN NO TOCAR*/
    @GetMapping(path ="/getRol")
    public Integer getRol(@RequestParam(name = "id") int id){
        return administradorService.getRol(id);
    }


}
