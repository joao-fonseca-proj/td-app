package io.joao.fonseca.todo.service.auth;

import io.joao.fonseca.todo.api.dto.user.LoginAttemptDto;
import io.joao.fonseca.todo.api.dto.user.LoginResponseDto;
import io.joao.fonseca.todo.domain.user.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class JWTAuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Autowired
    public JWTAuthenticationService(final AuthenticationManager authenticationManager, final UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public LoginResponseDto login(final LoginAttemptDto loginAttempt) {
        final var username = loginAttempt.username();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginAttempt.username(), loginAttempt.password())
        );

        final var userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);

        final var bearer = JWTUtils.generateToken(userDetails);
        return new LoginResponseDto(userDetails.getUsername(), bearer);
    }
}
