import { Sorter } from "./Sort";

class Node{

    next: Node | null= null; // no referencia a ninguno, empieza en null

    constructor(public data: number){

    }
}

export class LinkedList extends Sorter{

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

        let node: Node | null = this.head
        while(node){
            console.log(node.data)
            node = node.next
        }
    }

}