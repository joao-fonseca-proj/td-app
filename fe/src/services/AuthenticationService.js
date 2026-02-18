import axios from "axios";
import { BASE_PATH, USER_SLUG } from "../utils/RestConstant";
import { deleteFromStorage, retrieveFromStorage, saveToLocalStorage } from "./LocalStorageService";

export const USER_STORAGE_KEY = "u";


// ENDPOINTS
export function postLogin(username, password) {
    return axios.post(BASE_PATH + USER_SLUG + "/login", {
        "username": username,
        "password": password
    });
}

export function postSignUp(data) {
    return axios.post(BASE_PATH + USER_SLUG + "/register", data);
}

// STORAGE
export function getUserInformation() {
    return retrieveFromStorage(USER_STORAGE_KEY);
}
export function saveUserInformation(user) {
    return saveToLocalStorage(USER_STORAGE_KEY, user);
}

export function deleteUserInformation() {
    return deleteFromStorage(USER_STORAGE_KEY);
}