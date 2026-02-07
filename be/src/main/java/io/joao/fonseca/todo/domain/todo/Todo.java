package io.joao.fonseca.todo.domain.todo;

import io.joao.fonseca.todo.domain.common.AuditableIdentifiableEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
public class Todo extends AuditableIdentifiableEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    private Panel panel;
    private String title;
    private LocalDate dueDate;
    private boolean completed;
    @Enumerated(EnumType.STRING)
    private Urgency urgency;
    @Enumerated(EnumType.STRING)
    private Category category;
    private int position;

    public Todo() {
    }

    public static Builder newBuilder() {
        return new Builder();
    }

    private Todo(final Builder builder) {
        id = builder.id;
        createdAt = builder.createdAt;
        updatedAt = builder.updatedAt;
        panel = builder.panel;
        title = builder.title;
        dueDate = builder.dueDate;
        completed = builder.completed;
        urgency = builder.urgency;
        category = builder.category;
        position = builder.position;
    }

    public static Builder newBuilder(final Todo copy) {
        Builder builder = new Builder();
        builder.id = copy.getId();
        builder.createdAt = copy.getCreatedAt();
        builder.updatedAt = copy.getUpdatedAt();
        builder.panel = copy.getPanel();
        builder.title = copy.getTitle();
        builder.dueDate = copy.getDueDate();
        builder.completed = copy.isCompleted();
        builder.urgency = copy.getUrgency();
        builder.category = copy.getCategory();
        builder.position = copy.getPosition();
        return builder;
    }

    public boolean belongsToUser(final Long userId) {
        return panel.getUser().getId().equals(userId);
    }

    public boolean isCompleted() {
        return completed;
    }

    public Panel getPanel() {
        return panel;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Urgency getUrgency() {
        return urgency;
    }

    public Category getCategory() {
        return category;
    }

    public int getPosition() {
        return position;
    }

    public static final class Builder {
        private Long id;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;
        private Panel panel;
        private String title;
        private LocalDate dueDate;
        private boolean completed;
        private Urgency urgency;
        private Category category;
        private int position;

        private Builder() {
        }

        public Builder id(final Long val) {
            id = val;
            return this;
        }

        public Builder createdAt(final OffsetDateTime val) {
            createdAt = val;
            return this;
        }

        public Builder updatedAt(final OffsetDateTime val) {
            updatedAt = val;
            return this;
        }

        public Builder panel(final Panel val) {
            panel = val;
            return this;
        }

        public Builder title(final String val) {
            title = val;
            return this;
        }

        public Builder dueDate(final LocalDate val) {
            dueDate = val;
            return this;
        }

        public Builder completed(final boolean val) {
            completed = val;
            return this;
        }

        public Builder urgency(final Urgency val) {
            urgency = val;
            return this;
        }

        public Builder category(final Category val) {
            category = val;
            return this;
        }

        public Builder position(final int val) {
            position = val;
            return this;
        }

        public Todo build() {
            return new Todo(this);
        }
    }
}
