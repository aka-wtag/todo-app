import { $messageElement } from "./element.js";
import { DONE_ICON } from "./svg.js";

const reg = /[&<>"'/`]/gi;

export const sanitizeInput = (value) => {
    return value.replace(reg, "").trim();
};

export const clearInputField = (inputElement) => {
    inputElement.value = "";
};

export const showCompletedTime = (createdAt, completedAt) => {
    const createdTimeSpan = new Date(createdAt).getTime();
    const completedTimeSpan = new Date(completedAt).getTime();

    const totalDayTimeSpan = 24 * 60 * 60 * 1000;

    return Math.ceil((completedTimeSpan - createdTimeSpan) / totalDayTimeSpan);
};

export const showFormattedDate = (dateString) => {
    let givenDate = new Date(dateString);

    let day = givenDate.getDate();
    let month = givenDate.getMonth() + 1;
    let year = givenDate.getFullYear();

    if (day < 10) {
        day = `0${day}`;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    return `${day}.${month}.${year}`;
};

export const showMessage = (success, message) => {
    const $spanElement = document.createElement("span");
    $spanElement.innerHTML = message;
    $messageElement.innerHTML = "";
    $messageElement.classList.remove("hide");
    $messageElement.classList.remove("error-message");
    $messageElement.classList.remove("success-message");

    if (success) {
        $messageElement.classList.add("success-message");
        $messageElement.innerHTML = DONE_ICON;
    } else {
        $messageElement.classList.add("error-message");
    }

    $messageElement.append($spanElement);

    setTimeout(() => {
        $messageElement.classList.add("hide");
    }, 1500);
};
