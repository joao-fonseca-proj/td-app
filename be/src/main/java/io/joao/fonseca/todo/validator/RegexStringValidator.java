package io.joao.fonseca.todo.validator;

import java.util.regex.Pattern;

public class RegexStringValidator extends StringValidator {

    private final Pattern regex;

    public RegexStringValidator(final Pattern regex) {
        this.regex = regex;
    }

    @Override
    public ValidationResult validate(final String object) {
        final var result = super.validate(object);
        if (result.isFailure()) {
            return result;
        }

        if (regex.matcher(object).matches()) {
            return ValidationResult.SUCCESS;
        }
        return ValidationResult.FAILURE;
    }
}
