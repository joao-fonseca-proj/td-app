package io.joao.fonseca.todo.mapper;

import io.joao.fonseca.todo.api.dto.user.RegisterRequestDto;
import io.joao.fonseca.todo.domain.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public abstract class UserMapper {

    public static final UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    public abstract User fromDto(RegisterRequestDto registerRequestDto);

}
