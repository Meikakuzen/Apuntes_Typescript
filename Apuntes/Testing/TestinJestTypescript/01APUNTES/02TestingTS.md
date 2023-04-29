## INTERMEDIATE TESTING TOPICS TS

- F.I.R.S.T principles
- Jest hooks - how to structure tests
- Test for errors
- Jest aliases
- Debugging
- Coverage
-----

## F.I.R.S.T principles

- **Fast** 
  - el test debe de ser rápido. Es sinónimo de saber pronto si hay alguna anomalía
- **Independent** (Isolated) - Deben estar aislados los unos de los otros, no compartirse con otros, el orden no importa.
  - Se contradice con el principio Fast ya que los tests individuales toman más tiempo
- **Repeteable**
  - Mismo resultado con mismo input. Con valores random se suele mockear. Un ejemplo son los tests que escriben en DB
  - En contradicción con el principio Fast necesita mas setup y operaciones
- **Self-validating**
  - Los tests dan un resultado claro. PASS/FAIL
- **Thorough**
    - Cubre todos los casos/escenarios
    - Happy paths, bad paths, edge cases
    - Invalid input
    - Large values
    - Tener un 100% cubierto no es un gran indicador. No hace falta testearlo todo
------

## Jest hooks

- Creo una clase en Utils.ts

~~~js
export class StringUtils{
    public toUpperCase(arg: string){
        return toUpperCase(arg)
    }
}
~~~

- Creo otro test con describe para testear la clase

~~~js
    describe("String utils test", ()=>{
        it('Should return correct upperCase', ()=>{
            const sut = new StringUtils

            const actual = sut.toUpperCase('abc')

            expect(actual).toBe('ABC')
        })
    })
~~~

- Tengo otras maneras de testearlo
- Tengo el hook beforeEach que se suele usar para hacer el setup
- Declaro la variable en el describe para tenerla disponible en el scope
- Creo la instancia en el beforeEach
- Con beforeAll puedo iniciar una conexión con una DB y destruirla con afterAll
- Los hooks solo son utiles dentro del mismo describe

~~~js
    describe.only("String utils test", ()=>{
        let sut: StringUtils

        beforeEach(()=>{
         sut = new StringUtils()

        })

        afterEach(()=>{
            console.log('TearDown')
        })

        it('Should return correct upperCase', ()=>{


            const actual = sut.toUpperCase('abc')

            expect(actual).toBe('ABC')
        })
    })
~~~
-----

## Testing for errors

- Hagamos un check a la clase StringUtils de que hace si le paso un string vacío o undefined

~~~js
export class StringUtils{
    public toUpperCase(arg: string){

        if(!arg){
            throw new Error('Invalid argument!')
        }

        return toUpperCase(arg)
    }
}
~~~

- Vamos al test

~~~js
 describe.only("String utils test", ()=>{
        let sut: StringUtils

        beforeEach(()=>{
            sut = new StringUtils()

        })

        it('Should return correct upperCase', ()=>{


            const actual = sut.toUpperCase('abc')
            
            expect(actual).toBe('ABC')
        })
        it.only('Should throw an error on invalid argument', ()=>{

            //una manera de testear un error es meterlo dentro de una función
            function expectError(){
                const actual = sut.toUpperCase('')
            }
            expect(expectError).toThrow()
            expect(expectError).toThrowError('Invalid argument!')  
        })
    })
~~~

- Puedo usar una arrow function

~~~js
it.only('Should throw an error on invalid argument', ()=>{
    //también se puede con una arrow function
    
    expect(()=>{
    sut.toUpperCase('')
    }).toThrow()
     
    expect(()=>{
            sut.toUpperCase('')
            }).toThrowError('Invalid argument!')
    
})
~~~

- Puedo meterlo en un try y un catch

~~~js
 it.only('Should throw an error on invalid argument- try catch', ()=>{
            //también puedo meterlo en un try y un catch

            try {
                sut.toUpperCase('')
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect(error).toHaveProperty('message', 'Invalid argument!')
            }
        })
~~~

- Hay discusión de si esta es una manera correcta de hacer le test
- Si no hay error no entrará en el catch y el test pasará igual
- Puedo arreglarlo con la función fail de jest 
- **NOTa**: hay un bug con fail debo pasarle el argumento **done** que es un callback
~~~js
it.only('Should throw an error on invalid argument- try catch', (done)=>{
    
    try {
        sut.toUpperCase('')
        done('GetStringInfo should show error for invalid arg!') // si hay error mostrará este mensaje
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', 'Invalid argument!')
        done() // debo pasar el done cuando acaba el test
    }
})       
~~~
-------

## Jest Aliases and watch mode

- Los tests tienen propiedades
  - Puedo añadir **.only** al describe y/o al test para que haga solo uno
  - También puedo usar **.skip** para que los salte
  - Existe **.concurrent** ( experimental )
  - **.todo** sirve para hacer un esqueleto del test. En la consola aparecerá como todo
- Los tests tienen varios alias
  - it - standard
  - test - standard
  - xit - salta el test === it.skip
  - fit - es sinónimo de it.only
- Para usar el --watch debo añadirlo en el package.json

>   "scripts": {"test": "jest --watch"}
----------

## Debugg en VsCode

- microsoft/vscode-recipes
- En la carpeta debugging-jest-tests
- Copia el objeto de Jest Current File ( el segundo )
- En VsCode --> Run and Debug (el icono de la mariquita con el play )
  - Clic en configurar JSON y copiar el objeto
~~~json
    {"version": "0.2.0",
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
              "jest.config.ts"
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

- Debo añadirle el puntito rojo en la columna izquierda de los numeros
- En la columna izquierda del inspector me aparecen variables, inspeccion, pila de llamadas y puntos de interrupción
- Le doy al play de Jest Current File (arriba del inspector)
- Si le doy al play con una rayita en el left resumo
- La flechita hacia adelante con el puntito me lleva al siguiente paso del flujo del test
-----

## Coverage

- Coverage significa covertura
- Para ello añado dos parámetrosen el jest.configuration

~~~js
import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: 'node',
    verbose: true, //mostrará mñas info en la consola
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/app/**/*.ts'
    ] // debe de ser un array
}

export default config
~~~

- Esta función no marcha bien con el --watch, lo remuevo
- El resultado es

~~~
PASS  src/test/Utils.test.ts                                                                                                                                           
  Utils test suit
    ○ skipped should return uppercase of valid string                                                                                                                   
    String utils test                                                                                                                                                   
      √ Should throw an error on invalid argument- try catch (1 ms)                                                                                                     
      ○ skipped Should return correct upperCase                                                                                                                         
      ○ skipped Should throw an error on invalid argument- arrow function                                                                                               
    getStringInfo for arg My-String
      ○ skipped return right length                                                                                                                                     
      ○ skipped return right lower case                                                                                                                                 
      ○ skipped return right upper case                                                                                                                                 
      ○ skipped return right characters
      ○ skipped return defined extraInfo                                                                                                                                
      ○ skipped return right extra Info                                                                                                                                 
      ToUpperCase examples                                                                                                                                              
        ○ skipped abc toUpperCase should be ABC                                                                                                                         
        ○ skipped def toUpperCase should be DEF                                                                                                                         
        ○ skipped my-String toUpperCase should be MY-STRING                                                                                                             
                                                                                                                                                                        
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |    62.5 |      100 |   33.33 |    62.5 | 
 Utils.ts |    62.5 |      100 |   33.33 |    62.5 | 9,15,27
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       12 skipped, 1 passed, 13 total
Snapshots:   0 total
Time:        1.576 s
Ran all test suites.
~~~

- Ha creado la carpeta coverage. La añado al gitignore
- No esta al 100 % verde porque tengo describes y tests con .only
- Puedo ver el resultado de los tests en el index.html en coverage/Icov-report/index.html
- Las partes de código no cubiertas en los tests aparecen en rojo
- A veces puedes necesitar ignorar código de tus tests
  - Para ello puedes buscar istanbul ignore en google

> /* istanbul ignore next  */

- Con esta linea de código ignorará el código siguiente en el coverage( lo hago en el archivo de lógica, Utils.ts)
- **NOTA** Esta configuración se suele usar cuando ya está todo hecho, ya que omite info y no permite el --watch