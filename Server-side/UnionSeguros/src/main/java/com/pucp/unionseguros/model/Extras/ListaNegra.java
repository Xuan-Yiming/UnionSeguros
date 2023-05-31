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


    @Column(name = "tipo_documento", nullable = false)
    private String tipoDocumento;

    @Column(name = "numero_documento", nullable = false)
    private String numeroDocumento;

    @Column(name = "nombre_apellido", nullable = false)
    private String nombreApellidos;

    @Column(name = "motivo", nullable = false)
    private String motivo;
}
