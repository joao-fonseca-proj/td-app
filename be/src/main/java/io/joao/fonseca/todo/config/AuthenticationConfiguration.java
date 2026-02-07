package io.joao.fonseca.todo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AuthenticationConfiguration {

    public static BCryptPasswordEncoder getBaseEncoder() {
        return new BCryptPasswordEncoder();
    }
}
