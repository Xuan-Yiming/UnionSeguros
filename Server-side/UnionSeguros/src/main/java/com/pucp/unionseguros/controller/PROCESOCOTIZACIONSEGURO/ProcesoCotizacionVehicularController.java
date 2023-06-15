package com.pucp.unionseguros.controller.PROCESOCOTIZACIONSEGURO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pucp.unionseguros.model.Cotizacion.Cotizacion;
import com.pucp.unionseguros.model.Cotizacion.Moneda;
import com.pucp.unionseguros.model.Distritos.Distrito;
import com.pucp.unionseguros.model.Extras.CalculoPrima;
import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.Persona;
import com.pucp.unionseguros.model.Personas.Roles;
import com.pucp.unionseguros.model.Personas.TipoDocumento;
import com.pucp.unionseguros.model.Vehiculo.Modelo;
import com.pucp.unionseguros.model.Vehiculo.TipoUso;
import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.repository.CotizacionRepository.CotizacionRepository;
import com.pucp.unionseguros.repository.PersonasRepository.ClienteRepository;
import com.pucp.unionseguros.repository.VehiculoRepository.VehiculoRepository;
import com.pucp.unionseguros.service.ExtrasService.CalculoPrimaService;
import com.pucp.unionseguros.service.PersonasService.ClienteService;
import com.pucp.unionseguros.service.VehiculoService.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Service
@RestController
@RequestMapping(path = "api/v1/ProcesoSeguroVehicular")
public class ProcesoCotizacionVehicularController {

    private final ClienteService clienteService;
    private final VehiculoService vehiculoService;

    private  final ClienteRepository clienteRepository;

    private final VehiculoRepository vehiculoRepository;
    private final CotizacionRepository cotizacionRepository;

    private final CalculoPrimaService calculoPrimaService;

    @Autowired
    public ProcesoCotizacionVehicularController(ClienteService clienteService, VehiculoService vehiculoService, ClienteRepository clienteRepository, VehiculoRepository vehiculoRepository,
                                                CotizacionRepository cotizacionRepository, CalculoPrimaService calculoPrimaService) {
        this.clienteService = clienteService;
        this.vehiculoService = vehiculoService;
        this.clienteRepository = clienteRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.cotizacionRepository = cotizacionRepository;
        this.calculoPrimaService = calculoPrimaService;
    }

    @PostMapping("/insertarInfoProceso1")
    public ResponseEntity<String> handleJsonRequestProcesoVehicular(@RequestBody String json){
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
            cliente.setEmail(clienteNode.get("email").asText());
            cliente.setApellidoPaterno(clienteNode.get("apellidoPaterno").asText());
            cliente.setApellidoMaterno(clienteNode.get("apellidoMaterno").asText());
            cliente.setNumeroDocumento(clienteNode.get("numeroDocumento").asText());

            JsonNode fidRolesNode = clienteNode.get("fidRoles");
            cliente.setFidRoles(new Roles());
            cliente.getFidRoles().setIdRole(fidRolesNode.get("id").asInt());

            JsonNode fidTipoDocumentoNode = clienteNode.get("fidTipoDocumento");

            cliente.setFidTipoDocumento(new TipoDocumento());
            cliente.getFidTipoDocumento().setId(fidTipoDocumentoNode.get("id").asInt());
            cliente.setFechaNacimiento(LocalDate.parse(clienteNode.get("fechaNacimiento").asText()) );
            cliente.setDireccion(clienteNode.get("direccion").asText());
            cliente.setTelefono(clienteNode.get("telefono").asInt());
            cliente.setFechaCreacion(LocalDate.parse(clienteNode.get("fechaCreacion").asText()));

            if(cliente.getId()!=null){// me pasaron un ID -> existe el cliente
                //no hago nada
            }else{ // no me pasaron ID debo insertarlo
                int idRecibidoPorIngresarAlCliente;
                cliente.setActivo(true);
                cliente.setActivoPersona(true);
                cliente.setActivoUsuario(true);
                clienteRepository.saveAndFlush(cliente);
//                cliente.setId(idRecibidoPorIngresarAlCliente);

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
                vehiculoRepository.saveAndFlush(vehiculo);
            }

            //MONEDA
            JsonNode monedaNode = root.get("fidMoneda");
            Moneda moneda = new Moneda();
            moneda.setId(monedaNode.get("id").asInt());

            //DISTRITO
            JsonNode distritoNode = root.get("fidDistrito");
            Distrito distrito = new Distrito();
            distrito.setId(distritoNode.get("id").asInt());


            //COTIZACION
            Cotizacion cotizacion = new Cotizacion();

            cotizacion.setFechaCotizacion(LocalDate.parse(root.get("fechaCotizacion").asText()));
            cotizacion.setActivo(true);
            cotizacion.setFidCliente(cliente);
            cotizacion.setFidMoneda(moneda);
            cotizacion.setFidVehiculo(vehiculo);
            cotizacion.setFidDistrito(distrito);
            cotizacion.setMontoEstimado(root.get("montoEstimado").asDouble());

            cotizacionRepository.saveAndFlush(cotizacion);


            return ResponseEntity.ok("InsertoCorrectamente Todo");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al procesar el JSON"+ errorNombre );
        }
    }


    @GetMapping("/verificarInformacionVehiculoParaCalculoPrima")
    public double verificarYCalcularPrima(@RequestParam(name = "nombreMarca")String nombreMarca,
                                          @RequestParam(name = "nombreModelo")String nombreModelo,
                                          @RequestParam(name = "anhoFabricacion") Integer anhoFabricacion){

        return  calculoPrimaService.calcularMontoPrimaVerificando(nombreMarca,nombreModelo,anhoFabricacion);
    }
}
