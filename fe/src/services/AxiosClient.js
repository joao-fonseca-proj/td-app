import axios from "axios";
import { deleteUserInformation, getUserInformation } from "./AuthenticationService";

export function createClient() {
    var user = getUserInformation();
    if (user === null || user.token === '') {
        return axios.create();
    } else {
        let axiosClient = axios.create({
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })

        axiosClient.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    deleteUserInformation();
                    window.location.href = '/login';
                }
            } else if (error.request) {
                //logout();
            } else {
            }
            return Promise.reject(error); // Don't forget to rethrow the error
        });
        return axiosClient;
    }
}