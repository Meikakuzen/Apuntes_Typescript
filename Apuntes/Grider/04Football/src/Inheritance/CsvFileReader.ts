import fs from 'fs'
import MatchResult from '../MatchResult'

export type MatchData = [Date, string, string, number, number, MatchResult, string]

export abstract class CsvFileReader<T>{
    
    data: T[]= []

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
          }).map(this.mapRow) //paso mapRow por referencia, no lo invoco
    }

    abstract mapRow(data: string[]): T

}