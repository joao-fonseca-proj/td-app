package io.joao.fonseca.todo.domain.common;

import java.time.LocalDate;

public record Range(LocalDate min, LocalDate max) {

    public static Range of(final int min, final int max) {
        final var now = LocalDate.now();
        return new Range(now.minusDays(min), now.plusDays(max));
    }
}
