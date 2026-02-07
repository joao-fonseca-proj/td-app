package io.joao.fonseca.todo.service.auth;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.function.Supplier;

public class SecurityContextAwareSupplier<T> implements Supplier<T> {

    private final Supplier<T> delegate;
    private final SecurityContext securityContext;

    public SecurityContextAwareSupplier(final Supplier<T> delegate) {
        this.delegate = delegate;
        this.securityContext = SecurityContextHolder.getContext();
    }

    @Override
    public T get() {
        SecurityContext previous = SecurityContextHolder.getContext();
        try {
            SecurityContextHolder.setContext(securityContext);
            return delegate.get();
        } finally {
            // Optional: Restore the previous context to avoid thread contamination
            SecurityContextHolder.setContext(previous);
        }
    }

    public static <T> SecurityContextAwareSupplier<T> wrap(final Supplier<T> supplier) {
        return new SecurityContextAwareSupplier<>(supplier);
    }
}
