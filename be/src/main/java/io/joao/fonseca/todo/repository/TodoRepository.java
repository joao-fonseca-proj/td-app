package io.joao.fonseca.todo.repository;

import io.joao.fonseca.todo.domain.todo.Panel;
import io.joao.fonseca.todo.domain.todo.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT MAX(t.dueDate) FROM Todo t WHERE t.habit.id = :habitId")
    Optional<LocalDate> findMaxDueDateByHabitId(@Param("habitId") Long habitId);

    List<Todo> findByPanelAndDueDate(Panel panel, LocalDate dueDate);

    List<Todo> findByPanelAndDueDateBetween(Panel panel, LocalDate before, LocalDate after);
}
