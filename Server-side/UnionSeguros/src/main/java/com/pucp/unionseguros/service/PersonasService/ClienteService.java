package com.pucp.unionseguros.service.PersonasService;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.repository.ExtrasRepository.ListaNegraRepository;
import com.pucp.unionseguros.repository.PersonasRepository.ClienteRepository;
import com.pucp.unionseguros.repository.PersonasRepository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ClienteService {
    final private  ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    private final ListaNegraRepository listaNegraRepository;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository,
                          UsuarioRepository usuarioRepository, ListaNegraRepository listaNegraRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.listaNegraRepository = listaNegraRepository;
    }

    public List<Cliente> listarClientes(){
        return clienteRepository.findAll();
    }

    public int ingresarCliente(Cliente cliente) {

        int verificacion=0;
        Usuario foundUsuario = null, foundEmaailAdministrador=null;
        foundUsuario = usuarioRepository.findUsuarioByNumeroDocumento(cliente.getNumeroDocumento());
        if(cliente.getEmail()!=null){
            foundEmaailAdministrador =  usuarioRepository.findUsuarioByEmail(cliente.getEmail().toString());
            verificacion=1;
        }

        if(foundUsuario !=null){
            return 0;
        } else if (foundEmaailAdministrador !=null && verificacion==1) {
            return -1;
        } else{
            Cliente savedCliente = clienteRepository.saveAndFlush(cliente);


            return savedCliente.getId();
        }

    }

    public Cliente buscarClientePorDocumento(String numeroDocumentoIngresado){
        Cliente cliente = null;
        cliente = clienteRepository.findClienteByNumeroDocumentoAndActivoIsTrue(numeroDocumentoIngresado);
        if(cliente==null){
            ListaNegra listaNegra =null;
            listaNegra = listaNegraRepository.encontrarClienteListaNegra(numeroDocumentoIngresado);
            if(listaNegra!=null){
                Cliente cliente1 = new Cliente();
                cliente1.setId(-1);
                return cliente1;
            }
        }

        return cliente;
    }
    public Cliente updateCliente(Cliente cliente){
        return clienteRepository.save(cliente);
    }

    public Cliente deleteCliente(Cliente cliente){
        Cliente foundCliente = clienteRepository.findClienteByIdAndActivoIsTrue(cliente.getId());
        foundCliente.setActivo(false);
        return clienteRepository.save(foundCliente);
    }

    public Integer getRol(int id){
        Roles rol;
        Integer fidRol;
        rol=clienteRepository.getRol(id);
        fidRol=rol.getIdRole();
        if (rol == null) fidRol=0;
        return  fidRol;
    }

    public List<Cliente> listarClientesActivos(String busqueda){
        List<Cliente> lista = new ArrayList<>();
        lista = clienteRepository.listCliente(busqueda);
        return  lista;
    }

    public List<Cliente> findClientesActivos(){
        List<Cliente> lista = new ArrayList<>();
        lista = clienteRepository.findClientesByActivoIsTrue();
        return  lista;
    }


}
