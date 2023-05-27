class ArrayOfNumbers{
    constructor(public collection: number[]){}


    get(index:number): number{
        return this.collection[index]
    }
}

class ArrayOfStrings{
    constructor(public collection: string[]){}


    get(index:number): string{
        return this.collection[index]
    }
}

class ArrayOfAnything<T>{
    constructor(public collection: T[]){}

    get(index: number) : T{
        return this.collection[index]
    }
}

new ArrayOfAnything<string>(['a','b','c'])


export function printAnything<T>(arr: T[]): void {
    for(let i = 0; i< arr.length; i++){
        console.log(arr[i])
    }
}

class Car{
    print(){
        console.log("I'm a car")
    }
}

class House{
    print(){
        console.log("I'm a house")
    }
}

interface Printable {
    print(): void; 
}

function printCarOrHouse<T extends Printable>(arr: T[]): void{

    for(let i = 0; i < arr.length; i++){
        arr[i].print()
    }
}