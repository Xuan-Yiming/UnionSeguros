package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.service.ExtrasService.ListaNegraService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Service
@RestController
@RequestMapping(path = "api/v1/listaNegra")
public class ListaNegraController {

    private final ListaNegraService listaNegraService;

    @Autowired
    public ListaNegraController(ListaNegraService listaNegraService) {
        this.listaNegraService = listaNegraService;
    }

    @PostMapping("/cargaMasivaListaNegra")
    public String cargaMasiva(@RequestParam ("file")MultipartFile file){
        return listaNegraService.cargaMasivaDeListaNegra(file);
    }
}
