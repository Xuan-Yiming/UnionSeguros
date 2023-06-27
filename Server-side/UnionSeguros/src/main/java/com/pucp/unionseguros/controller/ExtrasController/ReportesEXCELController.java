package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.service.ExtrasService.ReportesEXCELService;
import com.pucp.unionseguros.service.PersonasService.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RestController
@RequestMapping(path = "api/v1/reportesEXCEL")
public class ReportesEXCELController {

    private final ClienteService clienteService;

    private  final ReportesEXCELService reportesEXCELService;
    @Autowired
    public ReportesEXCELController(ClienteService clienteService, ReportesEXCELService reportesEXCELService) {
        this.clienteService = clienteService;
        this.reportesEXCELService = reportesEXCELService;
    }

    @GetMapping("/EXCELClientes")
    public ModelAndView generarEXCELClientes(){
        List<Cliente> clientes = clienteService.findClientesActivos();
        Map<String, Object> model = new HashMap<>();
        model.put("Clientes", clientes);
        return new ModelAndView(reportesEXCELService,model);
    }
}
