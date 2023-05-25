/*
Nombre del archivo:    ClienteController
Autor:                Andrea Mejia
Descripcion:        Archivo controller de la clase cliente
*/

package com.pucp.unionseguros.controller.PersonasController;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.service.PersonasService.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/cliente")
public class ClienteController {

    private final ClienteService clienteService;
    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }
    @GetMapping("/listarTodos")
    public List<Cliente> listarClientes(){
        return clienteService.listarClientes();
    }

    //Retorna la info del cliente
    @GetMapping(params = "numDocumentoIngresado",path = "/buscarClientePorNumDocumento")
    public Cliente buscarClientePorDocumento(@RequestParam(name = "numDocumentoIngresado") String numDocumento){
        return clienteService.buscarClientePorDocumento(numDocumento);
    }
    @PostMapping("/ingresar")
    public int registrarNuevoCliente(@RequestBody Cliente cliente){
        return clienteService.ingresarCliente(cliente);
    }



    @PutMapping("/modificar")
    public Cliente modificarCliente(@RequestBody Cliente cliente){
        return clienteService.updateCliente(cliente);
    }

    @PutMapping("/eliminar")
    public Cliente eliminarCliente(@RequestBody Cliente cliente){
        return clienteService.deleteCliente(cliente);
    }
}
