package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.repository.ExtrasRepository.SoatVigenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SoatVigenteService {

    private final SoatVigenteRepository soatVigenteRepository;

    @Autowired
    public SoatVigenteService(SoatVigenteRepository soatVigenteRepository) {
        this.soatVigenteRepository = soatVigenteRepository;
    }
}
