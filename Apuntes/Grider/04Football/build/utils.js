"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateStringTodate = void 0;
const dateStringTodate = (dateString) => {
    const dateParts = dateString.split('/').map((value) => {
        return parseInt(value);
    });
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); //- 1 porque Enero es 0
};
exports.dateStringTodate = dateStringTodate;
