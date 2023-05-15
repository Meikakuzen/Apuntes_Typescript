"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CsvFileBACKUP_1 = require("./CsvFileBACKUP");
const MatchReader_1 = require("./MatchReader");
const MatchResult_1 = __importDefault(require("./MatchResult"));
const csvFile = new CsvFileBACKUP_1.CsvFileReader('./data/football.csv');
const reader = new MatchReader_1.MatchReader(csvFile);
reader.load();
let manUnitedWins = 0; //contador para que incremente en 1 cada vez que gana Manchester United
for (let match of reader.matches) { //cambio reader.data por reader.matches
    if (match[1] === "Man United" && match[5] === MatchResult_1.default.HomeWin) {
        manUnitedWins++;
    }
    else if (match[2] === 'Man United' && match[5] === MatchResult_1.default.AwayWin) {
        manUnitedWins++;
    }
}
console.log(`Manchester United won ${manUnitedWins} games`);
