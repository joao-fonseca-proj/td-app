package io.joao.fonseca.todo.api;

import io.joao.fonseca.todo.api.dto.habit.HabitDto;
import io.joao.fonseca.todo.service.HabitRegistrationService;
import io.joao.fonseca.todo.service.HabitService;
import io.joao.fonseca.todo.service.auth.AuthenticationHolder;
import io.joao.fonseca.todo.service.auth.SecurityContextAwareRunnable;
import io.joao.fonseca.todo.service.auth.SecurityContextAwareSupplier;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/habit")
public class HabitController {

    private final HabitRegistrationService habitRegistrationService;
    private final HabitService habitService;

    public HabitController(final HabitRegistrationService habitRegistrationService, final HabitService habitService) {
        this.habitRegistrationService = habitRegistrationService;
        this.habitService = habitService;
    }

    @PostMapping
    public CompletableFuture<HabitDto> postTodo(@RequestBody final HabitDto habitDto) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> habitRegistrationService.create(habitDto, AuthenticationHolder.getLoggedUser().getId()))
        );
    }

    @GetMapping("/{id}")
    public CompletableFuture<HabitDto> getHabit(@PathVariable final Long id) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> habitService.findById(id, AuthenticationHolder.getLoggedUser().getId()))
        );
    }

    @GetMapping("/user")
    public CompletableFuture<List<HabitDto>> getHabitsByUserId() {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> habitService.findByUserId(AuthenticationHolder.getLoggedUser().getId()))
        );
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<Void> deleteHabitById(@PathVariable final Long id,
                                @RequestParam("deleteTasks") final boolean deleteTasks) {
        return CompletableFuture.runAsync(
                SecurityContextAwareRunnable.wrap(() -> habitRegistrationService.deleteHabitById(id, AuthenticationHolder.getLoggedUser().getId(), deleteTasks))
        );
    }
}
