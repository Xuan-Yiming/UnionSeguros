package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.service.ExtrasService.CalculoPrimaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Service
@RestController
@RequestMapping(path = "api/v1/calculoPrima")
public class CalculoPrimaController {

    private final CalculoPrimaService calculoPrimaService;

    @Autowired
    public CalculoPrimaController(CalculoPrimaService calculoPrimaService) {
        this.calculoPrimaService = calculoPrimaService;
    }
    @PostMapping("/CargaMasivaCalculoPrima")
    public String cargaMasiva(@RequestParam("file") MultipartFile file){
        return calculoPrimaService.cargaMasivaParaCalculoPrima(file);
    }
}
