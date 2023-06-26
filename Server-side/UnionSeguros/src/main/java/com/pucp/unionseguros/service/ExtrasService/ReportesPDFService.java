package com.pucp.unionseguros.service.ExtrasService;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.*;
import com.pucp.unionseguros.model.Extras.ListaNegra;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.document.AbstractPdfView;
import java.awt.*;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
public class ReportesPDFService extends AbstractPdfView {
    @Override
    protected void buildPdfDocument(Map<String, Object> model, Document document, PdfWriter writer,
                                    HttpServletRequest request, HttpServletResponse response) throws Exception {
        List<ListaNegra> listadoListaNegra = (List<ListaNegra>) model.get("Clientes");

        document.setPageSize(PageSize.LETTER.rotate());
        document.setMargins(-20,-20,30,40);
        document.open();

        Font fuentetitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD,16,Color.white);
        Font fuenteTituloColumnas = FontFactory.getFont(FontFactory.HELVETICA_BOLD,12,Color.white);
        Font fuenteDataCeldas = FontFactory.getFont(FontFactory.COURIER,10,Color.BLACK);

        PdfPTable tablaTitulo = new PdfPTable(1);
        PdfPCell celda = null;


        celda = new PdfPCell(new Phrase("LISTA NEGRA UNION SEGUROS",fuentetitulo));
        celda.setBorder(0);
        celda.setBackgroundColor(new Color(200,16,46));
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(30);


        tablaTitulo.addCell(celda);
        tablaTitulo.setSpacingAfter(30);


        PdfPTable tablaClientes = new PdfPTable(5);
        tablaClientes.setWidths(new float[]{1f,1f,1f,1f,1f});

        celda = new PdfPCell(new Phrase("N#",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("TIPO DOCUMENTO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("NUM. DOCUMENTO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("NOMBRE COMPLETO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("MOTIVO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);


        final int[] n = {1};
        for (ListaNegra lista: listadoListaNegra){
            celda = new PdfPCell(new Phrase(String.valueOf(n[0]),fuenteDataCeldas));
            celda.setPadding(5);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);

            celda = new PdfPCell(new Phrase(lista.getTipoDocumento(),fuenteDataCeldas));
            celda.setPadding(5);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);

            celda = new PdfPCell(new Phrase(lista.getNumeroDocumento(),fuenteDataCeldas));
            celda.setPadding(5);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);

            celda = new PdfPCell(new Phrase(lista.getNombreApellidos(),fuenteDataCeldas));
            celda.setPadding(5);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);

            celda = new PdfPCell(new Phrase(lista.getMotivo(),fuenteDataCeldas));
            celda.setPadding(5);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);
            n[0]++;
        }
        // Agregar pie de página
        PdfContentByte cb = writer.getDirectContent();
        Phrase footer = new Phrase("Union Seguros \n", fuenteDataCeldas);
        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, footer,
                (document.right() - document.left()) / 2 + document.leftMargin(), document.bottom() - 20, 0);


        document.add(tablaTitulo);
        document.add(tablaClientes);

    }
}
