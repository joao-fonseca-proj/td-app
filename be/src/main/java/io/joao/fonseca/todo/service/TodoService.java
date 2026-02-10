package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.panel.PanelDto;
import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import io.joao.fonseca.todo.api.dto.todo.TodoFetchListDto;
import io.joao.fonseca.todo.domain.common.Range;
import io.joao.fonseca.todo.domain.habit.Habit;
import io.joao.fonseca.todo.domain.todo.Panel;
import io.joao.fonseca.todo.domain.todo.Todo;
import io.joao.fonseca.todo.mapper.TodoMapper;
import io.joao.fonseca.todo.repository.TodoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
public class TodoService {

    private final TodoMapper todoMapper;
    private final TodoRepository repository;

    public TodoService(final TodoRepository repository) {
        this.todoMapper = TodoMapper.INSTANCE;
        this.repository = repository;
    }

    // DTO
    public TodoDto toggleCompletion(final Long todoId, final Long userId, final boolean value) {
        final var todo = getTodoByUserOrThrow(todoId, userId);

        final var updatedTodo = Todo.newBuilder(todo)
                .completed(value)
                .build();
        final var savedTodo = repository.save(updatedTodo);

        return todoMapper.toDto(savedTodo);
    }

    @Transactional
    public TodoDto movePosition(final Long todoId, final Long userId, final int position) {
        final var todo = getTodoByUserOrThrow(todoId, userId);

        final var todosInDate = repository.findByPanelAndDueDate(todo.getPanel(), todo.getDueDate());

        final var otherTodos = todosInDate.stream()
                .filter(t -> !t.getId().equals(todoId))
                .sorted(Comparator.comparing(Todo::getPosition))
                .toList();
        final int targetPosition = Math.max(0, Math.min(position, otherTodos.size()));

        // Rebuild list with task at new position
        final var todosBeforeTarget = otherTodos.stream()
                .limit(targetPosition)
                .toList();
        final var todosAfterTarget = otherTodos.stream()
                .skip(targetPosition)
                .toList();

        final var reorderedTodos = Stream.of(
                        todosBeforeTarget.stream(),
                        Stream.of(todo),
                        todosAfterTarget.stream()
                )
                .flatMap(Function.identity())
                .toList();
        final var todosWithNewPositions = IntStream.range(0, reorderedTodos.size())
                .mapToObj(i -> Todo.newBuilder(reorderedTodos.get(i))
                        .position(i)
                        .build())
                .toList();
        final var savedTodos = repository.saveAll(todosWithNewPositions);

        return todoMapper.toDto(savedTodos.get(targetPosition));
    }

    @Transactional
    public TodoDto moveDueDate(final Long todoId, final Long userId, final int position, final LocalDate dueDate) {
        final var todo = getTodoByUserOrThrow(todoId, userId);
        deleteById(todoId, userId);

        final var newTodo = Todo.newBuilder(todo)
                .id(null)
                .dueDate(dueDate)
                .build();
        final var savedNewTodo = createInPanelLastPosition(newTodo.getPanel(), newTodo);
        return movePosition(savedNewTodo.getId(), userId, position);
    }

    public TodoDto updateTitle(final Long todoId, final Long userId, final String title) {
        final var todo = getTodoByUserOrThrow(todoId, userId);

        final var newTodo = Todo.newBuilder(todo)
                .title(title)
                .build();
        final var savedTodo = repository.save(newTodo);

        return todoMapper.toDto(savedTodo);
    }

    public TodoDto updateHabit(final Long todoId, final Long userId, final Habit habit) {
        final var todo = getTodoByUserOrThrow(todoId, userId);

        final var updatedTodo = Todo.newBuilder(todo)
                .habit(habit)
                .build();
        final var savedTodo = repository.save(updatedTodo);

        return todoMapper.toDto(savedTodo);
    }

    public Optional<LocalDate> findMaxDueDateByHabitId(final Long habitId) {
        return repository.findMaxDueDateByHabitId(habitId);
    }

    public TodoFetchListDto findByPanelInRange(final Panel panel, final Range range) {
        final var todos = repository.findByPanelAndDueDateBetween(panel, range.min(), range.max());
        final var todoList = todos.stream()
                .map(todoMapper::toDto)
                .toList();

        // TODO ADD TO MAPPER
        return new TodoFetchListDto(
                new PanelDto(panel.getId(), panel.getName()),
                todoList
        );
    }

    // can probably overload this with createInPanel
    public TodoDto createInPanelWithHabit(final TodoDto todoDto, final Panel panel, final Habit habit) {
        final var todo = todoMapper.fromDto(todoDto);
        final var todoWithHabit = Todo.newBuilder(todo)
                .title(habit.getName())
                .category(habit.getCategory())
                .habit(habit)
                .build();

        final var savedTodo = createInPanelLastPosition(panel, todoWithHabit);

        return todoMapper.toDto(savedTodo);
    }

    public TodoDto createInPanel(final TodoDto todoDto, final Panel panel) {
        final var todo = todoMapper.fromDto(todoDto);

        final var savedTodo = createInPanelLastPosition(panel, todo);

        return todoMapper.toDto(savedTodo);
    }

    public void deleteById(final Long todoId, final Long userId) {
        final var todo = getTodoByUserOrThrow(todoId, userId);

        final var todosInDate = repository.findByPanelAndDueDate(todo.getPanel(), todo.getDueDate());
        movePosition(todoId, userId, todosInDate.size() - 1);

        repository.deleteById(todoId);
    }

    private Todo createInPanelLastPosition(final Panel panel, final Todo todo) {
        final var existingTodos = repository.findByPanelAndDueDate(panel, todo.getDueDate());
        final var nextPosition = existingTodos.stream()
                .mapToInt(Todo::getPosition)
                .max()
                .orElse(0);
        final var todoInPanel = Todo.newBuilder(todo)
                .panel(panel)
                .position(nextPosition + 1)
                .build();
        return repository.save(todoInPanel);
    }

    private Todo getTodoByUserOrThrow(final Long todoId, final Long userId) {
        final var todo = repository.findById(todoId)
                .orElseThrow(EntityNotFoundException::new);
        if (!todo.belongsToUser(userId)) {
            throw new IllegalArgumentException("Cannot delete todo from different user");
        }
        return todo;
    }
}
