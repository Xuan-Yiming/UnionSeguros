package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.Auditoria;
import com.pucp.unionseguros.repository.ExtrasRepository.AuditoriaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class AuditoriaService {
    private final AuditoriaRepository auditoriaRepository;

    @Autowired
    public AuditoriaService(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
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
        list = auditoriaRepository.findAuditoriasById(id);
        return list;
    }
}
