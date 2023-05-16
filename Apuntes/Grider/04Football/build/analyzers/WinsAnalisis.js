"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinsAnalysis = void 0;
const MatchResult_1 = __importDefault(require("../MatchResult"));
class WinsAnalysis {
    constructor(teamName) {
        this.teamName = teamName;
    }
    run(matches) {
        let wins = 0;
        for (let match of matches) {
            if (match[1] === this.teamName && match[5] === MatchResult_1.default.HomeWin) {
                wins++;
            }
            else if (match[2] === this.teamName && match[5] === MatchResult_1.default.AwayWin) {
                wins++;
            }
        }
        return `Team ${this.teamName} wons ${wins} games `;
    }
}
exports.WinsAnalysis = WinsAnalysis;
