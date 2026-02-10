package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.habit.HabitDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class HabitRegistrationService {

    private final PanelService panelService;
    private final HabitService habitService;

    public HabitRegistrationService(final PanelService panelService, final HabitService habitService) {
        this.panelService = panelService;
        this.habitService = habitService;
    }

    public HabitDto create(final HabitDto habitDto, final Long userId) {
        final var panel = panelService.findByIdAndUserId(habitDto.panelId(), userId)
                .orElseThrow(EntityNotFoundException::new);

        return habitService.createInPanel(habitDto, panel);
    }

}
