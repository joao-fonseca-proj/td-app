package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import io.joao.fonseca.todo.domain.common.Range;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoFetchingService {

    private final PanelService panelService;
    private final TodoService todoService;

    public TodoFetchingService(final PanelService panelService, final TodoService todoService) {
        this.panelService = panelService;
        this.todoService = todoService;
    }

    public List<TodoDto> get(final Long panelId, final Long userId, final int beforeLimit, final int afterLimit) {
        final var panel = panelService.findByIdAndUserId(panelId, userId)
                .orElseThrow();
        final var range = Range.of(beforeLimit, afterLimit);

        return todoService.findByPanelInRange(panel, range);
    }
}
