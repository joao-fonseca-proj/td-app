package io.joao.fonseca.todo.api;

import io.joao.fonseca.todo.api.dto.todo.TodoDashboardDto;
import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import io.joao.fonseca.todo.api.dto.todo.TodoFetchListDto;
import io.joao.fonseca.todo.api.dto.todo.TodoTitleDto;
import io.joao.fonseca.todo.service.TodoFetchingService;
import io.joao.fonseca.todo.service.TodoRegistrationService;
import io.joao.fonseca.todo.service.TodoService;
import io.joao.fonseca.todo.service.auth.AuthenticationHolder;
import io.joao.fonseca.todo.service.auth.SecurityContextAwareRunnable;
import io.joao.fonseca.todo.service.auth.SecurityContextAwareSupplier;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/todo")
public class TodoController {

    private final TodoRegistrationService todoRegistrationService;
    private final TodoFetchingService todoFetchingService;
    private final TodoService todoService;

    public TodoController(final TodoRegistrationService todoRegistrationService, final TodoFetchingService todoFetchingService, final TodoService todoService) {
        this.todoRegistrationService = todoRegistrationService;
        this.todoFetchingService = todoFetchingService;
        this.todoService = todoService;
    }

    @PostMapping
    public CompletableFuture<TodoDto> postTodo(@RequestBody final TodoDto todoDto) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> todoRegistrationService.create(todoDto, AuthenticationHolder.getLoggedUser().getId()))
        );
    }

    @PatchMapping("/title/{id}")
    public CompletableFuture<TodoDto> patchTodoTitle(@PathVariable final Long id,
                                                     @RequestBody final TodoTitleDto title) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> todoService.updateTitle(id, AuthenticationHolder.getLoggedUser().getId(), title.title()))
        );
    }

    @PatchMapping("/dueDate/{id}")
    public CompletableFuture<TodoDto> patchTodoDueDate(@PathVariable final Long id,
                                                       @RequestParam(value = "position") final int position,
                                                       @RequestParam(value = "dueDate") final LocalDate dueDate) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> todoService.moveDueDate(id, AuthenticationHolder.getLoggedUser().getId(), position, dueDate))
        );
    }

    @PatchMapping("/toggle/{id}")
    public CompletableFuture<TodoDto> patchTodoCompletion(@PathVariable Long id,
                                                          @RequestParam(value = "value") boolean value) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> todoService.toggleCompletion(id, AuthenticationHolder.getLoggedUser().getId(),
                        value))
        );
    }

    @PatchMapping("/move/{id}")
    public CompletableFuture<TodoDto> patchTodoPosition(@PathVariable Long id,
                                                        @RequestParam(value = "position") int position) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> todoService.movePosition(id, AuthenticationHolder.getLoggedUser().getId(),
                        position))
        );
    }

    @GetMapping("/panel")
    public CompletableFuture<TodoDashboardDto> getTodos(@RequestParam(value = "beforeLimit") int beforeLimit,
                                                        @RequestParam(value = "afterLimit") int afterLimit) {
        return CompletableFuture.supplyAsync(
                SecurityContextAwareSupplier.wrap(() -> todoFetchingService.get(AuthenticationHolder.getLoggedUser().getId(),
                        beforeLimit, afterLimit))
        );
    }

    @DeleteMapping("/delete/{id}")
    public CompletableFuture<Void> deleteTodoById(@PathVariable Long id) {
        return CompletableFuture.runAsync(
                SecurityContextAwareRunnable.wrap(() -> todoService.deleteById(id, AuthenticationHolder.getLoggedUser().getId()))
        );
    }
}
