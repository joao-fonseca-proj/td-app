package io.joao.fonseca.todo.api.dto.todo;

import java.util.List;

public record TodoDashboardDto(List<TodoFetchListDto> todoFetchList) {
}
