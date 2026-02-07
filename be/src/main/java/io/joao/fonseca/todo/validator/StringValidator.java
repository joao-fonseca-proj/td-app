package io.joao.fonseca.todo.validator;

import static org.apache.commons.lang3.StringUtils.isBlank;

public class StringValidator implements Validator<String> {

    @Override
    public ValidationResult validate(final String object) {
        if (isBlank(object)) {
            return ValidationResult.FAILURE;
        }
        return ValidationResult.SUCCESS;
    }

}
