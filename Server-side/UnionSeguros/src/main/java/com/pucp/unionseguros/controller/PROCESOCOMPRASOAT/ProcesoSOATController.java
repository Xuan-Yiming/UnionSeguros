package com.pucp.unionseguros.controller.PROCESOCOMPRASOAT;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pucp.unionseguros.model.Cotizacion.Moneda;
import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.Persona;
import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.model.Personas.TipoDocumento;
import com.pucp.unionseguros.model.SOAT.MetodoDePago;
import com.pucp.unionseguros.model.SOAT.PlanSOAT;
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
        String errorNombre="";
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
            cliente.setNumeroDocumento(clienteNode.get("numeroDocumento").asText());
            cliente.setEmail(clienteNode.get("email").asText());

            //ROLES
            JsonNode fidRolesNode = clienteNode.get("fidRoles");
            cliente.setFidRoles(new Roles());
            cliente.getFidRoles().setIdRole(fidRolesNode.get("id").asInt());
            //TipoDocuemnto
            JsonNode fidTipoDocumentoNode = clienteNode.get("fidTipoDocumento");
            cliente.setFidTipoDocumento(new TipoDocumento());
            cliente.getFidTipoDocumento().setId(fidTipoDocumentoNode.get("id").asInt());
            cliente.setFechaCreacion(LocalDate.parse(clienteNode.get("fechaCreacion").asText()));

            //correo de creado manualmente
//            if(!clienteNode.has("id")){ //CLIENTE NUEVO SE LE ASIGNA UN CORREO HASTA QUE QUIERA ASIGNAR SU CUENTA
//                cliente.setEmail(cliente.getNumeroDocumento().toString()+"UnionSeguros.pe.com");
//            }




            if(cliente.getId()!=null){// me pasaron un ID -> existe el cliente
                //no hago nada
            }else{ // no me pasaron ID debo insertarlo
                int idRecibidoPorIngresarAlCliente;
                cliente.setActivo(true);
                cliente.setActivoPersona(true);
                cliente.setActivoUsuario(true);
                idRecibidoPorIngresarAlCliente = clienteService.ingresarCliente(cliente);
                cliente.setId(idRecibidoPorIngresarAlCliente);

            }
            errorNombre="insertoPersona";

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


            vehiculo.setAnhoFabricacion((vehiculeNode.get("anhoFabricacion")).asInt());
            vehiculo.setNumeroAsientos(vehiculeNode.get("numeroAsientos").asInt());
            vehiculo.setPlaca(vehiculeNode.get("placa").asText());
            vehiculo.setSerie(vehiculeNode.get("serie").asText());
            vehiculo.setActivo(true);
            if (vehiculo.getId()!=null){ // me pasaron un ID -> vehiculo existe
                //no hago nada
            }else {// tengo que insertarlo para la persona que me estan dando
                int idRecibidoPorIngresarVehiculo;
                vehiculo.setFidPersona(new Persona());
                vehiculo.getFidPersona().setId(cliente.getId());// registrar el id con la persona que me están nadando
                idRecibidoPorIngresarVehiculo = vehiculoService.insertarVehiculo(vehiculo);
                vehiculo.setId(idRecibidoPorIngresarVehiculo);
            }
            errorNombre="insertoVehiculo";

            //METODO DE PAGO
            MetodoDePago metodoDePago = new MetodoDePago();
            JsonNode MetodoPagoNode = root.get("MetodoPago");
            metodoDePago.setNombreMetodo(MetodoPagoNode.get("nombreMetodo").asText());
            metodoDePago.setNombreTitular(MetodoPagoNode.get("nombreTitular").asText());
            metodoDePago.setCorreo(MetodoPagoNode.get("correo").asText());
            metodoDePago.setNumeroTarjeta(MetodoPagoNode.get("numeroTarjeta").asText());
            metodoDePago.setCvv(MetodoPagoNode.get("cvv").asText());
            metodoDePago.setFechaVencimiento(LocalDate.parse(MetodoPagoNode.get("fechaVencimiento").asText()));
            metodoDePago.setActivo(true);
            int idRecibidoPorIngresarElMetodoDePago;
            idRecibidoPorIngresarElMetodoDePago = metodoDePagoService.insertarMetodoDePago(metodoDePago);
            metodoDePago.setId(idRecibidoPorIngresarElMetodoDePago);

            errorNombre="insertoMetodoPAgo";
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
                //METODO A MANO
                poliza.setFidMetodo(metodoDePago);
                //CLIENTE A MANO
                poliza.setFidCliente(cliente);
                //VEHICULO A MANO
                poliza.setFidVehiculo(vehiculo);

            int idRecibidoPorIngresarLaPoliza;
            idRecibidoPorIngresarLaPoliza = polizaService.insertarPoliza(poliza);
            poliza.setId(idRecibidoPorIngresarLaPoliza);
            poliza.setActivo(true);


            errorNombre="insertoPoliza";
            //SOAT
            SOAT soat = new SOAT();
            JsonNode SoatNode = root.get("soat");
                //PLAN SOAT
                JsonNode fidPlanSoatNode = SoatNode.get("fidPlanSoat");
                soat.setFidPlanSoat(new PlanSOAT());
                soat.getFidPlanSoat().setId(fidPlanSoatNode.get("id").asInt());
            soat.setFechaDeEmision(LocalDate.parse(SoatNode.get("fechaDeEmision").asText()));
            soat.setMontoPrima(SoatNode.get("montoPrima").asDouble());
                //POLIZA INGRESADA
                soat.setFidPoliza(poliza);

            int idRecibidoPorIngresarElSOAT;
            idRecibidoPorIngresarElSOAT = soatService.insertarSOAT(soat);
            //System.out.println("Se insertor  "+idRecibidoPorIngresarElSOAT);
            errorNombre="insertoSOAT";

            return ResponseEntity.ok("InsertoCorrectamente Todo");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al procesar el JSON"+ errorNombre );
        }
    }


}
