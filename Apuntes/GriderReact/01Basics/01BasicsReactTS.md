# Basics React Typescript Grider

- Cuando vamos a pasar props a un componente hijo, **defino una interfaz con las props que el hijo espera recibir**
- Creo dos componentes para el ejemplo: Parent y Child
- Creo la interfaz para las props del hijo. Desestructuro color

~~~js
interface ChildProps{
    color: string
}

export const Child = ({color}: ChildProps) => {
  return (
    <div>{color}</div>
  )
}

export default Child
~~~

- Parent component

~~~js
import Child from "./Child"


export const Parent = () => {
  return (
    <Child color="red"/>
  )
}

export default Parent
~~~

- Le paso el Parent Component a App.tsx para renderizarlo en pantalla
-----

## Explicit Component Type Annotations

- Todos los componentes de React pueden tener estas propiedades:
  - propTypes
  - displayName
  - defaultProps
  - contextTypes
- Por ejemplo, yo puedo decir que

> Child.displayName = "kjashks"

- Typescript no sabe que estamos creando un componente de React, por lo que piensa que Child no tiene esas propiedades
- React.FC, FC de Functional Component. Se puede escribir React.FunctionalComponent
  - Esta es otra manera de definir componentes en React con Typescript

~~~js
interface ChildProps{
    color: string
}

export const Child = ({color}: ChildProps) => {
  return (
    <div>{color}</div>
  )
}

export const ChildAsFC: React.FC<ChildProps>=({color})=>{
    return <div>{color}</div>
}
~~~

- De esta manera le decimos a Typescript:
  - Child será un componente de React
  - Child tendrá propiedades como propTypes o displayName
  - Child recibirá las propiedades de tipo ChildProps
- Esta manera de declarar componentes es útil cuando quiero acceder a las propiedades inherentes en todo componente de React
-------
 **NOTA:** Para la versión 18 de React, se removió como implícita la propiedad children de React.FC. Se debe incluir en la interfaz

## Annotations with Children

- Pongamos que le quiero pasar en el evento onClick del botón una función desde las propiedaes del componente

~~~js


interface ChildProps{
    color: string,
    onClick: ()=> void,
    children?: React.ReactNode
}


export const ChildAsFC: React.FC<ChildProps>=({color, onClick})=>{
    return(
        <div>
            {color}
            <button onClick={onClick}>Click me</button>
        </div>     

    )      
}
~~~
- Todo lo que coloque dentro del componente se considera **children**

~~~js
import {ChildAsFC} from "./Child"


export const Parent = () => {
  return (
    <ChildAsFC color="red" onClick={()=>console.log("hello!")}>

        Texto children----> children
    </ChildAsFC>
  )
}
~~~
- Con esta notación de React.FC no da error al agregar children ( con la primera manera si) porque lo soporta sin problema
- Si quiero usar children debo declararlo en la interfaz manualmente
- Child.tsx
 
~~~js
interface ChildProps{
    color: string,
    onClick: ()=> void,
    children?: React.ReactNode 
}

export const Child = ({color, onClick, children}: ChildProps)=>{
    return(
        <div>
            {color}
            {children}
            <button onClick={onClick}>Click me</button>
        </div>
    )
}

                                            
export const ChildAsFC: React.FC<ChildProps>=({color, onClick, children})=>{
    return(
        <div>
            {color}
            <button onClick={onClick}>Click me</button>
            <p>{children}</p>
        </div>     
    )      
}
~~~

- Parent.tsx

~~~js
import {ChildAsFC} from "./Child"


export const Parent = () => {
  return (
    <ChildAsFC color="red" onClick={()=>console.log("hello!")}>
     Texto children
    </ChildAsFC>
  )
}
~~~
-----

## State with Typescript

- Vamos a hacer una lista con un inupt y un botón e imprimirla en pantalla
- Todo dentro del mismo componente
- Si no voy a recibir props no hace falta colocar los brackets
- De esta manera escribe en pantalla lo que escribo en el input
- No hay mucha diferencia de un componente escrito con JS

~~~js
import { useState } from "react"


const List: React.FC = () => {

    const [name,setName]= useState('')

  return (
    <div>
        <h1>Party List</h1>
        <p>{name} </p>
        

        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button>Add</button>

    </div>
  )
}

export default List
~~~
----

## Type Inference with State

- Quizá deberíamos tener un array de strings que alamcene los nombres
- Creo un nuevo state, declaro que es un array de strings con los brackets
- Tomo una copia del array existente de guests y le añado el nombre
- Uso .map para recorrer guests dentro de una ul y con un return imprimo cada guest en un li ( no olvidar el  key!!)

~~~js
import { useState } from "react"


const List: React.FC = () => {

    const [name,setName]= useState('') //Si declaro un string vació en el state, Typescript infiere en el tipo del state

    const [guests, setGuests] = useState<string[]>([]) //asi le digo que mi state será un array de strings

    const handleGuests =()=>{
        setName('')

        setGuests([...guests, name]) //tomo el array existente de guests y le añado el nuevo nombre
    }

  return (
    <div>
        <h1>Party List</h1>

        <ul>     
            {guests.map((guest)=>{
               return <li key={guest}>{guest} </li>    
            })}

        </ul>
        
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={handleGuests}>Add</button>

    </div>
  )
}

export default List
~~~
--------

## More on state

- Vamos a crear un componente User Search
- El cascarón:

~~~js
const FindUser: React.FC = () => {
  return (
    <div>
        <h1>Find User</h1>

        <input type="text" />
        <button>Find</button>

        <div>

        </div>
    </div>
  )
}

export default FindUser
~~~

- Le añado una lista de usuarios hardcodeada
- Uso la función find con el array para encontrar el usuario.

~~~js
import { useState } from "react"

const users = [
    {name: 'Sara', age: 30},
    {name: 'Pere', age: 45},
    {name: 'Joan', age: 32},
    {name: 'Maria', age: 43},
]

const FindUser: React.FC = () => {

    const [name, setName]= useState('')

    const findUser = ()=>{
        const foundUser = users.find((user)=>{
            return user.name === name

        })
    }

  return (
    <div>
        <h1>Find User</h1>

        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={findUser}>Find</button>

        <div>

        </div>
    </div>
  )
}

export default FindUser
~~~

- Tengo que manejar si el usuario no existe
- Debo añadir otro state para almacenar el usuario
- user (como estado) puede ser undefined, o un objeto con name: string y age: number
- Utilizo el operador && para decirle que solo imprima user.name si user es un valor truthly

~~~js
import { useState } from "react"

const users = [
    {name: 'Sara', age: 30},
    {name: 'Pere', age: 45},
    {name: 'Joan', age: 32},
    {name: 'Maria', age: 43},
]

const FindUser: React.FC = () => {

    const [name, setName]= useState('')
    const [user, setUser] = useState<{name: string, age: number} | undefined>()

    const findUser = ()=>{
        const foundUser = users.find((user)=>{
            return user.name === name

        })

        setUser(foundUser)
    }

  return (
    <div>
        <h1>Find User</h1>

        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={findUser}>Find</button>

        <div>
            {user && user.name}
            {user && user.age}
        </div>
    </div>
  )
}

export default FindUser
~~~

- Si el usuario está definido imprimirá el nombre y la edad, si no no imprimirá nada
- 