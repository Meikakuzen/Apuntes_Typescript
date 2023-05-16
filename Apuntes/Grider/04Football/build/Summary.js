"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Summary = void 0;
const WinsAnalisis_1 = require("./analyzers/WinsAnalisis");
const HtmlReport_1 = require("./reporters/HtmlReport");
class Summary {
    static winsAnalysisWithHTMLReport(teamName) {
        return new Summary(new WinsAnalisis_1.WinsAnalysis(teamName), new HtmlReport_1.HtmlReport());
    }
    constructor(analyzer, outputTarget) {
        this.analyzer = analyzer;
        this.outputTarget = outputTarget;
    }
    buildAndPrintReport(matches) {
        const output = this.analyzer.run(matches);
        this.outputTarget.print(output);
    }
}
exports.Summary = Summary;
