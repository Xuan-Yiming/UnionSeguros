package com.pucp.unionseguros.model.Extras;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "soat_vigente")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SoatVigente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_soat_vigente", nullable = false)
    private Integer idSoatVigente;

    @Column(name = "codigo", nullable = false)
    private String codigo;

    @Column(name = "placa", nullable = false)
    private String placa;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "nombre_aseguradora", nullable = false)
    private String nombreAseguradora;
}
