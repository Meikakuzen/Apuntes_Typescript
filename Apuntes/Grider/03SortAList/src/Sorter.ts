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



