package com.pucp.unionseguros.model.Extras;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "email_x_token")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmailXToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_token", nullable = false)
    private Integer id;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "token", length = 10)
    private String token;

    @Column(name = "activo")
    private boolean activo;

}
