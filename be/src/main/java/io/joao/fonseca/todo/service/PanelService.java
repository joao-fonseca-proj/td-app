package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.domain.todo.Panel;
import io.joao.fonseca.todo.domain.user.User;
import io.joao.fonseca.todo.repository.PanelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static io.joao.fonseca.todo.util.Constant.PERSONAL_PANEL;
import static io.joao.fonseca.todo.util.Constant.PROFESSIONAL_PANEL;

@Service
public class PanelService {

    private final PanelRepository repository;

    public PanelService(final PanelRepository repository) {
        this.repository = repository;
    }

    public void bootstrapUser(final User user) {
        final var personalPanel = Panel.newBuilder()
                .name(PERSONAL_PANEL)
                .user(user)
                .build();
        final var professionalPanel = Panel.newBuilder()
                .name(PROFESSIONAL_PANEL)
                .user(user)
                .build();

        repository.saveAll(List.of(personalPanel, professionalPanel));
    }

    public Optional<Panel> findByIdAndUserId(final Long id, final Long userId) {
        return repository.findById(id)
                .filter(panel -> userId.equals(panel.getUser().getId()));
    }
}
