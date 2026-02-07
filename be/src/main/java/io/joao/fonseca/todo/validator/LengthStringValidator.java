package io.joao.fonseca.todo.validator;

public class LengthStringValidator extends StringValidator {

    private final int min;
    private final int max;

    public LengthStringValidator(final int min, final int max) {
        this.min = min;
        this.max = max;
    }

    @Override
    public ValidationResult validate(final String object) {
        final var result = super.validate(object);
        if (result.isFailure()) {
            return result;
        }

        final var length = object.length();
        if (length < min || length > max) {
            return ValidationResult.FAILURE;
        }
        return ValidationResult.SUCCESS;
    }
}
