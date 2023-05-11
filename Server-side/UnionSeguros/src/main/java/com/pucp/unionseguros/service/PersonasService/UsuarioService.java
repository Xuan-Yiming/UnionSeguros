package com.pucp.unionseguros.service.PersonasService;

import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.repository.PersonasRepository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UsuarioService {
    final private UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarUsuarios(){
        return usuarioRepository.findAll();
    }

    public List<Usuario> buscarUsuario(String busqueda){
        List<Usuario> lista = new ArrayList<>();
        lista = usuarioRepository.findUsuario(busqueda);
        return  lista;
    }
}
