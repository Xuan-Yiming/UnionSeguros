package com.pucp.unionseguros.controller.ExtrasController;

import com.lowagie.text.Document;
import com.lowagie.text.pdf.PdfWriter;
import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.service.ExtrasService.ListaNegraService;
import com.pucp.unionseguros.service.ExtrasService.ReportesPDFService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.document.AbstractPdfView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RestController
@RequestMapping(path = "api/v1/reportesPDF")
public class ReportesPDFController{

    private final ListaNegraService listaNegraService;
    private final ReportesPDFService reportesPDFService;
    @Autowired
    public ReportesPDFController(ListaNegraService listaNegraService, ReportesPDFService reportesPDFService) {
        this.listaNegraService = listaNegraService;
        this.reportesPDFService = reportesPDFService;
    }

    @GetMapping(value = "/generar",produces =  MediaType.APPLICATION_PDF_VALUE)
    public ModelAndView generarPDFListaNegra(){
        List<ListaNegra> clientes = listaNegraService.listarTodasListaNegras();
        Map<String, Object> model = new HashMap<>();
        model.put("Clientes", clientes);
        return new ModelAndView(reportesPDFService,model);
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
