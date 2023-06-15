package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.repository.ExtrasRepository.ListaNegraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

@Component
public class ListaNegraService {
    private final ListaNegraRepository listaNegraRepository;

    @Autowired
    public ListaNegraService(ListaNegraRepository listaNegraRepository) {
        this.listaNegraRepository = listaNegraRepository;
    }

    public  String cargaMasivaDeListaNegra(MultipartFile file){
        if(file.isEmpty()){
            return "El archivo está vacio";
        }
        try(BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            String line;
            List<ListaNegra> ListalistaNegra = new ArrayList<>();
            br.readLine();
            while((line=br.readLine())!=null){
                String[] data = line.split(getSeparator(line));
                ListaNegra listanegra = new ListaNegra();

                if(data.length >=4){
                    listanegra.setTipoDocumento(data[0]);
                    listanegra.setNumeroDocumento(data[1]);
                    listanegra.setNombreApellidos(data[2]);
                    listanegra.setMotivo(data[3]);
                }else if(data.length == 3){
                    listanegra.setTipoDocumento(data[0]);
                    listanegra.setNumeroDocumento(data[1]);
                    listanegra.setMotivo(data[2]);
                    //campo no llenado es el nombre;
                    listanegra.setNombreApellidos("");

                }else if (data.length ==2){
                    listanegra.setNombreApellidos(data[0]);
                    listanegra.setMotivo(data[1]);
                    //campos no llenados es el tipoDoc/numDoc
                    listanegra.setTipoDocumento("");
                    listanegra.setNumeroDocumento("");
                }

                ListalistaNegra.add(listanegra);
            }


            listaNegraRepository.saveAllAndFlush(ListalistaNegra);
            return "Archivo CSV cargado exitosamente";
        } catch (IOException e) {
            return "Error al cargar el archivo csv: "+ e.getMessage();
        }
    }
    private String getSeparator(String line) {
        String[] separators = {",", ";", "\t"}; // Posibles separadores: coma, punto y coma, tabulación
        for (String separator : separators) {
            if (line.contains(separator)) {
                return separator;
            }
        }
        // Si no se encuentra un separador conocido, se puede lanzar una excepción o utilizar un separador predeterminado
        return ",";
    }
}
