# 01 TESTING TS 

## Configuración entorno de trabajo

- Instalo con npm i -D typescript jest ts-jest @types/jest ts-node
- Uso npx ts-jest config:init para crear el archivo de configuración de jest
- Este crea un archivo javascript, **lo borro**
- Creo el archivo jest.config.ts

~~~ts
import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: 'node',
    verbose: true //mostrará mñas info en la consola
}

export default config
~~~

- Creo la carpeta src en la raíz con dos subcarpetas: app y test
- Creo en app el archivo Utils.ts

~~~js
export function toUpperCase(arg: string): string{
    return arg.toUpperCase()
}
~~~

- Vamos a testearlo!
- Creo en test el archivo Utils.test.ts
- Uso describe con la descripción como primer argumento y dentro del callback como segundo argumento la lógica
- Puedo llamarlo test o it

~~~ts
import { toUpperCase } from "../app/Utils"

describe("Utils test suit", ()=>{

    test("should return uppercase", ()=>{
        const result = toUpperCase('abc')

        expect(result).toBe('ABC')

    })
})
~~~

- Veamos si funciona!
- Configuro en el package.json el script para llamarlo desde la consola

> "test": "jest"

- Uso npm test en la consola
- Para solucionar el warning de imports necesito el archivo de configuración de typescript y cambiar esModuleInterop a true
- Creo el archivo tsconfig.json y le añado el objeto con la propiedad en true

~~~json
{
    "compilerOptions":{
        "esModuleInterop": true
    }
}
~~~

- Ya no está el warning y esl test pasa!
----

## Estructura de un unit test

- La estructura de un test sigue los principios AAA ( en inglés ) por convención
  - Arrange: poner en orden lo que necesito para el test
  - Act: el test en acción
  - Assert: afirmación

- Puedo usar it en lugar de test
- En la sección de arrange coloco una referencia a la función toUpperCase, uso sut (por convención)
- En act coloco la acción
- En assert la afirmación de lo que se espera

~~~js
import { toUpperCase } from "../app/Utils"

describe("Utils test suit", ()=>{

    it("should return uppercase of valid string", ()=>{
        //arrange
        const sut = toUpperCase;
        const expected = 'ABC'

        //act
        const actual = toUpperCase('abc')

        // assert
        expect(actual).toBe(expected)

    })
})
~~~

- No hace falta colocar //arrange //act, si colocamos espacios la persona que lea los tests va a saber a que parte corresponde cada linea
------

## Jest assertions and matchers

- toBe es uno de los Jest.Matchers más básicos
- Creo un tipo en Utils.ts y una función con la que testear después

~~~ts
export function toUpperCase(arg: string): string{
    return arg.toUpperCase()
}

export type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}

export function getStringInfo(arg: string): stringInfo{
    return {
        lowerCase: arg.toLowerCase(),
        upperCase: arg.toUpperCase(),
        characters: Array.from(arg),
        length: arg.length,
        extraInfo: {}
    }
}
~~~

- Utils.test.ts

~~~js
import { getStringInfo, toUpperCase } from "../app/Utils"

describe("Utils test suit", ()=>{

    it("should return uppercase of valid string", ()=>{
        //arrange
        const sut = toUpperCase;
        const expected = 'ABC'

        //act
        const actual = toUpperCase('abc')

        // assert
        expect(actual).toBe(expected)

    })

    it("should return info for valid string", ()=>{
        const actual = getStringInfo('My String')

        expect(actual.lowerCase).toBe("my string") //para primitivos uso ToBe
        expect(actual.extraInfo).toEqual({})      //para los objetos se usa toEqual
        expect(actual.upperCase).toBe("MY STRING")

        //puedo usar .length
        expect(actual.characters.length).toBe(9)
        //pero tengo un método más limpio para lo mismo
        expect(actual.characters).toHaveLength(9)

        expect(actual.characters).toContain<string>('M') //pass

        //A veces no tenemos claro el orden de los elementos
        expect(actual.characters).toEqual(
            expect.arrayContaining(['S', 't', 'r', 'i', 'n', 'g', 'M', 'y'])
        )
        
        //puedo usar not para negar una condición
        expect(actual.extraInfo).not.toBe(undefined)
        //tengo dos métodos para expresar mejor esto
        expect(actual.extraInfo).not.toBeUndefined()
        expect(actual.extraInfo).toBeDefined()
        //cuando no estás seguro de qué te devuelve pero tiene que devolver algo
        expect(actual.extraInfo).toBeTruthy()    
        
        
        expect(actual.length).toBe(9)


    
    })
})
~~~
-----

## TESTS de Estructura Múltiple

- Es recomendable no escribir tests con tantos expects, solo con unos pocos

~~~js
import { getStringInfo, toUpperCase } from "../app/Utils"

describe("Utils test suit", ()=>{

    it("should return uppercase of valid string", ()=>{
        //arrange
        const sut = toUpperCase;
        const expected = 'ABC'

        //act
        const actual = toUpperCase('abc')

        // assert
        expect(actual).toBe(expected)

    })

    describe('getStringInfo for arg My-String', ()=>{
        test('return right length', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.characters).toHaveLength(9)
        })
        test('return right lower case', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.lowerCase).toBe('my-string')
        })
        test('return right upper case', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.upperCase).toBe('MY-STRING')
        })
        test('return right characters', ()=>{
            const actual = getStringInfo('My-String')
            
            expect(actual.characters).toContain<string>('M')
            expect(actual.characters).toStrictEqual(['M', 'y', '-','S', 't', 'r', 'i', 'n', 'g'])
            expect(actual.characters).toEqual(
                expect.arrayContaining(['S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
            )        
        })

        test('return defined extraInfo', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.extraInfo).not.toBe(undefined)
            expect(actual.extraInfo).not.toBeUndefined()
            expect(actual.extraInfo).toBeDefined()
        
        })
        test('return right extra Info', ()=>{
            const actual = getStringInfo('My-String')
        expect(actual.extraInfo).toEqual({})
        expect(actual.extraInfo).toBeTruthy()

        })
    })
  
})
~~~
-----

## Tests Parametrizados

- Para diferentes casos de uso de un mismo método a examinar puedo usar each
- Uso only para testear solo este test
- En el array del each le paso los casos diferentes de input y lo expected
- Uso $ en la descripción para que imprima en consola el input y lo expected
- Paso input y expected como paràmetros dentro de un objeto (desestructuración)

~~~js
describe.only('ToUpperCase examples', ()=>{  //uso only para testear solo esto
    it.each([
        {input: 'abc', expected: 'ABC'},
        {input: 'def', expected: 'DEF'},
        {input: 'my-String', expected: 'MY-STRING'}
    ])('$input toUpperCase should be $expected', ({input,expected})=>{
        const actual = toUpperCase(input)

        expect(actual).toBe(expected)
    })
})
~~~


