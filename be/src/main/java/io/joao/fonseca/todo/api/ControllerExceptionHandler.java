package io.joao.fonseca.todo.api;

import io.joao.fonseca.todo.api.dto.ErrorDto;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.security.SignatureException;

@RestControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(value = IllegalArgumentException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorDto handleException(final IllegalArgumentException exception) {
        return buildError(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = DuplicateKeyException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorDto handleException(final DuplicateKeyException exception) {
        return buildError(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = EntityNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public ErrorDto handleException(final EntityNotFoundException exception) {
        return buildError(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = UnsupportedOperationException.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorDto handleException(final UnsupportedOperationException exception) {
        return buildError(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = IllegalStateException.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorDto handleException(final IllegalStateException exception) {
        return buildError(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = ExpiredJwtException.class)
    @ResponseStatus(value = HttpStatus.GONE)
    public ErrorDto handleException(final ExpiredJwtException exception) {
        return buildError(exception.getMessage(), HttpStatus.GONE);
    }

    @ExceptionHandler(value = SignatureException.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public ErrorDto handleException(final SignatureException exception) {
        return buildError(exception.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = BadCredentialsException.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public ErrorDto handleException(final BadCredentialsException exception) {
        return buildError(exception.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = InternalAuthenticationServiceException.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public ErrorDto handleException(final InternalAuthenticationServiceException exception) {
        return buildError(exception.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    public static ErrorDto buildError(final String message, final HttpStatus status) {
        return new ErrorDto(status.value(), Integer.toString(status.value()), message);
    }
}
