# Sort A List 

- Creo la clase Sorter con un array de números

~~~js
class Sorter {
    collection : number[];
    constructor( collection: number[]){
        this.collection = collection
    }
}

const sorter = new Sorter([10, 3, -5, 0]);

export default Sorter
~~~

- Si le añado public en el constructor puedo obviar la declaración primera
- Creo el metodo sort

~~~js
class Sorter {
    
    constructor( public collection: number[]){
        this.collection = collection
    }

    sort(): void{
        const {length}= this.collection //uso desestructuración para extraer el length de this.collection.length

        //el algoritmo
        for(let i = 0; i < length; i++){
            for(let j= 0; j < length - i -1; j++){ //el - i implica que cuando haya hecho toda una iteración completa del array
                                                    //el elemento de la derecha estará en el lugar correcto
                //comparamos si el elemento j es mayor que el elemento j+1
                if(this.collection[j] > this.collection[j+1]){
                    //swapping logic
                    const leftHand= this.collection[j]

                    this.collection[j] = this.collection[j+1] //cojo el de la derecha y lo paso a la izquierda
                    this.collection[j+1] = leftHand //cojo la vieja referencia del valor de la izquierda y lo paso a la derecha
                }
            }
        }
    }
}

const sorter = new Sorter([10, 3, -5, 0]);
sorter.sort()
console.log(sorter.collection)

export default Sorter
~~~

- Esto ordena la lista -5,0,3,10
----

## Dos problemas

- Si incluyo un número mayor al array en la posición 0 lo acepta

~~~js
collection[0]= 200 //[200,0,3,10]
~~~

- hay una diferencia importante con los Arrays y los strings
- Puedo acceder a los caracteres con la notación por corchete pero no cambio la cadena de strings

~~~js
const color ="red"

color[0] //'r'

color[0]= 'Y'

console.log(color) //red
~~~

- Eso significa que el algoritmo escrito con el bucle for anidado no va a servir para la cadena de strings
- Si tengo la cadena Xaaa parece que ordenada sería aaaX pero si hago la comparación X > a === false
- Para entender esto uso la propiedad .charCodeaT

~~~js
"X".charCodeAt(0) // 88
"a".charCodeAt(0) // 97

//Esto pasa por que X es mayúscula. Todas en lowerCase si corresponden en orden
~~~

- Por eso la comparación de X mayor que a devuelve false
-----

## Tyopescript es muy listo

- Quiero hacer que el algoritmo funcione igual con un array de numeros que un string
- Si uso el operador | para declarar que collection puede ser de tipo **number[] | string** surge un problema

~~~js
this.collection[j] = x //me marca error porque 'Index signature in 'string[] | number' only permits reading 
~~~

- Es que puedo usar la notación de corchetes con un array de números pero no con uno de strings por lo descrito antes
  - Strings no lo soportan por lo que marca error. 
  - Con strings la notación con corchetes me sirve para leer caracteres pero no para cambiarlos
----

## Type Guards

- Uso instanceof para entrar en el condicional si es un array
- Ahora, dentro del condicional, solo tengo disponibles los métodos de arrays

~~~js
class Sorter {
    
    constructor( public collection: number[] | string){
        this.collection = collection
    }

    sort(): void{
        const {length}= this.collection //uso desestructuración para extraer el length de this.collection.length

        //el algoritmo
        for(let i = 0; i < length; i++){
            for(let j= 0; j < length - i -1; j++){ //el - i implica que cuando haya hecho toda una iteración completa del array
                                                    //el elemento de la derecha estará en el lugar correcto
                      //Type Guard                              
            if(this.collection instanceof Array){
                if(this.collection[j] > this.collection[j+1]){
                    //swapping logic
                    const leftHand= this.collection[j]

                    this.collection[j] = this.collection[j+1] //cojo el de la derecha y lo paso a la izquierda
                    this.collection[j+1] = leftHand //cojo la vieja referencia del valor de la izquierda y lo paso a la derecha
                }

            }
            }
        }
    }
}

const sorter = new Sorter([10, 3, -5, 0]);
sorter.sort()
console.log(sorter.collection)

export default Sorter
~~~

- Para hacer la comparación con string uso typeof
- Dentro de este condicional tengo solo los métodos de los strings 

~~~js
  if(typeof this.collection === 'string'){
                
    }
~~~

- typeof sirve para primitivos (number, string, boolean, symbol)
- instanceof sirve para todo aquel (otro) valor creado con un constructor
- Si hago un typeof de [] devuelve "object", no me sirve ç
## **NOTA** ESTE CAMINO ES CON FINES PEDAGÓGICOS. LA IMPLEMENTACIÓN FINAL NO ES ESTA
-----

## Porqué esta implementación no es correcta?

- Si queremos añadir otro tipo a collection hay que añadirlo en el constructor, usar un type guard en el método sort, etc
- Hay que cambiar demasiadas cosas
-----

## Extracting Key Logic (good code)

- Hay una manera mejor de implementar esto
- El problema es que usamos la dotación por corchete, y eso solo está "disponible" para los arrays
- Refactor: creamos una clase NumbersCollection con todos los elementos de la operación (data, swap(), compare(), length)
- Creo un archivo Sort y copio la clase Sorter ahí
- Limpio la clase

~~~js
export class Sorter {
    
    constructor( public collection: /*TODO*/){
        this.collection = collection
    }

    sort(): void{
        const {length}= this.collection

        
        for(let i = 0; i < length; i++){
            for(let j= 0; j < length - i -1; j++){ 
              
           
                if(this.collection[j] > this.collection[j+1]){
                    const leftHand= this.collection[j]

                    this.collection[j] = this.collection[j+1] 
                    this.collection[j+1] = leftHand 
                }
            }
        }
    }
}
~~~

- Creo NumbersCollection

~~~js
export class NumbersCollection{

    constructor(public data: number[]){
        
    }
    //al ponerle get no tengo que llamarlo como una función (lo llamo sin los paréntesis)
    get length(){
        return this.data.length
    }


    swap(leftIndex:number, rightIndex:number):void{
        const leftHand = this.data[leftIndex]
        this.data[leftIndex] = this.data[rightIndex]
        this.data[rightIndex] = leftHand
    }

    compare(leftIndex: number,rightIndex: number): boolean{
        return this.data[leftIndex] > this.data[rightIndex]
    }
}
~~~

- En Sort

~~~js
import { NumbersCollection } from "./NumbersCollection"

export class Sorter {
                        //collection será de tipo NumbersCollection            
    constructor( public collection: NumbersCollection){
        this.collection = collection
    }

    sort(): void{
        const {length}= this.collection

        
        for(let i = 0; i < length; i++){
            for(let j= 0; j < length - i -1; j++){ 
              
           
                if(this.collection.compare(j, j+1)){
                    this.collection.swap(j, j+1)
                }
            }
        }
    }
}
~~~

- En Sorter.ts

~~~js
import { Sorter } from "./Sort";
import { NumbersCollection } from "./NumbersCollection";



const numbersCollection = new NumbersCollection([-2,3,1,29,6]) 
const sorter = new Sorter(numbersCollection);
sorter.sort()

console.log(sorter.collection)
~~~
----

## The Big Reveal

- Ahora falta implementar la solución para otros tipos de datos que no sean un array de números
- Vamos a definir una interfaz para elegir ordenar un array de números, string o LinkedList. Necesito
  - La colección de números, el length para hacer el loop, el método compare y el método swap
  - Mientras definas estas 4 cosas, no importa el tipo del que sean: numbers, strings
- Tendré la NumbersCollection con los métodos swap, compare y lentgh
- Tendré la CharactersCollection con los mismos métodos
- Y la LinkedList ( otro tipo de dato) con los mismos métodos
-----

## Interface definition

- collection ahora será de tipo Sorteable ( la interfaz )
- No marca error porque satisface la interfaz

~~~js
interface Sorteable{
    length: number,
    compare(leftIndex: number,rightIndex: number): boolean,
    swap(leftIndex: number, rightIndex: number): void,

}

export class Sorter {
                                   
    constructor( public collection: Sorteable){ 
        this.collection = collection
    }

    sort(): void{
        const {length}= this.collection

        
        for(let i = 0; i < length; i++){
            for(let j= 0; j < length - i -1; j++){ 
              
           
                if(this.collection.compare(j, j+1)){
                    this.collection.swap(j, j+1)
                }
            }
        }
    }
}
~~~
-----

## Sorting arbitrary collections

- Falta crear las clases CharactersCollection y LinkedList
- CharactersCollection va a representar strings, tendrá los mismos métodos para satisfacer la interfaz pero con otra lógica que ocupe los strings
- Para hacer la comparación usaremos charCodeat, pero para eso hay que poner todas las letras en lowerCase, porque si no pasa lo que vimos en el ejemplo de ordenar strings con aaaX
- CharactersCollection.ts

~~~js
export class CharactersCollection {

    constructor(public data:String){

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
~~~

- De esta manera puedo pasarle a la clase Sort un string que lo va a ordenar. Probémoslo!

~~~js
import { Sorter } from "./Sort";
import { NumbersCollection } from "./NumbersCollection";
import { CharactersCollection } from "./CharactersCollection";



const numbersCollection = new NumbersCollection([-2,3,1,29,6]) 
const sorter = new Sorter(numbersCollection);
sorter.sort()

const charactersCollection = new CharactersCollection('abdcFEHG')
const sorterString = new Sorter(charactersCollection)
sorterString.sort()

console.log(sorter.collection)
console.log(sorterString.collection)
~~~

- Este es el poder de las interfaces en acción!
- Las interfaces son guays porque podemos establecer contratos entre clases y usar código más genérico
----

## LinkedList Implementation

- Recuerda lo que es una linkedlist: nodos que apuntan a otros y el último apunta a null
- Creo la clase LinkedList

~~~js


class Node{

    next: Node | null= null; // no referencia a ninguno, empieza en null

    constructor(public data: number){

    }
}

export class LinkedList{

    head: Node | null = null; //El head cuando se crea apunta a null

    //Debo encontrar el último nodo que apunta a null y engancaharle el número detrás con add

    add(data: number): void{
        const node = new Node(data)

        //debo asegurarme de que tengo un head
        if(!this.head){
            this.head = node
            return
        }
        //si tengo un head necesito encontrar el último nodo y agregarle este

        let tail = this.head //referencio el primer nodo 
        while(tail.next){  //hasta que next no sea null continua
            tail = tail.next
        }
        tail.next = node //cuando encuentro el último nodo (next apunta a null) le añado el nodo

    }

    get length(): number{
        //necesito lógica para recorrer la LnkedList
        if(!this.head){
            return 0
        } 

        let length = 1
        let node = this.head
        while(node.next){
            length++
            node = node.next
        }

        return length
    }

    //Necesitamos implementar el método at para obtener los nodos para compare y swap

    at(index: number): Node{
        if(!this.head){
            throw new Error ("Index out of bounds")
        }
        let counter = 0

        let node: Node | null = this.head //anoto el tipo manualmente para que no marque error cuando guardo node.next en node

        while(node){
            if(counter === index){
                return node
            }

            counter ++
            node = node.next //si no pongo el tipado Node | null a node esto marca error porque intento asignar un valor Null o Node de
                                                                                //nex.null a uno solo de tipo Node como es node    
        }
        throw new Error('Index out of Bounds') // si llega hasta aquí es que el index supera el númerod eelementos
    }

    compare(leftIndex: number, rightIndex: number): boolean{
        if(!this.head){
            throw new Error('List is empty')
        }

        return this.at(leftIndex).data > this.at(rightIndex).data
    }

    swap(leftIndex: number, rightIndex: number): void{
        //hacer esta operación con una LinkedList puede ser muy complicado, porque podría romper la LinkedList
        //en lugar de hacer swapping con los nodos los haremos solo con los valores

        const leftNode = this.at(leftIndex)
        const rightNode = this.at(rightIndex)

        const leftValue = leftNode.data
        leftNode.data = rightNode.data
        rightNode.data = leftValue
    }

    print(): void{
        if(!this.head){
            return
        }

        let node: Node | null = this.head //aqui debo introudcir el tipo manualmente por lo mismo que antes
        while(node){                        //mientras tenga un nodo
            console.log(node.data)          //imprime la data
            node = node.next                //pas al siguiente nodo
        }
    }

}
~~~
-----

## Una cosita más...

- Vamos a probar la clase LinkedList

~~~js
import { Sorter } from "./Sort";
import { NumbersCollection } from "./NumbersCollection";
import { CharactersCollection } from "./CharactersCollection";
import { LinkedList } from "./LinkedList";



const numbersCollection = new NumbersCollection([-2,3,1,29,6]) 
const sorter = new Sorter(numbersCollection);
sorter.sort()

const charactersCollection = new CharactersCollection('abdcFEHG')
const sorterString = new Sorter(charactersCollection)
sorterString.sort()


const linkedList = new LinkedList()

linkedList.add(500)
linkedList.add(-10)
linkedList.add(232)
linkedList.add(3)


const sorterLinkedList = new Sorter(linkedList)

sorterLinkedList.sort()
linkedList.print()



console.log(sorter.collection)
console.log(sorterString.collection)
~~~

- Hay un gran problema. Es demasiado laborioso llamar al método sort. tengo que crear una instancia de la colección, pasarsela a otra instancia de Srot y luego llamar al método
- Sería mucho mejor crear la colección y llamar directamente al método sort
- Tener el método sort en la colección
-----

## Integrando el método sort

- Usemos la herencia para implementar el método sort en NumbersCollection, CharactersCollection y LinkedList
- Hay que refactorizar sort para que llame a los métodos de la clase NumbersCollection, etc
    - En lugar de usar this.collection.compare, usar this.compare
----

## Herencia

- Cómo sort va a estar disponible en NumbersCollection y los otros, va a tener disponible compare, swap y length
- Importo Sorter en NumbersCollection y hago la herencia con extends
- Debo llamar al super (constructor padre) con la colección dentro del constructor hijo
- Si pusieramos el método sort en NumbersCollection ( haciendo un copy paste) habría algunos cambios
- Los cambio sería que el length que desestructuro lo desestructuro del this y no del this.collection
- Tampoco usaria this.collection.compare si no this.compare, lo mismo con swap
- Entonces en Sorter no necesito la collection, ni siquiera el constructor

~~~js
export class Sorter {
 

    sort(): void{
        const {length}= this //ERROR- No existe la propiedad length en Sorter

        
        for(let i = 0; i < length; i++){
            for(let j= 0; j < length - i -1; j++){ 
              
           
                if(this.compare(j, j+1)){  //ERROR- La propiedad compare no existe en Sorter
                    this.swap(j, j+1)      //ERROR- La propiedad swap no existe en Sorter
                }
            }
        }
    }
}
~~~

- Pero en la clase de la que extiende Sorter (NumbersCollection) **SI TIENE LENGTH,COMPARE Y SWAP**
- Pero Typescript no lo sabe en la construcción de la clase!
- Resolvemos este problema con una clase Abstracta
--------

## Clase Abstracta

- Las clases abstractas no pueden usarse para crear objetos directamente ( no puedo instanciarla )
- Solo se usan como clases pariente
- Pueden contener implementaciones reales de los métodos
- Los métodos implementados pueden referirse a métodos todavía no existentes ( hay que proveer los nombres y tipos para los métodos no implementados)
- Pueden tener clases hijas que prometan implementar otros métodos
    - Es perfecto, porque yo no quiero crear una instancia de la clase, solo quiero implementar el método sort
- Uso la palabra abstract tanto para definir la clase como los metodos no implementados aún

~~~js
export abstract class Sorter {
    
    abstract compare(leftIndex: number, rightIndex: number): boolean
    abstract swap(leftIndex: number, rightIndex: number): void
    abstract length: number    

    sort(): void{
        const {length}= this

        
        for(let i = 0; i < length; i++){
            for(let j= 0; j < length - i -1; j++){ 
              
           
                if(this.compare(j, j+1)){
                    this.swap(j, j+1)
                }
            }
        }
    }
}
~~~

- Debo llamar al super() dentro del constructor de las clases que heredan de Sorter

~~~js
import { Sorter } from "./Sort"

export class NumbersCollection extends Sorter{

    constructor(public data: number[]){
        super()
        
    }

    
    get length(): number{
        return this.data.length
    }


    swap(leftIndex:number, rightIndex:number):void{
        const leftHand = this.data[leftIndex]
        this.data[leftIndex] = this.data[rightIndex]
        this.data[rightIndex] = leftHand
    }

    compare(leftIndex: number,rightIndex: number): boolean{
        return this.data[leftIndex] > this.data[rightIndex]
    }
}
~~~

- Hago lo mismo con CharactersCollection
- Cómo LinkedList no tiene constructor no hace falta llamar al super
- Sorter.ts

~~~js
import { Sorter } from "./Sort";
import { NumbersCollection } from "./NumbersCollection";
import { CharactersCollection } from "./CharactersCollection";
import { LinkedList } from "./LinkedList";



const numbersCollection = new NumbersCollection([-2,3,1,29,6]) 
numbersCollection.sort()
console.log(numbersCollection.data)


const charactersCollection = new CharactersCollection('abdcFEHG')
charactersCollection.sort()
console.log(charactersCollection.data)

const linkedList = new LinkedList()

linkedList.add(500)
linkedList.add(-10)
linkedList.add(232)
linkedList.add(3)

linkedList.sort()
linkedList.print()
~~~

- Esto no significa que haya que usar las clases abstractas en lugar de las interfaces
- Las interfaces son super útiles
- Pero en este caso concreto era el ejemplo ideal para usar una clase abstracta
------

## Interfaces Vs Abstract Classes

- En este caso no necesitamos la interfaz
- Las interfaces establecen un contrato entre diferentes clases
  - Se usan cuando tengo varios objetos que quiero que trabajen juntos
  - Promueven el bajo acoplamiento
- Las clases abstractas/herencia también establece un contyrato entre diferentes clases
  - Se usa cuando trato de construir la definición de un objeto
  - Alto acoplamiento entre clases
- Tanto la clase Sorter como NumbersCollection y las otras dependen 100% mutuamente


