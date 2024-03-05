const reg = /[&<>"'/`]/ig;
import { $errorMessage } from "./element.js";

export const sanitizeInput = (value) => {
    return value.replace(reg, "").trim();
};

export const showErrorMessage = (message) => {
    $errorMessage.hidden = false;
    $errorMessage.innerHTML = message;
};