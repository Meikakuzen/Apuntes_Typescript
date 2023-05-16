import { CsvFileReader } from "./CsvFileReader";
import MatchResult from "../MatchResult";
import { dateStringTodate } from "../utils";
import { MatchData } from "./CsvFileReader";


export class MatchReader extends CsvFileReader<MatchData>{
    mapRow(row: string[]): MatchData{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
    }


}