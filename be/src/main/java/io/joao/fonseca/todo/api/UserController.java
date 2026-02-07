package io.joao.fonseca.todo.api;

import io.joao.fonseca.todo.api.dto.user.LoginAttemptDto;
import io.joao.fonseca.todo.api.dto.user.LoginResponseDto;
import io.joao.fonseca.todo.api.dto.user.RegisterRequestDto;
import io.joao.fonseca.todo.service.UserRegistrationService;
import io.joao.fonseca.todo.service.auth.JWTAuthenticationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRegistrationService userRegistrationService;
    private final JWTAuthenticationService jwtAuthenticationService;

    public UserController(final UserRegistrationService userRegistrationService, final JWTAuthenticationService jwtAuthenticationService) {
        this.userRegistrationService = userRegistrationService;
        this.jwtAuthenticationService = jwtAuthenticationService;
    }

    @PostMapping("/login")
    public CompletableFuture<LoginResponseDto> login(@RequestBody final LoginAttemptDto userLogin) {
        return CompletableFuture.supplyAsync(() -> jwtAuthenticationService.login(userLogin));
    }

    @PostMapping("/register")
    public CompletableFuture<Void> register(final @RequestBody RegisterRequestDto registration) {
        return CompletableFuture.runAsync(() -> userRegistrationService.create(registration));
    }
}
