package com.pucp.unionseguros.service.DistritoService;

import com.pucp.unionseguros.model.Distritos.Distrito;
import com.pucp.unionseguros.model.Distritos.Provincia;
import com.pucp.unionseguros.repository.DistritosRepository.DistritoRepository;
import com.pucp.unionseguros.repository.DistritosRepository.ProvinciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DistritoService {

    private final DistritoRepository distritoRepository;
    private final ProvinciaRepository provinciaRepository;


    @Autowired
    public DistritoService(DistritoRepository distritoRepository,
                           ProvinciaRepository provinciaRepository) {
        this.distritoRepository = distritoRepository;
        this.provinciaRepository = provinciaRepository;
    }

    public List<Distrito> listarDistritosPorProvincia(Integer idProvincia){
        Provincia provincia = new Provincia();
        provincia = provinciaRepository.findProvinciaById(idProvincia);

        return  distritoRepository.findDistritosByFidProvincia(provincia);
    }
}
