"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvFileReader = void 0;
const fs_1 = __importDefault(require("fs"));
class CsvFileReader {
    constructor(fileName) {
        this.fileName = fileName;
        this.data = [];
    }
    read() {
        this.data = fs_1.default.readFileSync(this.fileName, {
            encoding: 'utf8', // si espero texto lo codeo a utf-8
        })
            .split('\n')
            .map((row) => {
            return row.split(',');
        }).map(this.mapRow); //paso mapRow por referencia, no lo invoco
    }
}
exports.CsvFileReader = CsvFileReader;
