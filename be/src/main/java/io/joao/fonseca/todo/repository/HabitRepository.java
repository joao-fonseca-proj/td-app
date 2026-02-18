package io.joao.fonseca.todo.repository;

import io.joao.fonseca.todo.domain.habit.Habit;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {

    Optional<Habit> findByIdAndPanelId(Long id, Long panelId);

    Optional<Habit> findByIdAndPanelUserId(Long id, Long userId);

    List<Habit> findByPanelUserId(Long userId);

    @QueryHints(value = @QueryHint(name = "org.hibernate.fetchSize", value = "200"))
    Stream<Habit> streamAllBy();
}
