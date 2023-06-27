package com.pucp.unionseguros.model.Extras;
import com.pucp.unionseguros.model.Personas.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Auditoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria", nullable = false)
    private Integer id;

    @Column(name = "tiempo")
    private LocalDateTime tiempo;

    @Column(name = "accion", length = 1000)
    private String accion;

    @ManyToOne
    @JoinColumn(name = "fid_usuario")
    private Usuario fidUsuario;
}
