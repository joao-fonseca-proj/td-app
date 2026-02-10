package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.habit.HabitDto;
import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import io.joao.fonseca.todo.domain.habit.Habit;
import io.joao.fonseca.todo.domain.todo.Panel;
import io.joao.fonseca.todo.mapper.HabitMapper;
import io.joao.fonseca.todo.repository.HabitRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class HabitService {

    private final HabitRepository repository;
    private final HabitMapper habitMapper;

    public HabitService(final HabitRepository repository) {
        this.repository = repository;
        this.habitMapper = HabitMapper.INSTANCE;
    }

    public HabitDto createInPanel(final HabitDto habitDto, final Panel panel) {
        final var habit = habitMapper.fromDto(habitDto);

        final var updatedHabit = Habit.newBuilder(habit)
                .panel(panel)
                .build();
        final var savedHabit = repository.save(updatedHabit);

        return habitMapper.toDto(savedHabit);
    }

    public Optional<Habit> findByIdAndPanelId(final Long id, final Long panelId) {
        return repository.findByIdAndPanelId(id, panelId);
    }

    public Optional<Habit> findByIdAndUserId(final Long id, final Long userId) {
        return repository.findByIdAndPanelUserId(id, userId);
    }

    public Stream<Habit> findAllStream() {
        return repository.streamAllBy();
    }
}
