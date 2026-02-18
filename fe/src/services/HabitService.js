import { BASE_PATH, HABIT_SLUG } from "../utils/RestConstant";
import { createClient } from "./AxiosClient";

const HABIT_PATH = BASE_PATH + HABIT_SLUG;

/**
 * GET /habit/{id}
 */
export function findHabitById(id) {
    return createClient().get(
        `${HABIT_PATH}/${id}`
    );
}

/**
 * GET /habit/user
 */
export function findHabitsByUser() {
    return createClient().get(
        `${HABIT_PATH}/user`
    );
}

/**
 * POST /habit
 */
export function postHabit(body) {
    return createClient().post(
        HABIT_PATH,
        body
    );
}

/**
 * DELETE /habit/{id}?deleteTasks={boolean}
 */
export function deleteHabitById(id, deleteTasks = false) {
    return createClient().delete(
        `${HABIT_PATH}/${id}`,
        {
            params: { deleteTasks }
        }
    );
}
