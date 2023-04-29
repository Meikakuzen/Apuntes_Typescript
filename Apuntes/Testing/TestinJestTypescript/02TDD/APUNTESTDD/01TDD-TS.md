# 01 TEST DRIVEN DEVELOPMENT TYPESCRIPT

- Development driven by tests
- Con los proyectos grandes primero organizar lo básico, luego escribir los tests
- El TDD es genial cuando extiendes una app o arreglando bugs
  - Primero obtenemos un test en rojo (fail)
  - Pasamos a la siguiente fase de refactorización dónde arreglamos o agregamos lógica
  - El test pasa
-------

## Coding Katas - password checker

- Se habla de **katas** en lugar de ejercicios, pero es solo una licencia poética
- Si buscas coding katas encontrarás grandes ideas de desarrollo de software que efecyuar con TDD
- El proyecto con el que vamos a trabajar será un verificador de password
  - Iteración 1:
    - El password es invalido si:
      - tiene menos de 8 caracteres
      - si no tiene una mayúscula
      - si no tiene una minúscula
  - Iteración 2:
    - devuelve las razones por la invalidación
  - Iteración 3:
    - admin password debe contener un número
----

## Pass cheker setup

- Creo en /src/app/pass_checker/PasswordChecker.ts
- En /src/test/pass_checker/PasswordChecker.test.ts
- En el archivo de configuración de jest

~~~ts
import type {Config} from '@jest/types'


const baseDir ='<rootDir>/src/app/pass_checker'
const baseTestDir ='<rootDir>/src/test/pass_checker'

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: 'node',
    verbose: true, //mostrará mas info en la consola
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`
    ],
    testMatch: [
        `${baseTestDir}/**/*.ts`
    ]
}

export default config
~~~

- En el launch.json

~~~json
{
    // Use IntelliSense para saber los atributos posibles.
    // Mantenga el puntero para ver las descripciones de los existentes atributos.
    // Para más información, visite: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Jest Current File",
            "program": "${workspaceFolder}/node_modules/.bin/jest",
            "args": [
              "--runTestsByPath",
              "${relativeFile}",
              "--config",
              "jest.config.js"
            ],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "disableOptimisticBPs": true,
            "windows": {
              "program": "${workspaceFolder}/node_modules/jest/bin/jest",
            }
          }
    ]
}
~~~

- **NOTA** al usar coverage deshabilitamos --watch de package.json
- Creo la clase PasswordChecker en PasswordChecker.ts

~~~ts
export class PasswordChecker{

    public checkPassword(){
        
    }
}
~~~

- En PasswordChecker.test.ts

~~~js
import { PasswordChecker } from "../../app/pass_checker/PasswordChecker"

describe('PasswordChecker test suit', ()=>{

    let sut: PasswordChecker

    beforeEach(()=>{              //de esta manera me aseguro que la instancia va a ser independiente en cada test
        sut = new PasswordChecker
    })

    it('Should do nothing for the moment', ()=>{
        sut.checkPassword()
    })

})
~~~
-----

## Password checker iteration 1:

- Recuerda: debe tener al menos 8 caracteres, al menos una mayúscula y una minúscula
- Voy al PasswordChecker.ts


~~~js
export class PasswordChecker{

    public checkPassword(password: string): boolean{
        return true 
    }
}
~~~
- El password debe de ser de almenos 8 caracteres
- Todavía no he implementado la lógica en el método
- '123456' como password debería dar falso pero el test falla porque espera true

- PasswordChecker.test.ts

~~~js
import { PasswordChecker } from "../../app/pass_checker/PasswordChecker"

describe('PasswordChecker test suit', ()=>{

    let sut: PasswordChecker

    beforeEach(()=>{              //de esta manera me aseguro que la instancia va a ser independiente en cada test
        sut = new PasswordChecker
    })

    it('Password with less than 8 characters will be not valid', ()=>{
        const actual = sut.checkPassword('123456')

        expect(actual).toBe(false)
    })

})
~~~

- Añado la lógica

~~~js
export class PasswordChecker{

    public checkPassword(password: string): boolean{
        if(password.length < 8){
            return false
        }

        return true 
    }
}
~~~

- Ahora debo comprobar que si el password es mayor de 8 caracteres devuelva ok, porque me va a servir para operaciones futuras

~~~js
    it('Password with more than 8 is ok', ()=>{
        const actual = sut.checkPassword('12345678')

        expect(actual).toBe(true)
    })
~~~

- La siguiente iteración es comprobar si tiene una mayúscula

~~~js
  it('Password with no upper case letter is invalid', ()=>{
      const actual = sut.checkPassword('1234abcd') //es suficientemente largo pero no satisface la mayúscula

      expect(actual).toBe(false)
  })
~~~

- Comparo el password con doble igual a toLowerCase, en caso de ser igual es que no tiene mayúsculas

~~~js
export class PasswordChecker{

    public checkPassword(password: string): boolean{
        if(password.length < 8) return false
        if(password == password.toLowerCase()) return false

        return true 
    }
}
~~~

- Debo cambiar el password del test anterior con una mayúscula para que pase al siguiente test
- **NOTA** más adelante se arreglará

~~~js
    it('Password with more than 8 return ok', ()=>{
        const actual = sut.checkPassword('1234567A')

        expect(actual).toBe(true)
    })
    it('Password with no upper case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234abcd') //es suficientemente largo pero no satisface la mayúscula

        expect(actual).toBe(false)
    })
~~~

- Ahora le toca a que el password es invalido si no tiene al menos una minúscula
- Tengo que modificar los tests anteriores alternando minúsculas y mayúsculas para que pase
- PasswordChecker.ts

~~~js
import { PasswordChecker } from "../../app/pass_checker/PasswordChecker"

describe('PasswordChecker test suit', ()=>{

    let sut: PasswordChecker

    beforeEach(()=>{              //de esta manera me aseguro que la instancia va a ser independiente en cada test
        sut = new PasswordChecker
    })

    it('Password with less than 8 characters will be not valid', ()=>{
        const actual = sut.checkPassword('1234aB')

        expect(actual).toBe(false)
    })
    it('Password with more than 8 return ok', ()=>{
        const actual = sut.checkPassword('123456Abc')

        expect(actual).toBe(true)
    })
    it('Password with no upper case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234abcd') 

        expect(actual).toBe(false)
    })
    it('Password with upper case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCDd') 

        expect(actual).toBe(true)
    })
    it('Password with no lower case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234ABCD') 

        expect(actual).toBe(false)
    })
    it('Password with lower case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCd') 

        expect(actual).toBe(true)
    })

})
~~~

- PasswordChecker.ts

~~~js
export class PasswordChecker{

    public checkPassword(password: string): boolean{
        if(password.length < 8) return false
        if(password == password.toLowerCase()) return false
        if(password == password.toUpperCase()) return false
        

        return true 
    }
}
~~~

# EL PROBLEMA CON ESTA IMPLEMENTACIÓN ES QUE DEBO IR CAMBIANDO LOS TESTS ANTERIORES
# SI HUBIERA ALGÚN CAMBIO SERÍA MUY DIFICIL DE IMPLEMENTAR. USO INDISCRIMINADO DE IFS
------

## Segundo requerimiento

- Cuando tienes que hacer este tipo de modificaciones en tests anteriores es que algo estás haciendo mal
- Es necesario refactorizar y hacer los tests más fáciles
- Creo una interfaz y un enum para el array de la interfaz ( reasons )

~~~ts

export enum PasswordErrors {
    SHORT = "Password is too short",
    NO_UPPER_CASE = "Upper case letter required",
    NO_LOWER_CASE = "Lower case letter required"
}

export interface CheckResult{
    valid: boolean,
    reasons: PasswordErrors[]
}

export class PasswordChecker{

    public checkPassword(password: string): CheckResult{
        //de momento dejo los condicionales en blanco
        if(password.length < 8) 
        if(password == password.toLowerCase()) 
        if(password == password.toUpperCase())
        

        return {
            valid: true,
            reasons: []
        }
  }
}
~~~

- Marco con una x los it de los tests para ignorarlos
- Me quedo solo con el primero
- Le digo que actual.valid tiene que ser falso para que cumpla la condición de no ser mayor de 8 caracteres del test

~~~js
import { PasswordChecker } from "../../app/pass_checker/PasswordChecker"

describe('PasswordChecker test suit', ()=>{

    let sut: PasswordChecker

    beforeEach(()=>{              //de esta manera me aseguro que la instancia va a ser independiente en cada test
        sut = new PasswordChecker
    })

    it('Password with less than 8 characters will be not valid', ()=>{
        const actual = sut.checkPassword('1234aB')

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.SHORT)
    })
    xit('Password with more than 8 return ok', ()=>{
        const actual = sut.checkPassword('123456Abc')

        expect(actual).toBe(true)
    })
    xit('Password with no upper case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234abcd') 

        expect(actual).toBe(false)
    })
    xit('Password with upper case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCDd') 

        expect(actual).toBe(true)
    })
    xit('Password with no lower case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234ABCD') 

        expect(actual).toBe(false)
    })
    xit('Password with lower case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCd') 

        expect(actual).toBe(true)
    })

})
~~~

- Esta es una buena manera de aproximarse a los problemas 
  - es mejor que validar un string
- Por supuesto el test falla porque no hay implementada la lógica para que devuelva el mensaje de error de PasswordErrors.SHORT
- En el siguiente test le ponemos que **NO CONTENGA** el error de PasswordErrors.SHORT

~~~js
    it('Password with less than 8 characters will be not valid', ()=>{
        const actual = sut.checkPassword('1234aB')

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.SHORT)
    })
    it('Password with more than 8 return ok', ()=>{
        const actual = sut.checkPassword('123456Abc')

        expect(actual).toBe(true)
        expect(actual.reasons).not.toContain(PasswordErrors.SHORT)
    })
~~~

- Inicializo la variable reasons en el método de la clase
- Uso .push para que el arreglo contenga PasswordErrors.SHORT
- Utilizo un ternario para devolver false en caso de que haya errores en el arreglo

~~~js

export enum PasswordErrors {
    SHORT = "Password is too short",
    NO_UPPER_CASE = "Upper case letter required",
    NO_LOWER_CASE = "Lower case letter required"
}

export interface CheckResult{
    valid: boolean,
    reasons: PasswordErrors[]
}

export class PasswordChecker{

    public checkPassword(password: string): CheckResult{

        const reasons: PasswordErrors[] = [];

        if(password.length < 8) reasons.push(PasswordErrors.SHORT) 
        if(password == password.toLowerCase()){} 
        if(password == password.toUpperCase()){} //pongo las llaves pq si no pilla el return como si estuviera dentro del if
        

        return {
            valid: reasons.length > 0 ? false: true,
            reasons: reasons
        }
  }
}
~~~

- El mismo procedimiento. El password debe de tener al menos una mayúscula

~~~js
    it('Password with no upper case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234abcd') 

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE)
    })
    it('Password with upper case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCDd') 
        
        expect(actual.valid).toBe(true)
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE)
    })
~~~

- En PasswordChecker.ts, dentro del método

~~~js
export class PasswordChecker{

    public checkPassword(password: string): CheckResult{

        const reasons: PasswordErrors[] = [];

        if(password.length < 8) reasons.push(PasswordErrors.SHORT) 
        if(password == password.toLowerCase()) reasons.push(PasswordErrors.NO_UPPER_CASE)
        if(password == password.toUpperCase()) reasons.push(PasswordErrors.NO_LOWER_CASE)
        

        return {
            valid: reasons.length > 0 ? false: true,
            reasons: reasons
        }
  }
}
~~~

- La misma estrategia para la condición del lower case
- .test.ts

~~~js
    it('Password with no lower case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234ABCD') 

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE)
    })
    it('Password with lower case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCd') 
        
        expect(actual.valid).toBe(true)
        expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE)
    })
~~~

- PaswordChecker.ts

~~~js

export enum PasswordErrors {
    SHORT = "Password is too short",
    NO_UPPER_CASE = "Upper case letter required",
    NO_LOWER_CASE = "Lower case letter required"
}

export interface CheckResult{
    valid: boolean,
    reasons: PasswordErrors[]
}

export class PasswordChecker{

    public checkPassword(password: string): CheckResult{

        const reasons: PasswordErrors[] = [];

        if(password.length < 8) reasons.push(PasswordErrors.SHORT) 
        if(password == password.toLowerCase()) reasons.push(PasswordErrors.NO_UPPER_CASE)
        if(password == password.toUpperCase()) reasons.push(PasswordErrors.NO_LOWER_CASE)
        

        return {
            valid: reasons.length > 0 ? false: true,
            reasons: reasons
        }
  }
}
~~~

- Creo un test para dar el password por válido

~~~js
it("Complex password is valid", ()=>{
        const actual = sut.checkPassword('123456aB')

        expect(actual.valid).toBe(true)
        expect(actual.reasons).toEqual([])
    })
~~~
------

## Iteration 3

- Vamos a hacer un poco de refactor
- También falta la última iteración que determina que el password debe llevar un número
- En lugar de usar ifs usaré métodos privados

~~~js

export enum PasswordErrors {
    SHORT = "Password is too short",
    NO_UPPER_CASE = "Upper case letter required",
    NO_LOWER_CASE = "Lower case letter required"
}

export interface CheckResult{
    valid: boolean,
    reasons: PasswordErrors[]
}

export class PasswordChecker{

    public checkPassword(password: string): CheckResult{

        const reasons: PasswordErrors[] = [];

            this.checkForLength(password, reasons)
            this.checkForUpperCase(password, reasons)
            this.checkForLowerCase(password, reasons) 

        return {
            valid: reasons.length > 0 ? false: true,
            reasons: reasons
        }
  }

  private checkForLength(password: string, reasons: PasswordErrors[]){

    if(password.length < 8) reasons.push(PasswordErrors.SHORT) 

  }

  private checkForUpperCase(password: string, reasons:PasswordErrors[]){
    if(password == password.toLowerCase()) reasons.push(PasswordErrors.NO_UPPER_CASE)
  }

  private checkForLowerCase(password: string, reasons:PasswordErrors[]){
    if(password == password.toUpperrCase()) reasons.push(PasswordErrors.NO_LOWER_CASE)
  }

}
~~~

- De esta manera, si queremos extender la funcionalidad solo tenemos que agregar un nuevo caso al enum
- El NO_NUMBER
- Escribo los tests

~~~js
it("Admin password with no number is invalid", ()=>{
        const actual = sut.checkAdminPassword('ABCDKJHJDLHDsljdh')

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER)
    })
it("Admin password with  number is ok", ()=>{
    const actual = sut.checAdminPassword('ABCDKJHJDLHDsljdh9')

    expect(actual.valid).toBe(true)
    expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER)
})
~~~

- Implemento la lógica en PasswordChecker.ts
- Uso checkPassword para hacer todas las validaciones y lo guardo en una constante basicCheck
- Llamo al método que he creado number donde miro si el password tiene un numero con una expresión regular 
- Si no lo tiene uso el .push para mandar el error al array de reasons que hay en el basicCheck que he hecho primero
- Debo devolver un objeto de tipo CheckResult
- Uso un ternario en valid para devolver true o false según tenga o no elementos en el array de errores

~~~js

export enum PasswordErrors {
    SHORT = "Password is too short",
    NO_UPPER_CASE = "Upper case letter required",
    NO_LOWER_CASE = "Lower case letter required",
    NO_NUMBER = "At least one number is required"
}

export interface CheckResult{
    valid: boolean,
    reasons: PasswordErrors[]
}

export class PasswordChecker{

    public checkPassword(password: string): CheckResult{

        const reasons: PasswordErrors[] = [];

            this.checkForLength(password, reasons)
            this.checkForUpperCase(password, reasons)
            this.checkForLowerCase(password, reasons) 

        return {
            valid: reasons.length > 0 ? false: true,
            reasons: reasons
        }
  }

  private checkForLength(password: string, reasons: PasswordErrors[]){

    if(password.length < 8) reasons.push(PasswordErrors.SHORT) 

  }

  private checkForUpperCase(password: string, reasons:PasswordErrors[]){
    if(password == password.toLowerCase()) reasons.push(PasswordErrors.NO_UPPER_CASE)
  }

  private checkForLowerCase(password: string, reasons:PasswordErrors[]){
    if(password == password.toUpperCase()) reasons.push(PasswordErrors.NO_LOWER_CASE)
  }

  //Check Admin Password

  public checkAdminPassword(password: string): CheckResult{
        const basicCheck = this.checkPassword(password)
        this.checkForNumber(password, basicCheck.reasons)
        return{
            valid: basicCheck.reasons.length > 0 ? false: true,
            reasons: basicCheck.reasons
        }
  }

  private checkForNumber(password: string, reasons: PasswordErrors[]){
        const hasNumber = /\d/  //expresión regular
        if(!hasNumber.test(password)) reasons.push(PasswordErrors.NO_NUMBER)
  }


}
~~~