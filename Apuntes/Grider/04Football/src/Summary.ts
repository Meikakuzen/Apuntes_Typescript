import { Analyzer } from "./interfaces/Analyzer"
import { OutputTarget } from "./interfaces/OutputTarget"
import { MatchData } from "./types/MatchData"
import { WinsAnalysis } from "./analyzers/WinsAnalisis"
import { HtmlReport } from "./reporters/HtmlReport"


export class Summary{

    static winsAnalysisWithHTMLReport(teamName: string): Summary{
            return new Summary(new WinsAnalysis(teamName), new HtmlReport())
    }
    constructor(public analyzer: Analyzer, public outputTarget:OutputTarget){
        
    }

    buildAndPrintReport(matches: MatchData[]): void{
        const output = this.analyzer.run(matches)
        this.outputTarget.print(output)
    }
}