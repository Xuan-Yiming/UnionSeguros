package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.Auditoria;
import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.repository.ExtrasRepository.AuditoriaRepository;
import com.pucp.unionseguros.repository.PersonasRepository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class AuditoriaService {
    private final AuditoriaRepository auditoriaRepository;
    private final UsuarioRepository usuarioRepository;
    @Autowired
    public AuditoriaService(AuditoriaRepository auditoriaRepository, UsuarioRepository usuarioRepository) {
        this.auditoriaRepository = auditoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Auditoria> listarAuditoria(){
        return auditoriaRepository.findAll();
    }
    public Auditoria insertarAuditoria(Auditoria auditoria){
        return  auditoriaRepository.saveAndFlush(auditoria);
    }

    public List<Auditoria> buscarAuditoriaParametro(String busqueda){
        List<Auditoria> lista = new ArrayList<>();
        lista = auditoriaRepository.findAuditoriaParametro(busqueda);
        return  lista;
    }

    public List<Auditoria> listarAuditoriasPorID(Integer id){
        List<Auditoria> list = null;
        Usuario usuario = usuarioRepository.findUsuarioById(id);
        list = auditoriaRepository.findAuditoriasByFidUsuario(usuario);
        return list;
    }
}
