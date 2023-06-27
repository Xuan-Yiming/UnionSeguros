package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.model.Personas.Cliente;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xslf.usermodel.XSLFColor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.document.AbstractXlsxView;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
public class ReportesEXCELService extends AbstractXlsxView {
    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook,
                                      HttpServletRequest request, HttpServletResponse response) throws Exception {

        DateTimeFormatter formatoFinal = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//        LocalDate fechaActual=LocalDate.now();
//        DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//        String fechaActualString = fechaActual.format(formato);
        response.setHeader("Content-Disposition","attachment; filename=\"Union-Seguros-listado-clientes.xlsx\"");
        Sheet hoja = workbook.createSheet("Clientes");

        //ESTILOS DE COLOR
        CellStyle estiloTituloPrincipal = workbook.createCellStyle();
        Font fuenteTituloPrincipal = workbook.createFont();
        fuenteTituloPrincipal.setBold(true);
        fuenteTituloPrincipal.setFontHeightInPoints((short) 16);
        fuenteTituloPrincipal.setColor(IndexedColors.WHITE.getIndex());
        estiloTituloPrincipal.setFont(fuenteTituloPrincipal);
        estiloTituloPrincipal.setFillForegroundColor(IndexedColors.RED.getIndex());
        estiloTituloPrincipal.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        estiloTituloPrincipal.setAlignment(HorizontalAlignment.CENTER);

        // Estilos para los subtitulos
        CellStyle estiloSubtitulo = workbook.createCellStyle();
        Font fuenteSubtitulo = workbook.createFont();
        fuenteSubtitulo.setBold(true);
        fuenteSubtitulo.setFontHeightInPoints((short) 12);
        fuenteSubtitulo.setColor(IndexedColors.WHITE.getIndex());
        estiloSubtitulo.setFont(fuenteSubtitulo);
        estiloSubtitulo.setFillForegroundColor(IndexedColors.GREY_80_PERCENT.getIndex()); // Gris oscuro
        estiloSubtitulo.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        estiloSubtitulo.setAlignment(HorizontalAlignment.CENTER);


        CellStyle estiloCeldaCentrado = workbook.createCellStyle();
        estiloCeldaCentrado.setAlignment(HorizontalAlignment.CENTER);

        Row filaTitulo = hoja.createRow(0);
        Cell celda = filaTitulo.createCell(0);
        celda.setCellValue("LISTADO GENERAL DE CLIENTES");
        celda.setCellStyle(estiloTituloPrincipal);

        Row filaData = hoja.createRow(2);
        String[] columnas = {"NOMBRE COMPLETO","TIPO DOCUMENTO","NUMERO DOCUMENTO","EMAIL","TELEFONO","ESTADO","FECHA CREACION"};
        for (int i=0;i<columnas.length;i++){
            celda = filaData.createCell(i);
            celda.setCellValue(columnas[i]);
            celda.setCellStyle(estiloSubtitulo);
        }

        List<Cliente> listaC = (List<Cliente>) model.get("Clientes");

        int numFila = 3;
        for (Cliente cliente : listaC) {
            filaData = hoja.createRow(numFila);
            filaData.createCell(0).setCellValue(cliente.getNombre() + " " + cliente.getApellidoPaterno() + " " + cliente.getApellidoMaterno());
            filaData.createCell(1).setCellValue(cliente.getFidTipoDocumento().getNombre());
            filaData.createCell(2).setCellValue(cliente.getNumeroDocumento());
            filaData.createCell(3).setCellValue(cliente.getEmail());
            String mensajeDeLlenadodeInf = "---------";
            if (cliente.getTelefono() == null) {
                filaData.createCell(4).setCellValue(mensajeDeLlenadodeInf);
            } else {
                filaData.createCell(4).setCellValue(cliente.getTelefono());
            }
            if (cliente.isBaneado() == false) {
                filaData.createCell(5).setCellValue("Activo");
            } else {
                filaData.createCell(5).setCellValue("Baneado");
            }

            String fechaFin = cliente.getFechaCreacion().format(formatoFinal);
            filaData.createCell(6).setCellValue(fechaFin);

            for (int i = 0; i < columnas.length; i++) {
                filaData.getCell(i).setCellStyle(estiloCeldaCentrado);
                hoja.autoSizeColumn(i);
            }

            numFila++;
        }

        for (int i = 0; i < columnas.length; i++) {
            hoja.autoSizeColumn(i);
        }
    }
}
