package io.joao.fonseca.todo.service.auth;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityContextAwareRunnable implements Runnable {

    private final Runnable delegate;
    private final SecurityContext securityContext;

    public SecurityContextAwareRunnable(final Runnable delegate) {
        this.delegate = delegate;
        this.securityContext = SecurityContextHolder.getContext(); // Capture context at creation
    }

    @Override
    public void run() {
        SecurityContext previous = SecurityContextHolder.getContext();
        try {
            SecurityContextHolder.setContext(securityContext);
            delegate.run();
        } finally {
            // Optional: Restore previous context to prevent thread contamination
            SecurityContextHolder.setContext(previous);
        }
    }

    public static Runnable wrap(final Runnable runnable) {
        return new SecurityContextAwareRunnable(runnable);
    }
}
