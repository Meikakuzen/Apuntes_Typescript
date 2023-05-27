# Web Framework

- Usar npx parcel para crear el proyecto
    - Creo un index.html, le enlazo el index.ts
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <script src="./src/index.ts"></script>
</body>
</html>
~~~

## Parcel Setup

- Uso parcel (detecta automaticamente que hay un index.html y un index.ts que convertirá a js)

> npx parcel index.html

- Esto construye la aplicación corriendo en el servidor localhost:1234
- Tengo un console.log("hello world!") en index.ts, compruebo en la consola del navegador que esté todo correcto
- Si voy a la pestaña elements de la consolad el navegador, veré como parcel ha añadido un archivo.js al html en lugar del index.ts
- En el package.json, en scripts, añado "parcel index.html"
-----

## Framework Structure

- Vamos a tener dos tipos de clases
  - Model classes: para manejar data, para representar usuarios, Blog Posts, imágenes...
  - View classes: para manejar HTML y eventos causados por el usuario (como clicks)
- Enfoquémonos en la Model class, algo que represente la data o alguna cosa dentro de la app
- En el mock de la app podemos observar cómo se trata de un usuario

~~~html
User Detail

name: Sam

age: 20

----------------
|_____(name)___|    (button UpdateName)  (button setRandomAge)  (button Save) 
~~~

- Viendo esto claramente necesito una clase que represente a User y toda su data (name, age)
- Esta clase necesita tener la habilidad de almacenar cierta información, entregarla y cambiarla
- Se espera que cuando presione los botones de updateName o setRandomAge, cambie el HTML
- Entonces la clase debería tenr la habilidad de detectar que hay data que ha cambiado y notificar al resto
- También debe poder guardar la data de forma persistente en un servidor de fuera, y devolverla en algún punto futuro
- **Extraction Approach**:
  - Construir una mega clase User con toneladas de métodos
  - Refactorizar con composicion
  - Refactorizar User a codigo reutilizable que pueda representar cualquier tipo de data, no solo User 
- Voy a representar la clase User a modo de interfaz para explicar USER:

~~~js
interface User{
    private data: UserProps, //para almacenar la info de User
    get(propName:string): (string | number), //Obtiene info de User, name o age
    set(update: UserProps): void, //Setea info de User, name o age
    on(eventName: string, callback: ()=>{}), // registra un evento con este objeto, así puede notificar a otras partes que algo cambió
    trigger(eventName: string): void, //dispara un evento que comunica a otras partes que algo cambió
    fetch(): Promise, //fetch en el server sobre alguna data de algún User en particular
    save(): Promise //Salva la data de este usuario en el server

}
~~~
----

## Retrieving User Properties

- Vamos a crear la clase User con su get y set
- Creo /src/models
- Como para crear un User voy a necesitar un objeto con name y age lo creo en el constructor
- La data la creo privada porque no quiero que otros ingenieros puedan manejarla externamente
- En lugar de hacerlo como aquí abajo, usaré una interfaz

~~~js
export class User{
    constructor(private data: {name: string, age: number}){}

}
~~~

- Con la interfaz, el get y el set 

~~~js
interface UserProps {
    name: string
    age: number
}

export class User{
    constructor(private data: UserProps){}

    get(propName : string): string | number{
        return this.data[propName]
    }

}
~~~
----

## Optional Interface properties

- Vamos a implementar el método set
- Puede ser que solo se quiera actualizar el name o la age
- Puede ser que solo quiera actualizar un valor, por lo que uso ? en la interfaz
  - Esto podría ocasionar que user.set({}) vacío no marque error, pero esto se le puede permitir al código, no rompe nada
- No retorno nada

~~~js
interface UserProps {
    name?: string
    age?: number
}

export class User{
    constructor(private data: UserProps){}

    get(propName : string): string | number{
        return this.data[propName]
    }

    set(update: UserProps): void{
        Object.assign(this.data, update) //toma los valores de update y los copia en this.data
    }

}
~~~

- En index.ts puedo hacer una nueva instancia y comprobar que todo esté bien

~~~js
import { User } from "./models/User";


const user = new User({name: "John", age: 20})


console.log(user.get("name"))

user.set({name: "Petri", age: 29})

console.log(user.get("name"))
console.log(user.get("age"))
~~~
-----

## An Eventing System

- Vamos al método on y trigger
- Se usarán los eventos en JavaScript como .addEventListener('click', ()=>{})
- Como primer parámetro del on() le pasaré el nombre del evento, y el segundo argumento será un callback
  - Necesitamos la habilidad de decir: "Oh, algo ha pasado, necesito ejecutar algo relacionado a ese evento" 
  - trigger() se encargará de ejecutar todas las funciones del callback registrado en on()
----

## Listener Support

- Creo el tipo callback con una función vacía para que mi código quede más claro y no tener que escribir esto
- Queda confuso
~~~js
    on(eventName: string, callback: ()=>{}) {

    }
~~~

- Mejor crear un tipo

~~~js
interface UserProps {
    name?: string
    age?: number
}


//tipo que creo para tener un código más legible
type Callback = ()=>{}

export class User{
    constructor(private data: UserProps){}

    get(propName : string): string | number{
        return this.data[propName]
    }

    set(update: UserProps): void{
        Object.assign(this.data, update) //toma los valores de update y los copia en this.data
    }

    on(eventName: string, callback: Callback){

    }
}
~~~

- Ahora necesito una manera de almacenar estos eventos
- Le pasamos el nombre del evento por el que vamos a estar a la escucha
- Hay muchos tipos de eventos: click, por ejemplo, hover, mouseup, etc
------

## Storing Event Listeners

- 