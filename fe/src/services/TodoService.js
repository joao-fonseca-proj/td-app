import { BASE_PATH, TODO_SLUG } from "../utils/RestConstant";
import { createClient } from "./AxiosClient";

const TODO_PATH = BASE_PATH + TODO_SLUG;

/**
 * POST /todo
 */
export function postTodo(body) {
    return createClient().post(TODO_PATH, body);
}

/**
 * PATCH /todo/title/{id}
 */
export function patchTodoTitle(id, body) {
    return createClient().patch(
        `${TODO_PATH}/title/${id}`,
        body
    );
}

/**
 * PATCH /todo/dueDate/{id}?position=&dueDate=
 */
export function patchTodoDueDate(id, position, dueDate) {
    return createClient().patch(
        `${TODO_PATH}/dueDate/${id}`,
        null,
        {
            params: {
                position,
                dueDate
            }
        }
    );
}

/**
 * PATCH /todo/toggle/{id}?value=
 */
export function patchTodoCompletion(id, value) {
    return createClient().patch(
        `${TODO_PATH}/toggle/${id}`,
        null,
        {
            params: { value }
        }
    );
}

/**
 * PATCH /todo/move/{id}?position=
 */
export function patchTodoPosition(id, position) {
    return createClient().patch(
        `${TODO_PATH}/move/${id}`,
        null,
        {
            params: { position }
        }
    );
}

/**
 * GET /todo/panel/beforeLimit=&afterLimit=
 */
export function getTodos(beforeLimit, afterLimit) {
    return createClient().get(
        `${TODO_PATH}/panel`,
        {
            params: {
                beforeLimit,
                afterLimit
            }
        }
    );
}

/**
 * DELETE /todo/delete/{id}
 */
export function deleteTodoById(id) {
    return createClient().delete(
        `${TODO_PATH}/delete/${id}`
    );
}
