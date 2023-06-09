import MatchResult from "./MatchResult"

export const dateStringTodate = (dateString: string): Date=>{
    const dateParts = dateString.split('/').map((value:string):number=>{
        return parseInt(value)
    })
    
    return new Date(dateParts[2],dateParts[1]-1, dateParts[0]) //- 1 porque Enero es 0

}