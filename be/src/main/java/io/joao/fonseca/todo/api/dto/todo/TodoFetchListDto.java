package io.joao.fonseca.todo.api.dto.todo;

import io.joao.fonseca.todo.api.dto.panel.PanelDto;

import java.util.List;

public record TodoFetchListDto(PanelDto panel, List<TodoDto> todos) {
}
