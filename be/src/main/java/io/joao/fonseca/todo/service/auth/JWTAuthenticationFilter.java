package io.joao.fonseca.todo.service.auth;

import io.joao.fonseca.todo.domain.user.CustomUserDetails;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JWTAuthenticationFilter.class);

    public static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_HEADER = "Bearer ";
    private static final int BEARER_CHAR_START = 7;

    private final UserDetailsService userDetailsService;

    public JWTAuthenticationFilter(final UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public UserDetailsService getUserDetailsService() {
        return userDetailsService;
    }

    @Override
    protected void doFilterInternal(final HttpServletRequest request,
                                    final HttpServletResponse response,
                                    final FilterChain filterChain) throws ServletException, IOException {
        try {
            extractTokenFromRequest(request)
                    .ifPresent(token -> saveAuthenticationContext(token, request));
            filterChain.doFilter(request, response);
        } catch (final ExpiredJwtException exception) {
            LOGGER.error("Error while filtering JWT: {}", exception.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private Optional<String> extractTokenFromRequest(final HttpServletRequest request) {
        final var bearerToken = request.getHeader(AUTHORIZATION_HEADER);

        if (SecurityContextHolder.getContext().getAuthentication() == null
                && StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_HEADER)) {
            final var token = bearerToken.substring(BEARER_CHAR_START);
            if (StringUtils.hasText(token)) {
                return Optional.of(token);
            }
        }
        return Optional.empty();
    }

    private void saveAuthenticationContext(final String token, final HttpServletRequest request) {
        // get username from token
        final var username = JWTUtils.extractUsername(token);
        // load the user associated with token
        final var userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);
        final var authenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}
