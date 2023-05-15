
import { CsvFileReader } from "./CsvFileBACKUP"
import { MatchReader } from "./MatchReader"
import MatchResult from "./MatchResult"


const csvFile = new CsvFileReader('./data/football.csv')
const reader = new MatchReader(csvFile)

reader.load()



let manUnitedWins= 0 //contador para que incremente en 1 cada vez que gana Manchester United



for(let match of reader.matches){ //cambio reader.data por reader.matches
    if(match[1] === "Man United" && match[5]===MatchResult.HomeWin){
        manUnitedWins++
    }else if(match[2]=== 'Man United' && match[5]===MatchResult.AwayWin){
        manUnitedWins ++
    }
}

console.log(`Manchester United won ${manUnitedWins} games`)



  
