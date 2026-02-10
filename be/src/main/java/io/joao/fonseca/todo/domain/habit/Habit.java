package io.joao.fonseca.todo.domain.habit;

import io.joao.fonseca.todo.domain.common.AuditableIdentifiableEntity;
import io.joao.fonseca.todo.domain.todo.Category;
import io.joao.fonseca.todo.domain.todo.Panel;
import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.time.OffsetDateTime;
import java.util.Set;

@Entity
public class Habit extends AuditableIdentifiableEntity {

    private String name;
    @ElementCollection(targetClass = DayOfWeek.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "habit_days", joinColumns = @JoinColumn(name = "habit_id"))
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> daysOfWeek;
    @Enumerated(EnumType.STRING)
    private Frequency frequency;
    @Enumerated(EnumType.STRING)
    private Category category;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panel_id", nullable = false)
    private Panel panel;

    public Habit() {
    }

    public static Builder newBuilder() {
        return new Builder();
    }

    private Habit(final Builder builder) {
        id = builder.id;
        createdAt = builder.createdAt;
        updatedAt = builder.updatedAt;
        name = builder.name;
        daysOfWeek = builder.daysOfWeek;
        frequency = builder.frequency;
        category = builder.category;
        panel = builder.panel;
    }

    public static Builder newBuilder(final Habit copy) {
        Builder builder = new Builder();
        builder.id = copy.getId();
        builder.createdAt = copy.getCreatedAt();
        builder.updatedAt = copy.getUpdatedAt();
        builder.name = copy.getName();
        builder.daysOfWeek = copy.getDaysOfWeek();
        builder.frequency = copy.getFrequency();
        builder.category = copy.getCategory();
        builder.panel = copy.getPanel();
        return builder;
    }

    public Category getCategory() {
        return category;
    }

    public String getName() {
        return name;
    }

    public Set<DayOfWeek> getDaysOfWeek() {
        return daysOfWeek;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public Panel getPanel() {
        return panel;
    }

    public static final class Builder {
        private Long id;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;
        private String name;
        private Set<DayOfWeek> daysOfWeek;
        private Frequency frequency;
        private Category category;
        private Panel panel;

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

        public Builder name(final String val) {
            name = val;
            return this;
        }

        public Builder daysOfWeek(final Set<DayOfWeek> val) {
            daysOfWeek = val;
            return this;
        }

        public Builder frequency(final Frequency val) {
            frequency = val;
            return this;
        }

        public Builder category(final Category val) {
            category = val;
            return this;
        }

        public Builder panel(final Panel val) {
            panel = val;
            return this;
        }

        public Habit build() {
            return new Habit(this);
        }
    }
}
