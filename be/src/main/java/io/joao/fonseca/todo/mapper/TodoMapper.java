package io.joao.fonseca.todo.mapper;

import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import io.joao.fonseca.todo.api.dto.todo.TodoFetchListDto;
import io.joao.fonseca.todo.domain.todo.Panel;
import io.joao.fonseca.todo.domain.todo.Todo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public abstract class TodoMapper {

    public static final TodoMapper INSTANCE = Mappers.getMapper(TodoMapper.class);

    public abstract Todo fromDto(TodoDto todoDto);

    @Mapping(target = "panelId", source = "panel.id")
    @Mapping(target = "habitId", source = "habit.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    public abstract TodoDto toDto(Todo todo);
}

