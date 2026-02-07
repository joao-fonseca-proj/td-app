package io.joao.fonseca.todo.domain.user;

import io.joao.fonseca.todo.domain.common.AuditableIdentifiableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.time.OffsetDateTime;

@Entity(name = "users")
public class User extends AuditableIdentifiableEntity {

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false, unique = true)
    private String encryptionSalt;
    @Column(nullable = false)
    private String email;

    public static Builder newBuilder() {
        return new Builder();
    }

    public User() {
    }

    private User(final Builder builder) {
        id = builder.id;
        createdAt = builder.createdAt;
        updatedAt = builder.updatedAt;
        name = builder.name;
        username = builder.username;
        password = builder.password;
        encryptionSalt = builder.encryptionSalt;
        email = builder.email;
    }

    public static Builder newBuilder(final User copy) {
        Builder builder = new Builder();
        builder.id = copy.getId();
        builder.createdAt = copy.getCreatedAt();
        builder.updatedAt = copy.getUpdatedAt();
        builder.name = copy.getName();
        builder.username = copy.getUsername();
        builder.password = copy.getPassword();
        builder.encryptionSalt = copy.getEncryptionSalt();
        builder.email = copy.getEmail();
        return builder;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String getEncryptionSalt() {
        return encryptionSalt;
    }

    public String getEmail() {
        return email;
    }

    public static final class Builder {
        private Long id;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;
        private String name;
        private String username;
        private String password;
        private String encryptionSalt;
        private String email;

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

        public Builder username(final String val) {
            username = val;
            return this;
        }

        public Builder password(final String val) {
            password = val;
            return this;
        }

        public Builder encryptionSalt(final String val) {
            encryptionSalt = val;
            return this;
        }

        public Builder email(final String val) {
            email = val;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}
