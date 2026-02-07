package io.joao.fonseca.todo.repository;

import io.joao.fonseca.todo.domain.todo.Panel;
import io.joao.fonseca.todo.domain.todo.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {


    List<Todo> findByPanelAndDueDate(Panel panel, LocalDate dueDate);

    List<Todo> findByPanelAndDueDateBetween(Panel panel, LocalDate before, LocalDate after);
}
