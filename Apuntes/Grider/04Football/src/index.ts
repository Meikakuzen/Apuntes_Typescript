
import { CsvFileReader } from "./CsvFileBACKUP"
import { MatchReader } from "./MatchReader"
import { Summary } from "./Summary"
import { WinsAnalysis } from "./analyzers/WinsAnalisis"
import { ConsoleReport } from "./reporters/Consolereport"
import { HtmlReport } from "./reporters/HtmlReport"


const csvFile = new CsvFileReader('./data/football.csv')
const matchReader = new MatchReader(csvFile)
matchReader.load()

const ManUnitedAnalyzer = new WinsAnalysis('Man United')
const ManUnitedReport = new HtmlReport()

const ManUnitedSummary = new Summary(ManUnitedAnalyzer, ManUnitedReport)

ManUnitedSummary.buildAndPrintReport(matchReader.matches)





  
