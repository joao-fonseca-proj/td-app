package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class TodoRegistrationService {

    private final PanelService panelService;
    private final TodoService todoService;

    public TodoRegistrationService(final PanelService panelService, final TodoService todoService) {
        this.panelService = panelService;
        this.todoService = todoService;
    }

    public TodoDto create(final TodoDto todoDto, final Long userId) {
        final var panel = panelService.findByIdAndUserId(todoDto.panelId(), userId)
                .orElseThrow(EntityNotFoundException::new);

        return todoService.createInPanel(todoDto, panel);
    }
}
