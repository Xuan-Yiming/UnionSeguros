package com.pucp.unionseguros.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class DatabaseConfig {
    private final Environment environment;

    @Autowired
    public DatabaseConfig(Environment environment) {
        this.environment = environment;
    }

    // ...

    @Bean
    public DataSource dataSource() {
        String dbUrl = environment.getProperty("db.url");
        String dbUsername = environment.getProperty("db.username");
        String dbPassword = environment.getProperty("db.password");

        return DataSourceBuilder
                .create()
                .url(dbUrl)
                .username(dbUsername)
                .password(dbPassword)
                // ... otras configuraciones del DataSource
                .build();
    }
}
