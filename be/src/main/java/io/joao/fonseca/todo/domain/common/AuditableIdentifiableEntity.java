package io.joao.fonseca.todo.domain.common;

import jakarta.persistence.*;
import org.springframework.data.domain.Sort;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@MappedSuperclass
public abstract class AuditableIdentifiableEntity {

    public static Sort DEFAULT_ENTITY_SORT = Sort.by(Sort.Direction.DESC, "createdAt");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(nullable = false)
    protected OffsetDateTime createdAt;

    @Column(nullable = false)
    protected OffsetDateTime updatedAt;

    public AuditableIdentifiableEntity() {
    }

    @PrePersist
    public void defaultValues() {
        updatedAt = createdAt = OffsetDateTime.now(ZoneOffset.UTC);
    }

    @PreUpdate
    public void updateValues() {
        updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
    }

    public Long getId() {
        return id;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
