package io.joao.fonseca.todo.service.scheduled;

import io.joao.fonseca.todo.service.HabitService;
import io.joao.fonseca.todo.service.HabitTodoSpawnerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static io.joao.fonseca.todo.util.Constant.HABIT_TODO_BUFFER;

@Service
public class HabitRegistrationScheduler {

    private static final Logger LOGGER = LoggerFactory.getLogger(HabitRegistrationScheduler.class);

    private final HabitTodoSpawnerService habitTodoSpawnerService;
    private final HabitService habitService;

    public HabitRegistrationScheduler(final HabitTodoSpawnerService habitTodoSpawnerService,
                                      final HabitService habitService) {
        this.habitTodoSpawnerService = habitTodoSpawnerService;
        this.habitService = habitService;
    }

    @Scheduled(cron = "*/60 * * * * *")
    @Transactional // ADD TRANSACTION TEMPLATE TO ISOLATE CREATIONS
    public void spawnTodos() {
        habitService.findAllStream()
                .forEach(habit -> {
                    LOGGER.info("Spawning TODOs for habit: {}", habit.getId());

                    habitTodoSpawnerService.spawnTodos(habit, HABIT_TODO_BUFFER);
                });
    }
}
