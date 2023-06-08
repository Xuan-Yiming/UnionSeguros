/*
Nombre del archivo:    UsuarioController
Autor:                Jarumy Novoa
Descripcion:        Archivo controller de la clase Departamento
*/

package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.service.PersonasService.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping(path ="/login")
    public int login(@RequestParam(name = "email") String email,@RequestParam(name = "contrasena") String contrasena){
        return usuarioService.login(email, contrasena);
    }

    @GetMapping("/verificarExistenciaDeCliente")
    public Usuario verificarCliente(@RequestBody List<String> informacion ){
        return usuarioService.verificarExistenciaDeCliente(informacion.get(0), Integer.valueOf(informacion.get(1)));
    }

    @GetMapping(params = "correoIngresado",path = "/verificarEmailIngresadoDisponible")
    public boolean verificarCorreo(@RequestParam(name = "correoIngresado") String correoIngresado){
        return usuarioService.CorreoIngresadoDisponible(correoIngresado);
    }
}
