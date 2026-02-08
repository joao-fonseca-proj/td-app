package io.joao.fonseca.todo.repository;

import io.joao.fonseca.todo.domain.todo.Panel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanelRepository extends JpaRepository<Panel, Long> {

    List<Panel> findByUserId(Long userId);
}
