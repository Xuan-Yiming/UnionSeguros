package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.service.ExtrasService.SoatVigenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Service
@RestController
@RequestMapping(path = "api/v1/SoatVigente")
public class SoatVigenteController {
    private final SoatVigenteService soatVigenteService;

    @Autowired
    public SoatVigenteController(SoatVigenteService soatVigenteService) {
        this.soatVigenteService = soatVigenteService;
    }

    @PostMapping("/CargaMasivaSoatVigente")
    public String cargaMasiva(@RequestParam("file") MultipartFile file){
        return soatVigenteService.cargaMasivaDeSoatsVigentes(file);
    }


}
