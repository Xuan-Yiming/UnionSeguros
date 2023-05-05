<<<<<<< HEAD
/*
Nombre del archivo:    UsuarioController
Autor:                Jarumy Novoa
Descripcion:        Archivo controller de la clase Departamento
*/

=======
>>>>>>> 9414ed6f0c2b7a672da300273dac0d67e1d736a7
package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.service.PersonasService.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping()
    public List<Usuario> listarUsuarios(){
        return usuarioService.listarUsuarios();
    }
}
