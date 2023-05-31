package com.pucp.unionseguros.controller.CotizacionController;

import com.pucp.unionseguros.model.Cotizacion.Moneda;
import com.pucp.unionseguros.service.CotizacionService.MonedaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/Moneda")
public class MonedaController {

    private final MonedaService monedaService;


    @Autowired
    public MonedaController(MonedaService monedaService) {
        this.monedaService = monedaService;
    }

    @GetMapping("/listar")
    public List<Moneda> listarMonedas(){
        return  monedaService.listarMonedas();
    }
}
