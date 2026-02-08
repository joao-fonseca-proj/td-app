import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_STORAGE_SECRET_KEY || 'key';

export function saveToLocalStorage(key, data) {
    try {
        const stringifiedData = JSON.stringify(data);
        const encryptedData = CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
        localStorage.setItem(key, encryptedData);
    } catch (e) {
        console.error("Failed to save to storage", e);
    }
}

export function retrieveFromStorage(key) {
    try {
        const encryptedData = localStorage.getItem(key);
        if (encryptedData === null) {
            return null; // No data found
        }

        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedData) {
            return JSON.parse(decryptedData);
        }
        return null;

    } catch (e) {
        console.error("Failed to retrieve from storage. Data might be corrupted or key is wrong.", e);
        return null; // Return null on error
    }
}

export function deleteFromStorage(key) {
    localStorage.removeItem(key);
}