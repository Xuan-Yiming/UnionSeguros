package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.model.SOAT.BoletaDeVenta;
import com.pucp.unionseguros.service.ExtrasService.ListaNegraService;
import com.pucp.unionseguros.service.ExtrasService.ReportesPDFService;
import com.pucp.unionseguros.service.ExtrasService.ReportesVentasPDFService;
import com.pucp.unionseguros.service.SOATService.BoletaDeVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RestController
@RequestMapping(path = "api/v1/reportesPDF")
public class ReportesPDFController{

    private final ListaNegraService listaNegraService;
    private final ReportesPDFService reportesPDFService;

    private final ReportesVentasPDFService reportesVentasPDFService;

    private final BoletaDeVentaService boletaDeVentaService;
    @Autowired
    public ReportesPDFController(ListaNegraService listaNegraService, ReportesPDFService reportesPDFService, ReportesVentasPDFService reportesVentasPDFService, BoletaDeVentaService boletaDeVentaService) {
        this.listaNegraService = listaNegraService;
        this.reportesPDFService = reportesPDFService;
        this.reportesVentasPDFService = reportesVentasPDFService;
        this.boletaDeVentaService = boletaDeVentaService;
    }

    @GetMapping(value = "/generar",produces =  MediaType.APPLICATION_PDF_VALUE)
    public ModelAndView generarPDFListaNegra(){
        List<ListaNegra> clientes = listaNegraService.listarTodasListaNegras();
        Map<String, Object> model = new HashMap<>();
        model.put("Clientes", clientes);
        return new ModelAndView(reportesPDFService,model);
    }

    @GetMapping(value = "/generarReporteVentas",produces = MediaType.APPLICATION_PDF_VALUE)
    public ModelAndView generarPDFDeVentas(@RequestParam(name = "fechaUno") LocalDate fechaUno,
                                           @RequestParam(name = "fechaDos")LocalDate fechaDos){
        List<BoletaDeVenta> boletas = boletaDeVentaService.listarBoletaDeVentasDentroDeRango(fechaUno,fechaDos);
        Map<String,Object> model = new HashMap<>();
        model.put("boletas",boletas);
        return new ModelAndView(reportesVentasPDFService,model);
    }

//
//
//    public String listarListaNegra(Model model){
//
//        model.addAttribute("Titulo","Lista Pertenecientes a lista Negra");
//        model.addAttribute("Clientes",lista);
//        return "/listarYCrearReporte";
//
//    }

}
