package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.user.RegisterRequestDto;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserRegistrationService {

    private final UserService userService;
    private final PanelService panelService;

    public UserRegistrationService(final UserService userService, final PanelService panelService) {
        this.userService = userService;
        this.panelService = panelService;
    }

    @Transactional
    public void create(final RegisterRequestDto registerRequestDto) {
        final var registeredUser = userService.register(registerRequestDto);

        panelService.bootstrapUser(registeredUser);
    }
}
