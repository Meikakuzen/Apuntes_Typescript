import { Sorter } from "./Sort"

export class CharactersCollection extends Sorter {

    constructor(public data:String){
        super()
    }


    get length(): number{
        return this.data.length
    }

    compare(leftIndex: number, rightIndex: number): boolean{
        return this.data[leftIndex].toLowerCase() > this.data[rightIndex].toLowerCase()
    }

    swap(leftIndex: number, rightIndex: number): void{
        const characters = this.data.split('') //convierto el string en un array de caracteres

        const leftHand = characters[leftIndex]
        characters[leftIndex] = characters[rightIndex]

        characters[rightIndex] = leftHand

        this.data = characters.join('')
    }

}