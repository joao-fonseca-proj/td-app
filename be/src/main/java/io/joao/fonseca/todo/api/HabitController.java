package io.joao.fonseca.todo.api;

import io.joao.fonseca.todo.api.dto.habit.HabitDto;
import io.joao.fonseca.todo.service.HabitRegistrationService;
import io.joao.fonseca.todo.service.auth.AuthenticationHolder;
import io.joao.fonseca.todo.service.auth.SecurityContextAwareSupplier;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.concurrent.CompletableFuture;

@Service
public class HabitController {

    private final HabitRegistrationService habitRegistrationService;

    public HabitController(final HabitRegistrationService habitRegistrationService) {
        this.habitRegistrationService = habitRegistrationService;
    }

    @PostMapping
    public CompletableFuture<HabitDto> postTodo(@RequestBody final HabitDto habitDto) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> habitRegistrationService.create(habitDto, AuthenticationHolder.getLoggedUser().getId()))
        );
    }

}
