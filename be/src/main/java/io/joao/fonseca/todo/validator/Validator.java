package io.joao.fonseca.todo.validator;

public interface Validator<T> {

    ValidationResult validate(T object);

}
