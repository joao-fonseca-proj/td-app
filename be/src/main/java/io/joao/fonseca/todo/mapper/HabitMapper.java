package io.joao.fonseca.todo.mapper;

import io.joao.fonseca.todo.api.dto.habit.HabitDto;
import io.joao.fonseca.todo.domain.habit.Habit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public abstract class HabitMapper {

    public static final HabitMapper INSTANCE = Mappers.getMapper(HabitMapper.class);

    public abstract Habit fromDto(HabitDto habitDto);

    @Mapping(target = "panelId", source = "panel.id")
    public abstract HabitDto toDto(final Habit savedHabit);

}
