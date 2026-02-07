package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.user.RegisterRequestDto;
import io.joao.fonseca.todo.config.AuthenticationConfiguration;
import io.joao.fonseca.todo.domain.user.User;
import io.joao.fonseca.todo.mapper.UserMapper;
import io.joao.fonseca.todo.repository.UserRepository;
import io.joao.fonseca.todo.util.SaltUtils;
import io.joao.fonseca.todo.util.ValidatorEngine;
import io.joao.fonseca.todo.validator.LengthStringValidator;
import io.joao.fonseca.todo.validator.RegexStringValidator;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import static io.joao.fonseca.todo.util.Constant.*;

@Service
public class UserService {

    private final UserMapper mapper;
    private final UserRepository repository;

    public UserService(final UserRepository repository) {
        this.mapper = UserMapper.INSTANCE;
        this.repository = repository;
    }

    public User register(final RegisterRequestDto registerRequestDto) {
        validate(registerRequestDto);

        if (repository.existsByUsernameOrEmail(registerRequestDto.username(), registerRequestDto.email())) {
            throw new DuplicateKeyException("User already exists with email or username");
        }

        final var user = mapper.fromDto(registerRequestDto);
        final var updatedUser = User.newBuilder(user)
                .password(AuthenticationConfiguration.getBaseEncoder().encode(user.getPassword()))
                .encryptionSalt(SaltUtils.generateSalt())
                .build();

        return repository.save(updatedUser);
    }

    private void validate(final RegisterRequestDto registerRequestDto) {
        final var validationResult = ValidatorEngine.combineAll(
                new LengthStringValidator(MINIMUM_USERNAME_LENGTH, MAXIMUM_USERNAME_LENGTH)
                        .validate(registerRequestDto.username()),
                new LengthStringValidator(MINIMUM_PASSWORD_LENGTH, MAXIMUM_PASSWORD_LENGTH)
                        .validate(registerRequestDto.password()),
                new RegexStringValidator(EMAIL_ADDRESS_REGEX)
                        .validate(registerRequestDto.email())
        );

        if (validationResult.isFailure()) {
            throw new IllegalArgumentException("User Registration %s is invalid"
                    .formatted(registerRequestDto));
        }
    }
}
