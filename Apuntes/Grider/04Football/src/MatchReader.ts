import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'

type MatchData = [Date, string, string, number, number, MatchResult, string]

interface DataReader {
    read(): void,
    data: string[][]
}

export class MatchReader{

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