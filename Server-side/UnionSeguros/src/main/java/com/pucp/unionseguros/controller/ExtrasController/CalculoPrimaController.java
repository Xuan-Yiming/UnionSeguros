package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.service.ExtrasService.CalculoPrimaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Service
@RestController
@RequestMapping(path = "api/v1/calculoPrima")
public class CalculoPrimaController {

    final private CalculoPrimaService calculoPrimaService;

    @Autowired
    public CalculoPrimaController(CalculoPrimaService calculoPrimaService) {
        this.calculoPrimaService = calculoPrimaService;
    }

    @PostMapping("/CargaMasivaCalculoPrima")
    public String cargaMasiva(@RequestParam("file") MultipartFile file){
        return calculoPrimaService.cargaMasivaParaCalculoPrima(file);
    }

    @GetMapping("/ObtenerCalculoPrima")
    public double obtenerValorDelaPrima(@RequestParam(name = "marcaIngresada") String marcaIngresada,
                                        @RequestParam(name = "modeloIngresado")String modeloIngresado,
                                        @RequestParam(name = "anhoIngresado")Integer anhoIngresado){
        return calculoPrimaService.calcularMontoPrimaVerificando(marcaIngresada,modeloIngresado,anhoIngresado);
    }
}
