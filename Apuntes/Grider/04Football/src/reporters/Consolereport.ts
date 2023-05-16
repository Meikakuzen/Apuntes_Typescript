import { OutputTarget } from "../interfaces/OutputTarget";


export class ConsoleReport implements OutputTarget{

    //no tengo porqué usar la misma palabra report como marca la interfaz
    print(report: string):void{
        console.log(report)
    }
}