package io.joao.fonseca.todo.service.auth;

import io.joao.fonseca.todo.domain.user.CustomUserDetails;
import io.joao.fonseca.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    @Autowired
    public CustomUserDetailsService(final UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        return repository.findByUsername(username)
                .map(CustomUserDetails::ofUser)
                .orElseThrow(() -> new IllegalArgumentException("No account found for username %s".formatted(username)));
    }

}
