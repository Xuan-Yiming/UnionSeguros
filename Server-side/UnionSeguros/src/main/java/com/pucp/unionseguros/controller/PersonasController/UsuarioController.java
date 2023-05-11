/*
Nombre del archivo:    UsuarioController
Autor:                Jarumy Novoa
Descripcion:        Archivo controller de la clase Departamento
*/

package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.service.PersonasService.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/usuario")
public class UsuarioController {

    final private UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/ListarTodos")
    public List<Usuario> listarUsuarios(){
        return usuarioService.listarUsuarios();
    }

    @GetMapping(params = "busqueda",path ="/buscarUsuario")
    public List<Usuario> buscarUsuario(@RequestParam(name = "busqueda") String busqueda){
        return usuarioService.buscarUsuario(busqueda);
    }
}
