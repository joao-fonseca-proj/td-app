package io.joao.fonseca.todo.service.scheduled;

import io.joao.fonseca.todo.service.HabitService;
import io.joao.fonseca.todo.service.HabitTodoSpawnerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static io.joao.fonseca.todo.util.Constant.HABIT_TODO_BUFFER;

@Service
public class HabitRegistrationScheduler {

    private final HabitTodoSpawnerService habitTodoSpawnerService;
    private final HabitService habitService;

    public HabitRegistrationScheduler(final HabitTodoSpawnerService habitTodoSpawnerService,
                                      final HabitService habitService) {
        this.habitTodoSpawnerService = habitTodoSpawnerService;
        this.habitService = habitService;
    }

    @Scheduled(cron = "*/30 * * * * *")
    @Transactional(readOnly = true)
    public void spawnTodos() {
        habitService.findAllStream()
                .forEach(habit -> habitTodoSpawnerService.spawnTodos(habit, HABIT_TODO_BUFFER));
    }
}
