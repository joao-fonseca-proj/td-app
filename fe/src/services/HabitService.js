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
 * POST /habit
 */
export function postHabit(body) {
    return createClient().post(
        HABIT_PATH,
        body
    );
}
