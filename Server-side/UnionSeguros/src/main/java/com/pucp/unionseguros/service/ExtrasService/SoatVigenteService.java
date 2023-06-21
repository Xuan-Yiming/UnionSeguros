package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.SoatVigente;
import com.pucp.unionseguros.repository.ExtrasRepository.SoatVigenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.DateFormatter;
import java.io.IOException;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.StringTokenizer;

@Component
public class SoatVigenteService {

    private final SoatVigenteRepository soatVigenteRepository;

    @Autowired
    public SoatVigenteService(SoatVigenteRepository soatVigenteRepository) {
        this.soatVigenteRepository = soatVigenteRepository;
    }

    public String cargaMasivaDeSoatsVigentes(MultipartFile file){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d/M/yyyy");
        try{
            Scanner scanner = new Scanner(file.getInputStream());
            if(scanner.hasNextLine()){
                scanner.nextLine();
            }
            List<SoatVigente> lista = new ArrayList<>();
            while(scanner.hasNextLine()){
                SoatVigente soatVigente = new SoatVigente();
                String linea = scanner.nextLine();
                StringTokenizer tokenizer = new StringTokenizer(linea,";");
                soatVigente.setCodigo(tokenizer.nextToken());
                soatVigente.setPlaca(tokenizer.nextToken().replace("-",""));
                soatVigente.setFechaInicio(LocalDate.parse(tokenizer.nextToken(),formatter));
                soatVigente.setFechaFin(LocalDate.parse(tokenizer.nextToken(),formatter));
                soatVigente.setNombreAseguradora(tokenizer.nextToken());
                lista.add(soatVigente);
            }
            scanner.close();
            soatVigenteRepository.saveAllAndFlush(lista);
            return  "se proceso bien la carga masiva";
        }catch (Exception e){
            return "Error al procesar el archivo."+ e.getMessage();
        }
    }


}
