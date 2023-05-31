package com.pucp.unionseguros.service.DistritoService;

import com.pucp.unionseguros.model.Distritos.Departamento;
import com.pucp.unionseguros.model.Distritos.Provincia;
import com.pucp.unionseguros.repository.DistritosRepository.DepartamentoRepository;
import com.pucp.unionseguros.repository.DistritosRepository.ProvinciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProvinciaService {

    private final ProvinciaRepository provinciaRepository;
    private final DepartamentoRepository departamentoRepository;

    @Autowired
    public ProvinciaService(ProvinciaRepository provinciaRepository,
                            DepartamentoRepository departamentoRepository) {
        this.provinciaRepository = provinciaRepository;
        this.departamentoRepository = departamentoRepository;
    }

    public List<Provincia> listarProvinciasPorDepartamento(Integer idDepartamento){
        Departamento departamento = new Departamento();
        departamento = departamentoRepository.findDepartamentoById(idDepartamento);

        return provinciaRepository.findProvinciasByFidDepartamento(departamento);

    }
}
