const reg = /[&<>"'/`]/ig;

export const sanitizeInput = (value) => {
    return value.replace(reg, "").trim();
};