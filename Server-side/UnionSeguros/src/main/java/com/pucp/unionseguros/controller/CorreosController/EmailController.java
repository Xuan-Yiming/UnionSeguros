package com.pucp.unionseguros.controller.CorreosController;

import java.util.List;
import java.util.Random;

import com.pucp.unionseguros.model.Personas.Usuario;
import com.pucp.unionseguros.repository.PersonasRepository.UsuarioRepository;
import com.pucp.unionseguros.service.CorreosService.EmailService;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/email")
@CrossOrigin
public class EmailController {

    @Autowired
    private EmailService emailService;
    private final UsuarioRepository usuarioRepository;

    public EmailController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    //Envia un email dado 3 cadenas, mensaje, email destino y asunto
    @RequestMapping(value = "/", method = RequestMethod.POST)
    boolean sendEmail(@RequestBody List<String> correo)throws AuthenticationException{
        boolean success = false;

        try{
            success = emailService.sendEmailTool(correo.get(0),correo.get(1),correo.get(2));
        }
        catch(Exception ex){ System.out.print(ex.getMessage()); }

        return success;
    }


    @RequestMapping(value = "/generarToken",method = RequestMethod.POST)
    String generarTokenParaCliente(@RequestBody List<String> correo) throws  AuthenticationException{
        Random random = new Random();
        boolean success = false;
        Usuario foundUsuario = null;
        StringBuilder sb = new StringBuilder(6);
        //PARA CREAR EL TOKEN
        for (int i =0;i< 6;i++){
            int digit = random.nextInt(10);
            sb.append(digit);
        }
        try{

            success = emailService.sendEmailTool("El token para validar su correo es: "+ sb.toString() +"\nAtentamente Union Seguros.",
                                                correo.get(0),
                                                "Token de validación de cuenta - UnionSeguros");
            if(success){
                foundUsuario = usuarioRepository.findUsuarioByEmail(correo.get(0));
                //tendría toda la información del usuario y ahora solo tengo que setear el token
                //y actualizarlo
                foundUsuario.setToken(sb.toString());
                usuarioRepository.save(foundUsuario);
            }

        }catch (Exception ex){
            return "NO SE PUDO ENVIAR EL TOKEN VERIFICAR INFORMACION";
        }
        return "SE ENVIO EL TOKEN";
    }

    @GetMapping("/verificarToken")
    boolean verificarToken(@RequestBody List<String> informacion){
        boolean success = false;
        Integer id;
        id = usuarioRepository.verificarInformacionDeTokquen(informacion.get(0),informacion.get(1));
        if(id!=null){
            success = true;
        }
        return success;
    }



}