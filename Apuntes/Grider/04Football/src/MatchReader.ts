import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'
import { MatchData } from './types/MatchData'
import { CsvFileReader } from './CsvFileBACKUP'

interface DataReader {
    read(): void,
    data: string[][]
}

export class MatchReader{

    static fromCsv(filename: string): MatchReader{
        return new MatchReader(new CsvFileReader(filename))
    }
    
    matches: MatchData[]= []

    

    constructor (public reader: DataReader){
        
    }

    load():void{
        this.reader.read()
        this.matches = this.reader.data.map((row: string[]): MatchData=>{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
      })
    }


}