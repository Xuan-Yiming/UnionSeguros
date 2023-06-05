package com.pucp.unionseguros.controller.PROCESOCOMPRASOAT;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pucp.unionseguros.model.Cotizacion.Moneda;
import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.Persona;
import com.pucp.unionseguros.model.Personas.TipoDocumento;
import com.pucp.unionseguros.model.SOAT.MetodoDePago;
import com.pucp.unionseguros.model.SOAT.Poliza;
import com.pucp.unionseguros.model.SOAT.SOAT;
import com.pucp.unionseguros.model.Vehiculo.Modelo;
import com.pucp.unionseguros.model.Vehiculo.TipoUso;
import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.service.PersonasService.ClienteService;
import com.pucp.unionseguros.service.SOATService.MetodoDePagoService;
import com.pucp.unionseguros.service.SOATService.PolizaService;
import com.pucp.unionseguros.service.SOATService.SOATService;
import com.pucp.unionseguros.service.VehiculoService.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Service
@RestController
@RequestMapping(path = "api/v1/ProcesoSOAT")
public class ProcesoSOATController {

    private final ClienteService clienteService;
    private final VehiculoService vehiculoService;
    private final MetodoDePagoService metodoDePagoService;
    private  final PolizaService polizaService;
    private final SOATService soatService;

    @Autowired
    public ProcesoSOATController(ClienteService clienteService, VehiculoService vehiculoService, MetodoDePagoService metodoDePagoService, PolizaService polizaService, SOATService soatService) {
        this.clienteService = clienteService;
        this.vehiculoService = vehiculoService;
        this.metodoDePagoService = metodoDePagoService;
        this.polizaService = polizaService;
        this.soatService = soatService;
    }


    @PostMapping("/insertarInfoProceso1")
    public ResponseEntity<String> handleJsonRequest(@RequestBody String json){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(json);

            //CLIENTE
            JsonNode clienteNode = root.get("cliente");
            Cliente cliente = new Cliente();
            if(clienteNode.has("id")){
                cliente.setId(clienteNode.get("id").asInt());
            }
            cliente.setNombre(clienteNode.get("nombre").asText());
            cliente.setApellidoPaterno(clienteNode.get("apellidoPaterno").asText());
            cliente.setApellidoMaterno(clienteNode.get("apellidoMaterno").asText());
            JsonNode fidTipoDocumentoNode = clienteNode.get("fidTipoDocumento");
            cliente.setFidTipoDocumento(new TipoDocumento());
            cliente.getFidTipoDocumento().setId(fidTipoDocumentoNode.get("id").asInt());
            cliente.setFechaCreacion(LocalDate.parse(clienteNode.get("fechaCreacion").asText()));

            if(cliente.getId()!=null){// me pasaron un ID -> existe el cliente
                //no hago nada
            }else{ // no me pasaron ID debo insertarlo
                int idRecibidoPorIngresarAlCliente;
                idRecibidoPorIngresarAlCliente = clienteService.ingresarCliente(cliente);
                cliente.setId(idRecibidoPorIngresarAlCliente);
            }

            //VEHICULO
            Vehiculo vehiculo = new Vehiculo();
            JsonNode vehiculeNode = root.get("vehiculo");
            if(vehiculeNode.has("id")){
                vehiculo.setId(vehiculeNode.get("id").asInt());
            }
                //TIPO USO
                vehiculo.setFidTipoUso(new TipoUso());
                JsonNode fidTipoUsoNode = vehiculeNode.get("fidTipoUso");
                vehiculo.getFidTipoUso().setIdTipoUso(fidTipoUsoNode.get("id").asInt());
                // MODELO
                vehiculo.setFidModelo(new Modelo());
                JsonNode fidModeloNode = vehiculeNode.get("fidModelo");
                vehiculo.getFidModelo().setId(fidModeloNode.get("id").asInt());
                //PERSONA


            vehiculo.setAnhoFabricacion(LocalDate.parse((vehiculeNode.get("anhoFabricación").asText())));
            vehiculo.setNumeroAsientos(vehiculeNode.get("numeroAsientos").asInt());
            vehiculo.setPlaca(vehiculeNode.get("placa").asText());
            vehiculo.setSerie(vehiculeNode.get("serie").asText());

            if (vehiculo.getId()!=null){ // me pasaron un ID -> vehiculo existe
                //no hago nada
            }else {// tengo que insertarlo para la persona que me estan dando
                int idRecibidoPorIngresarVehiculo;
                vehiculo.setFidPersona(new Persona());
                vehiculo.getFidPersona().setId(cliente.getId());// registrar el id con la persona que me están nadando
                idRecibidoPorIngresarVehiculo = vehiculoService.insertarVehiculo(vehiculo);
                vehiculo.setId(idRecibidoPorIngresarVehiculo);
            }


            //METODO DE PAGO
            MetodoDePago metodoDePago = new MetodoDePago();
            JsonNode MetodoPagoNode = root.get("MetodoPago");
            metodoDePago.setNombreMetodo(MetodoPagoNode.get("nombreMetodo").asText());
            metodoDePago.setNombreTitular(MetodoPagoNode.get("nombreTitular").asText());
            metodoDePago.setCorreo(MetodoPagoNode.get("correo").asText());
            metodoDePago.setNumeroTarjeta(MetodoPagoNode.get("numeroTarjeta").asText());
            metodoDePago.setCvv(MetodoPagoNode.get("cvv").asText());
            metodoDePago.setFechaVencimiento(LocalDate.parse(MetodoPagoNode.get("fechaVencimiento").asText()));

            int idRecibidoPorIngresarElMetodoDePago;
            idRecibidoPorIngresarElMetodoDePago = metodoDePagoService.insertarMetodoDePago(metodoDePago);


            //POLIZA
            Poliza poliza = new Poliza();
            JsonNode PolizaNode = root.get("poliza");
                //MONEDA
                poliza.setFidMoneda(new Moneda());
                JsonNode fidMonedaNode = PolizaNode.get("fidMoneda");
                poliza.getFidMoneda().setId(fidMonedaNode.get("id").asInt());
            poliza.setPrecioBase(PolizaNode.get("precioBase").asDouble());
            poliza.setFechaVigenciaDesde(LocalDate.parse(PolizaNode.get("fechaVigenciaDesde").asText()));
            poliza.setFechaVigenciaFin(LocalDate.parse(PolizaNode.get("fechaVigenciaFin").asText()));



            //SOAT
            SOAT soat = new SOAT();
            JsonNode SoatNode = root.get("soat");

            soat.setFechaDeEmision(LocalDate.parse(SoatNode.get("fechaDeEmision").asText()));
            soat.setMontoPrima(SoatNode.get("montoPrima").asDouble());



            return ResponseEntity.ok("InsertoCorrectamente Todo");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al procesar el JSON");
        }
    }
}
