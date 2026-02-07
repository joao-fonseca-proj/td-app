package io.joao.fonseca.todo.util;

import io.joao.fonseca.todo.validator.ValidationResult;

import java.util.Arrays;

public class ValidatorEngine {

    public static ValidationResult combineAll(final ValidationResult... results) {
        return Arrays.stream(results)
                .anyMatch(r -> r == ValidationResult.FAILURE)
                ? ValidationResult.FAILURE
                : ValidationResult.SUCCESS;
    }

}
