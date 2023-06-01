package com.pucp.unionseguros.model.Extras;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lista_negra")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListaNegra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lista_negra", nullable = false)
    private Integer idListaNegra;


    @Column(name = "tipo_documento", length = 10)
    private String tipoDocumento;

    @Column(name = "numero_documento", length = 10)
    private String numeroDocumento;

    @Column(name = "nombre_apellido",  length = 100)
    private String nombreApellidos;

    @Column(name = "motivo", length = 70)
    private String motivo;
}
