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
