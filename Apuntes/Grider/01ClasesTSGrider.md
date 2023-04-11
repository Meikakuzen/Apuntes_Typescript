# 01 Clases Typescript Grider

- Puedo llamar un método privado dentro de la clase
- Con protected hago accesible el método solo a la herencia

~~~ts
class Vehicle {

    protected honk(): void{
        console.log("meeec!")
    }
}

//const automovil = new Vehicle();

//automovil.honk() //error. Con protected los métodos solo son accesibles mediante la herencia

class Car extends Vehicle {

    private starter():void{
        console.log("Start the car")
    }

    public processStarter(): void{
        this.starter();
    }
}

const Cupra = new Car();

Cupra.honk()// meeeec
~~~

## Campos

~~~ts
class Vehicle {
    color: string = 'red';

    protected honk(): void{
        console.log("meeec!")
    }
}
// Para especificar el color al instanciar la clase uso el constructor

class Vehicle {

    color: string // si no inicializo aquí la variable debo hacerlo en el constructor con el this

    constructor(color: string){
        this.color = color
    }

    protected honk(): void{
        console.log("meeec!")
    }
}

const vehicle = new Vehicle("orange");

console.log(vehicle.color) // orange
~~~

- Puedo resumir este proceso de definir la variable, iniciarla, etc, añadiendo public a la propiedad del constructor
- Si uso private no voy a poder leer la variable desde la instancia de la clase, tendré que declarar algún método
- También puedo usar protected
~~~ts
class Vehicle {
   
   constructor(public color: string){ // public puede usarse en campos también. de esta manera no tengo que declarar ni inicializar la variable

    }
}
~~~
----

## Campos y herencia

- Si Car no tiene constructor llamará el constructor de Vehicle y al instanciar Car tendré que pasarle el color como parámetro
~~~ts
class Vehicle {
   
   constructor(public color: string){ 

    }
}

class Car {
    constructor(public wheels: number, public color: string){
        super(color);

    }
}

const Cupra = new Car (4, 'red')
~~~
---

- Con las interfaces y las clases obtendremos verdadero código rehusable
  
