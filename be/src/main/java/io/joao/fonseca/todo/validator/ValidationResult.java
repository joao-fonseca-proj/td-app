package io.joao.fonseca.todo.validator;

public enum ValidationResult {
    SUCCESS,
    FAILURE,
    EMPTY;

    public boolean isSuccess() {
        return this == SUCCESS;
    }

    public boolean isFailure() {
        return this == FAILURE;
    }
}
