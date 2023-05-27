# Advanced Generics

- Creo una claseque defina un array de números con un método que me permita obtener un elemento específico del array

~~~js
class ArrayOfNumbers{
    constructor(public collection: number[]){}


    get(index:number): number{
        return this.collection[index]
    }
}
~~~

- Creo una clase idéntica para un Array de strings

~~~js
class ArrayOfStrings{
    constructor(public collection: string[]){}


    get(index:number): string{
        return this.collection[index]
    }
}
~~~

- La única diferencia es el tipo de la colección
- Para hacer el mismo código en una sola clase usaré genéricos

~~~js
class ArrayOfAnything<T>{
    constructor(public collection: T[]){}

    get(index: number) : T{
        return this.collection[index]
    }
}

new ArrayOfAnything<string>(['a','b','c'])
~~~
---------

## Type Inference with generics

- Si no especifico entre llaves que es un array de strings, Typescript infiere el tipo por mi

~~~js
new ArrayOfAnything(['a','b','c']) //Typescript sabe que es un array de strings
~~~
------

## Function Generics

- Si le pasara un array dentro de los brackets estaría indicando que es un array bidimensional

~~~js
            //si pongo <T[]>   y en el parámetro T[] sería un array bidimensional
export function printAnything<T>(arr: T[]): void {
    for(let i = 0; i< arr.length; i++){
        console.log(arr[i])
    }
}

printAnything([1,2,3,4]) //1,2,3,4  Puedo no indicar que son números en la función con <number>, Typescript infiere el tipo por mi
~~~

- Tampoco tengo porqué indicar el tipo de retorno, ya que Typescript lo infiere por mi
-----

## Generic Constraints

- Cuando intento recorrer el array de genéricos me dice que no .print no existe en el tipo T

~~~js
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

function printCarOrHouse<T>(arr: T[]): void{

    for(let i = 0; i < arr.length; i++){
        arr[i].print() // esto me lanza un error ' La propiedad print no existe en tipo T'
    }
}
~~~

- Esto se soluciona con una constrait que asegura que .print va a estar disponible
- Para ello defino una interfaz y uso la palabra extends para el genérico

~~~js

interface Printable {
    print(): void; 
}

function printCarOrHouse<T extends Printable>(arr: T[]): void{

    for(let i = 0; i < arr.length; i++){
        arr[i].print()
    }
}

printCarOrHouse<House>([new House(), new House()])
~~~

- El constraint limita el número de tipos que le puedo pasar al genérico
- Muy útil para cuando quieres usar métodos o propiedades de otras clases con genéricos
---------


