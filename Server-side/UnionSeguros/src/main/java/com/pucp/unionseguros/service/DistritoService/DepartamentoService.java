package com.pucp.unionseguros.service.DistritoService;

import com.pucp.unionseguros.model.Distritos.Departamento;
import com.pucp.unionseguros.repository.DistritosRepository.DepartamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DepartamentoService {
    private final DepartamentoRepository departamentoRepository;

    @Autowired
    public DepartamentoService(DepartamentoRepository departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    public List<Departamento> listarDepartamentos(){
        List<Departamento> lista = null;
        lista = departamentoRepository.findAll();
        if(lista==null) return null;
        return  lista;
    }



}
