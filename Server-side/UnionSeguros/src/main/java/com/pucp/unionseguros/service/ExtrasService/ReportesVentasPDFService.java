package com.pucp.unionseguros.service.ExtrasService;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.model.SOAT.BoletaDeVenta;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.document.AbstractPdfView;

import java.awt.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
public class ReportesVentasPDFService extends AbstractPdfView {
    @Override
    protected void buildPdfDocument(Map<String, Object> model, Document document, PdfWriter writer,
                                    HttpServletRequest request, HttpServletResponse response) throws Exception {
        DateTimeFormatter formatoFinal = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        List<BoletaDeVenta> listaBoletasVentas = (List<BoletaDeVenta>) model.get("boletas");
        document.setPageSize(PageSize.A4.rotate());
        //document.setMargins(-20,-20,30,40);
        document.open();

        Font fuentetitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD,16, Color.white);
        Font fuenteTituloColumnas = FontFactory.getFont(FontFactory.HELVETICA_BOLD,12,Color.white);
        Font fuenteDataCeldas = FontFactory.getFont(FontFactory.COURIER,10,Color.BLACK);

        PdfPTable tablaTitulo = new PdfPTable(1);
        PdfPCell celda = null;

        celda = new PdfPCell(new Phrase("REPORTE DE VENTAS DE SOAT UNION SEGUROS",fuentetitulo));
        celda.setBorder(0);
        celda.setBackgroundColor(new Color(200,16,46));
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(30);

        tablaTitulo.addCell(celda);
        tablaTitulo.setSpacingAfter(30);


        PdfPTable tablaClientes = new PdfPTable(7);
        tablaClientes.setWidths(new float[]{1f,1.5f,1f,1f,1f,1f,1f});


        celda = new PdfPCell(new Phrase("NOMBRE",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("DOCUMENTO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("NOMBRE PLAN",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("COSTO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("FECHA INICIO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("FECHA FIN",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        celda = new PdfPCell(new Phrase("FECHA DE COMPRA",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaClientes.addCell(celda);

        for (BoletaDeVenta lista: listaBoletasVentas){

            //NOMBRE
            celda = new PdfPCell(new Phrase(lista.getFidSoat().getFidPoliza().getFidCliente().getNombre() + " " +
                    lista.getFidSoat().getFidPoliza().getFidCliente().getApellidoPaterno() + " " +
                    lista.getFidSoat().getFidPoliza().getFidCliente().getApellidoMaterno()
                    ,fuenteDataCeldas));
            celda.setPadding(7);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);
            //DNI
            celda = new PdfPCell(new Phrase(lista.getFidSoat().getFidPoliza().getFidCliente().getFidTipoDocumento().getNombre() +" "+
                    lista.getFidSoat().getFidPoliza().getFidCliente().getNumeroDocumento()
                    ,fuenteDataCeldas));
            celda.setPadding(7);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);

            //NOMBRE PLAN
            celda = new PdfPCell(new Phrase(lista.getFidSoat().getFidPlanSoat().getNombrePlan(),fuenteDataCeldas));
            celda.setPadding(7);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);


            //COSTO
            celda = new PdfPCell(new Phrase(String.valueOf(lista.getMonto()),fuenteDataCeldas));
            celda.setPadding(7);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);


            //FECHA INICIO
            String fechaInicial = lista.getFidSoat().getFidPoliza().getFechaVigenciaDesde().format(formatoFinal);
            celda = new PdfPCell(new Phrase(fechaInicial,fuenteDataCeldas));
            celda.setPadding(7);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);

            //FECHA FIN
            String fechaFin = lista.getFidSoat().getFidPoliza().getFechaVigenciaFin().format(formatoFinal);
            celda = new PdfPCell(new Phrase(fechaFin,fuenteDataCeldas));
            celda.setPadding(7);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);

            //FECHA DE COMPRA
            String fechaCompra = lista.getFechaEmision().format(formatoFinal);
            celda = new PdfPCell(new Phrase(fechaCompra,fuenteDataCeldas));
            celda.setPadding(7);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setVerticalAlignment(Element.ALIGN_CENTER);
            tablaClientes.addCell(celda);
        }

        PdfContentByte cb = writer.getDirectContent();
        Phrase footer = new Phrase("Union Seguros \n", fuenteDataCeldas);
        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, footer,
                (document.right() - document.left()) / 2 + document.leftMargin(), document.bottom() - 20, 0);


        document.add(tablaTitulo);
        document.add(tablaClientes);
    }
}
