package com.pucp.unionseguros.service.PersonasService;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.repository.PersonasRepository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClienteService {
    final private  ClienteRepository clienteRepository;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> listarClientes(){
        return clienteRepository.findAll();
    }

    public int ingresarCliente(Cliente cliente) {
        Cliente savedCliente = clienteRepository.saveAndFlush(cliente);
        return savedCliente.getId();
    }

    public Cliente buscarClientePorDocumento(String numeroDocumentoIngresado){
        Cliente cliente = null;
        cliente = clienteRepository.findClienteByNumeroDocumentoAndActivoIsTrue(numeroDocumentoIngresado);
        return cliente;
    }
}
