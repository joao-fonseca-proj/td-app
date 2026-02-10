package io.joao.fonseca.todo.util;

import java.util.regex.Pattern;

public class Constant {

    // Validations
    public static final Pattern EMAIL_ADDRESS_REGEX =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
    public static final int MINIMUM_USERNAME_LENGTH = 5;
    public static final int MAXIMUM_USERNAME_LENGTH = 20;
    public static final int MINIMUM_PASSWORD_LENGTH = 8;
    public static final int MAXIMUM_PASSWORD_LENGTH = 20;

    // Panel
    public static final String PERSONAL_PANEL = "PERSONAL";
    public static final String PROFESSIONAL_PANEL = "PROFESSIONAL";

    // Habit
    public static final int HABIT_TODO_BUFFER = 30;
}
