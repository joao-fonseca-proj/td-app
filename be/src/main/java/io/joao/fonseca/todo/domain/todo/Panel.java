package io.joao.fonseca.todo.domain.todo;

import io.joao.fonseca.todo.domain.common.AuditableIdentifiableEntity;
import io.joao.fonseca.todo.domain.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;

import java.time.OffsetDateTime;

@Entity
public class Panel extends AuditableIdentifiableEntity {

    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    public Panel() {
    }

    public static Builder newBuilder() {
        return new Builder();
    }

    private Panel(final Builder builder) {
        id = builder.id;
        createdAt = builder.createdAt;
        updatedAt = builder.updatedAt;
        name = builder.name;
        user = builder.user;
    }

    public static Builder newBuilder(final Panel copy) {
        Builder builder = new Builder();
        builder.id = copy.getId();
        builder.createdAt = copy.getCreatedAt();
        builder.updatedAt = copy.getUpdatedAt();
        builder.name = copy.getName();
        builder.user = copy.getUser();
        return builder;
    }

    public String getName() {
        return name;
    }

    public User getUser() {
        return user;
    }


    public static final class Builder {
        private Long id;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;
        private String name;
        private User user;

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

        public Builder user(final User val) {
            user = val;
            return this;
        }

        public Panel build() {
            return new Panel(this);
        }
    }
}
