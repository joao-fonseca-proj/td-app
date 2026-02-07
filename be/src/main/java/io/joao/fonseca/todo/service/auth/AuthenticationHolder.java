package io.joao.fonseca.todo.service.auth;

import io.joao.fonseca.todo.domain.user.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;

import static java.util.Objects.isNull;

public class AuthenticationHolder {

    public static CustomUserDetails getLoggedUser() {
        final var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isNull(authentication)) {
            return null;
        }
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
