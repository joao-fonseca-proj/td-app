package io.joao.fonseca.todo.util;

import java.security.SecureRandom;
import java.util.Base64;

public class SaltUtils {

    public static String generateSalt() {
        final var salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

}
