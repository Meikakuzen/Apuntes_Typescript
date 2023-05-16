# FOOTBALL TS GRIDER

> npm init -y
> tsc --init
> npm i nodemon concurrently

- Creo las carpetas src y build en la raíz
- Creo src/index.ts
- Configuro el tsconfig. habilito rootDir y outDir

~~~json
"rootDir": "./src",
"outDir": "./build",
~~~

- Configuro los scripts en package.json

~~~json
  "scripts": {
    "start:build": "tsc -w", //typescript compiler in watch mode
    "start:run": "nodemon build/index.js",
    "start": "concurrently npm:start:*" //ejecuto los dos scripts a la vez con concurrently
  },
~~~

- La primera vez que ejecuto el script da error por que no tengo nada. 
- Agrego un console.log('') en el /src/index.ts y vuelvo a ejecutar npm start (2 veces)
----

## Type Definition Files

- Vamos a cargar la info del CSV(con resultados de fútbol), parsear la info, analizarla y sacar un resumen
- La info para cargar/leer un CSV está en nodejs.org/api/fs.html  en fs.readFileSync
- readFileSync devolverá en un string toda la info del CSV
- Hay que parsearlo a json
- Para no tener el error al importar fs from 'fs' instalo los tipos de node
> npm i @types/node
-------

## Leer el CSV

- Uso split('\n') para que me devuelva un array de strings ( que devuelva cada string separado por un salto de linea dentro de un array)
- Hago un map + split para devolver en arreglos por separado los strings separados por comas
- src/index.ts

~~~js
import fs from 'fs'

//me devuelve un string con todo el archivo
const matches = fs.readFileSync("./data/football.csv",{
    encoding: 'utf8', // si espero texto lo codeo a utf-8
    })
    .split('\n') //separo strings por saltos de linea. Devuelve un array
    .map((row: string): string[]=>{
        return row.split(',') //devuelve cada string en un array, separando las palabras por coma (cada coma en el archivo un string)
  })
console.log(matches)
~~~

- Esto devuelve la data así

> [ '28/10/2018', 'Man United', 'Everton', '2', '1', 'H', 'J Moss' ]
-----

## Analisis de la data

- **NOTA**: PRIMERO VAMOS A HACER BAD CODE PARA LUEGO IR REDISEÑANDO LA FUNCIONALIDAD CON PROPIEDADES DE TYPESCRIPT PASO A PASO 
- El segundo parámetro empezando por el final es H para cuando el equipo HOME gana y A para cuando AWAY HOME gana (cuando el equipo visitante gana)
- Centrémonos en Manchester United 
- Creo un contador para incrementar 1 por cada victoria
- Hago un for of para que recorra cada match en matches
- Ahora dispongo de la fecha en el index 0, el nombre del equipo HOME en el indice 1, el equipo visitante en el índice 2 el HOME o AWAY HOME en el 5, etc

~~~js
import fs from 'fs'

//me devuelve un string con todo el archivo
const matches = fs.readFileSync("./data/football.csv",{
    encoding: 'utf8', // si espero texto lo codeo a utf-8
    })
    .split('\n')
    .map((row: string): string[]=>{
        return row.split(',')
  })

let manUnitedWins= 0 //contador para que incremente en 1 cada vez que gana Manchester United

for(let match of matches){
    if(match[1] === "Man United" && match[5]==="H"){
        manUnitedWins++
    }else if(match[2]=== 'Man United' && match[5]==="A"){
        manUnitedWins ++
    }
}

console.log(`Manchester United won ${manUnitedWins} games`)
~~~
----

## Losing data set context

- La lista de errores que vamos a ir solucionando es
  - Comparaciones de strings mágicas
  - La fuente de la data está hardcodeada
  - El tipo de dato del array es todo strings, incluso si son números
  - La variable es llamada com un equipo específico
  - El tipo del análisis es fijo
  - No hay la opción de dar el output en diferentes formatos
-----

- Este tipo de comparación es muy poco clara. Es incomprensible para alguien que lee nuestro código

~~~js
match[5]==="H"
~~~

- Puedo usar una variable para no hardcodear la H o la A
- Pero también puedo tener la D que es de empate y no lo estoy reflejando en el código
- Si dejara la D como variable sin usar, alguien podría venir y borrarla
- Para solucionar esto uso enum
-----

## Using Enums

- Uso enum para definir una serie de valores relacionados

~~~js
enum MatchResult{
    HomeWin= 'H',
    AwayWin= 'A',
    Draw = 'D' //empate
}

for(let match of matches){
    if(match[1] === "Man United" && match[5]===MatchResult.HomeWin){
        manUnitedWins++
    }else if(match[2]=== 'Man United' && match[5]===MatchResult.AwayWin){
        manUnitedWins ++
    }
}
~~~
----

## When to use enums

- Con los enum se usa la misma sintaxis que los objetos
- Puedo definir un enum sin declarar sus valores
- Crea un objeto cuando transpila a JS
- La meta principal es definir que esos valores están relacionados
- Usar cuando hay unos pocos valores fijos que están relacionados
  - Algunos ejemplos son:
    - Los colores primarios de un picker
    - Tamaños de una bebida en un menú, etc
  - No se usaría para reflejar muchos valores o valores que vayan a cambiar
-----

## Extracting CSV Reading

- La lógica para extraer la info del archivo está hardcodedada.
- Si quisiera hacer algún cambio tendría que hacer cambios significativos en el código
- Creo una clase CsvFileReader con los campos filename y data y el método read

~~~js
import fs from 'fs'

export class CsvFileReader{
    
    data: string[][] = []  //creo un array bidimensional para poder acceder a cada array dentro del array general

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
          })
    }

}
~~~

- en index.ts

~~~js
import { CsvFileReader } from "./CsvFileReader"

const reader = new CsvFileReader('./data/football.csv')
reader.read()

let manUnitedWins= 0 //contador para que incremente en 1 cada vez que gana Manchester United

enum MatchResult{
    HomeWin= 'H',
    AwayWin= 'A',
    Draw = 'D' //empate
}

for(let match of reader.data){
    if(match[1] === "Man United" && match[5]===MatchResult.HomeWin){
        manUnitedWins++
    }else if(match[2]=== 'Man United' && match[5]===MatchResult.AwayWin){
        manUnitedWins ++
    }
}

console.log(`Manchester United won ${manUnitedWins} games`)
~~~
-----

## Data Types

- Ahora el problema es que la data de los arrays es todo strings, aún cuando son números
- Tambien tenemos fechas en el indice 0 de cada array
- Si desgloso los tipos por cada item del array me queda
  - 0: Date (parseDate)
  - 1: string
  - 2: string
  - 3: number (parseInt)
  - 4: number (parseInt)
  - 5: MatchResult
  - 6: string
----

## Converting data strings to Date

- Date funciona así

~~~js
new Date(2020,0,1)  // yyyy/mm/dd  2020-01-01 1 de enero de 2020
~~~

- Creo un nuevo archivo llamado utils.ts dónde crear la lógica de parseo de la data

~~~js
export const dateStringTodate = (dateString: string): Date=>{
    const dateParts = dateString.split('/').map((value:string):number=>{
        return parseInt(value)
    })
    
    return new Date(dateParts[2],dateParts[1]-1, dateParts[0]) //- 1 porque Enero es 0

}
~~~
----

## Converting row values

- Encadeno otro map
- Parseo la data, la retorno como un arreglo para trabajar con ella

~~~js
import fs from 'fs'
import { dateStringTodate } from './utils'

export class CsvFileReader{
    
    data: string[][] = []

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
          }).map((row: string[]): any=>{
            return [
                dateStringTodate(row[0]),
                row[1],
                row[2],
                parseInt(row[3]),
                parseInt(row[4]),
                //TODO:asegurarme de que el dato es del tipo del enum MatchResult
            ]
          })
    }

}
~~~
-----

## Type Assertions

- Por convención no se exporta nada del index.ts. Entonces, en lugar de exportar el enum del index lo muevo a otro archivo
- Lo llamo MatchResult.ts, lo exporto y lo importo en el index.ts
- Lo importo también en utils
- Uso as para decirle a Typescript que se que el valor en la fila 5 va a ser uno de tipo MatchResult

~~~js
import fs from 'fs'
import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'

export class CsvFileReader{
    
    data: string[][] = []

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
          }).map((row: string[]): any=>{
            return [
                dateStringTodate(row[0]),
                row[1],
                row[2],
                parseInt(row[3]),
                parseInt(row[4]),
                row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
                row[6]
            ]
          })
    }

}
~~~

- El problema aquí es que en el map he dicho que devuelve un valor de tipo any
- Arreglémoslo!
-----

## Describing a row with a Tuple

- Creo el tipo MatchData en el archivo de la clase CsvFileReader

~~~js
import fs from 'fs'
import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'

type MatchData = [Date, string, string, number, number, MatchResult, string]

export class CsvFileReader{
    
    data: MatchData[] = []  //cambio el tipo de data también

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
                                  //es de tipo MatchData
          }).map((row: string[]): MatchData=>{
            return [
                dateStringTodate(row[0]),
                row[1],
                row[2],
                parseInt(row[3]),
                parseInt(row[4]),
                row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
                row[6]
            ]
          })
    }

}
~~~

- Ahora puedo obtener la fecha del primer partido y obtenerlo en formato fecha de esta manera

~~~js
const dateOfFirstMatch = reader.data[0][0]

console.log(dateOfFirstMatch)
~~~
-----

## Not done with FileReader yet!

- Hay dos razones por las que creé una clase para leer el archivo
  - Una para tener código reutilizable
  - La segunda es para tener código que poder usar en otros proyectos futuros 
- Con esta última refactorización el código ha dejado de ser reutilizable
- El tipo MatchData hace que no sea reutilizable, solo funcionará con un CSV exactamente igual estructurado
- Vamos a hacer el código reutilizable-
- La idea de MatchData es buena, pero necesito algo más
- Hay dos maneras muy distintas de hacer un approach a este asunto
- Guardo el códigio de CsvFileReader en un archivo de backup para usarlo en el segundo refactor
------

## Understanding refactor # 1

- No quiero tener nada de tipo MatchData dentro de la clase CsvFileReader, porque eso la hace 100% dependiente del footbal.csv
- Podría poner de tipo nay, pero quiero evitar esto lo máximo posible
- Para ello voy a usar **GENERICOS**
- El .map done hay el return con la data en el método read el resultado esta mapeado con el tipo MatchData
- Creo un metodo helper en la clase llamado mapRow
- Se la paso por referencia al .map

~~~js
import fs from 'fs'
import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'

type MatchData = [Date, string, string, number, number, MatchResult, string]

export class CsvFileReader{
    
    data: MatchData[] = []

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
          }).map(this.mapRow) //paso mapRow por referencia, no lo invoco
    }

    mapRow(row: string[]): MatchData{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
    }
}
~~~

- La idea es transformar la CsvFileReader en una clase abstracta y luego crear con herencia la clase MatchReader
- Esta clase abstracta implementará el método read y el método abstracto mapRow
- De esta manera si quiero leer y listar, no sé, pelis, me creo una clase MoviesReader que derive de la clase abstracta CsvFileReader
-----

## Creating Abstract Classes

- Creo la clase MatchReader, copio el método y hago las importaciones necesarias
- MatchData da error, ahora lo soluciono

~~~js
import { CsvFileReader } from "./CsvFileReader";
import MatchResult from "./MatchResult";
import { dateStringTodate } from "./utils";


export class MatchReader extends CsvFileReader{
    mapRow(row: string[]): MatchData{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
    }
}
~~~
  
- Me voy a la clase csvFileReader y la creo abstracta

~~~js
import fs from 'fs'
import MatchResult from './MatchResult'

type MatchData = [Date, string, string, number, number, MatchResult, string]

export abstract class CsvFileReader{
    
    data: MatchData[] = []

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
          }).map(this.mapRow) //paso mapRow por referencia, no lo invoco
    }

    abstract mapRow(data: string[]): MatchData

}
~~~

- El problema aquí es que MatchData es específico de football.csv
- No debo tener ninguna referencia a MatchData dentro de mi clase abstracta para no hacerla dependiente
-----

## Variable Types with generics

- Para añadir datos genéricos a la clase lo indico en la clase

~~~js
class HoldAnything<T>{

    data: T
}

const holdNumber = new HoldAnything<number>()
~~~

- Convierto a genéricos la clase
- Exporto el type MatchData

~~~js
import fs from 'fs'
import MatchResult from './MatchResult'

export type MatchData = [Date, string, string, number, number, MatchResult, string]

export abstract class CsvFileReader<T>{
    
    data: T[] = []

    constructor(public fileName: string){}

    read(): void{
        this.data = fs.readFileSync(this.fileName,{
            encoding: 'utf8', // si espero texto lo codeo a utf-8
            })
            .split('\n')
            .map((row: string): string[]=>{
                return row.split(',')
          }).map(this.mapRow) //paso mapRow por referencia, no lo invoco
    }

    abstract mapRow(data: string[]): T

}
~~~

- Le añado el tipo MatchData (lo importo) a la clase MatchReader

~~~js
import { CsvFileReader } from "./CsvFileReader";
import MatchResult from "./MatchResult";
import { dateStringTodate } from "./utils";
import { MatchData } from "./CsvFileReader";


export class MatchReader extends CsvFileReader<MatchData>{
    mapRow(row: string[]): MatchData{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
    }
}
~~~

- En el index.ts en lugar de la instancia de csvFileReader la creo de MatchReader

~~~js

import { MatchReader } from "./MatchReader"
import MatchResult from "./MatchResult"


const reader = new MatchReader('./data/football.csv')
reader.read()

const dateOfFirstMatch = reader.data[0][0]

console.log(dateOfFirstMatch)

let manUnitedWins= 0 //contador para que incremente en 1 cada vez que gana Manchester United



for(let match of reader.data){
    if(match[1] === "Man United" && match[5]===MatchResult.HomeWin){
        manUnitedWins++
    }else if(match[2]=== 'Man United' && match[5]===MatchResult.AwayWin){
        manUnitedWins ++
    }
}


console.log(`Manchester United won ${manUnitedWins} games`)
~~~
- **NOTA**: Esta es UNA MANERA DE REFACTORIZAR. VA LA SEGUNDA
-----

## Alternate Refactor

- Cojo el código sin modificar (csvFileBackup)
- En el anterior refactor donde se usa un genérico con una clase abstracta FUNCIONA pero es poco claro
- Creo una nueva carpeta y la llamo herencia para el ejemplo anterior. Arrastro csvFileReader.ts y MatchReader.ts
- No actualizao las importaciones para que no interfiera
- Uso el csvFileBACKUP.ts
- Si uso npm start funciona, me devuelve los 18 won games, porque es la implementación anterior
- En este approach **vamos a usar INTERFACES**
- Tenemos la clase CsvFileReader que implementa un metodo read(): void con el campo data: string[][]
- Tenemos la clase MatchReader con el campo reader: DataReader y el método load(): void
- Y tenemos la interfaz DataReader con el método read(): void y el campo data: string[][]
- Como vemos csvFileReader tiene los mismos campos y métodos que la interfaz
- Por lo que el campo reader:Datareader cumple con la clase csvFileReader
- Puedo tener otras clases que sean ApiReader,NetworkReader, etc, satisfaciendo la interfaz
- El método load() puede llamar al reader y a su método read con la data
----

## Interface Approach

- Creo otro MatchReader.ts en /src
- Declaro la interfaz y la clase
- me traigo el type MatchData y las importaciones

~~~js
import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'

type MatchData = [Date, string, string, number, number, MatchResult, string]

interface DataReader {
    read(): void,
    data: string[][]
}

export class MatchReader{

    

    constructor (public reader: DataReader){
        
    }

    load():void{}
}
~~~

- Voy al csvFileBACKUP.ts
- Cambio el tipo de data: string[][] (estaba MatchData)
- Voy al segundo .map que es donde tengo MatchData, dateStringToDate, y MatchResult por resolver
- Lo copio, lo corto y lo pego dentro de la clase MatchReader que estoy creando
----

## Transforming Data

- Recuerda, MatchReader puede ser un lector de una clase ApiReader, CsvFileReader, etc

~~~js
import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'

type MatchData = [Date, string, string, number, number, MatchResult, string]

interface DataReader {
    read(): void,
    data: string[][]
}

export class MatchReader{

    

    constructor (public reader: DataReader){
        
    }

    load():void{
        this.reader.read()
        this.reader.data.map((row: string[]): MatchData=>{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
      })
    }
}
~~~

- Guardo el resultado del .map en una nueva propiedad de la clase que llamaré matches
- Le asigno el resultado del .map

~~~js
import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'

type MatchData = [Date, string, string, number, number, MatchResult, string]

interface DataReader {
    read(): void,
    data: string[][]
}

export class MatchReader{

    matches: MatchData[]= []

    constructor (public reader: DataReader){
        
    }

    load():void{
        //llamo al reader que satisface la interfaz DataReader como la clase CsvFileReader
        this.reader.read()

        //le asigno el resultado del .map a matches
        this.matches = this.reader.data.map((row: string[]): MatchData=>{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
      })
    }
}
~~~

- Ahora usémoslo en el index
- Debo crear las instancias que satisfagan la interfaz y la clase

~~~js
const csvFile = new CsvFileReader('../data/football.csv')
const reader = new MatchReader(csvFile)
~~~

- Hay que llamar al método load
- Cambio reader.data por reader.matches (el campo que defini en la clase dònde guardé el .map)

~~~js

import { CsvFileReader } from "./CsvFileBACKUP"
import { MatchReader } from "./MatchReader"
import MatchResult from "./MatchResult"


const csvFile = new CsvFileReader('./data/football.csv')
const reader = new MatchReader(csvFile)

reader.load()



let manUnitedWins= 0 //contador para que incremente en 1 cada vez que gana Manchester United


                        //cambio reader.data por reader.matches    
for(let match of reader.matches){ 
    if(match[1] === "Man United" && match[5]===MatchResult.HomeWin){
        manUnitedWins++
    }else if(match[2]=== 'Man United' && match[5]===MatchResult.AwayWin){
        manUnitedWins ++
    }
}

console.log(`Manchester United won ${manUnitedWins} games`)
~~~
----

## Inheritance vs Composition

- Hemos hecho dos grandes refactorizaciones diferentes para un mismo problema
- En el primer refactor usamos la herencia, en el segundo composition
- En la composición, tenemos la clase MatchReader en la que hace referencia a otro objeto que satisface la interfaz
- Herencia está caracterizado por la relación **"es a"** entre dos clases
- Composición está caracterizado por la relación **"tiene a"** entre dos clases
- Herencia: pongamos que tengo una clase Window con open: boolean, height: number, width:number, area():number, toggleOpen() : void
  - Si creo una clase Wall también tendrá height:number, width:number, area():number
  - Puedo crear la clase Rectangulo que tiene height, width y area y que hereden Window y Wall
  - En Wall solo añadiría color:string  y en Window open:boolean y toggleOpen():void
  - Pero **podría ser que tuvieramos otra ventana que no fuera rectangular y fuera circular**, por ejemplo
  - Tendría que crear una nueva clase con radius:number y area:number()
  - Tendria que renombrar la clase window a RectangularWindow que hereda de Rectangle y otra CircleWindow que hereda de Circular
  - En estas dos clases CircleWindow y RectangularWindow se repite el campo open:boolean y el método toggleOpen():void
  - **Tenemos código duplicado**
  - **CUANDO ESTO SUCEDE DEBEMOS ABANDONAR LA HERENCIA Y USAR COMPOSICION**
  - En la composición tendríamos a
    - Una clase para Wall con color:string, area():number y dimensions: Shape (puedo delegar el cálculo de area() a Shape)
    - Una clase para Window con open: boolean, toggleOpen() : void, dimensions: Shape
      - **Nota que no tiene ni height ni width ni area, tiene dimensions de tipo Shape. Puedo delegarle el calculo de area**
    - Una clase para Rectangle con height:number, width:number, area(): number
    - Una clase para Circle radius:number, area():number
    - En la composición hacemos referencia a otro objetod entro de la clase
----

## A Huge Misconception Around Composition

- **Favor object composition over class inheritance**
- Hay mucho escrito sobre composition vs herencia
- Muchas veces composición está mal definido
- Delegation es una manera poderosa de hacer composition
- Siguiendo el ejemplo de antes, la clase Window reutiliza el comportamiento de Rectangulo teniendo una variable de la instancia de Rectangulo y delegando un comportamiento especifico.
- Es lo que hemos visto que Window tiene un objeto Shape
- La clase Window delega el cálculo del área al objeto(clase) Shape
- Así es cómo hacemos código reusable
- **ESTO ES COMPOSITION**
- Hay personas que definen la composición a crear un objeto a través de varios objetos/métodos
-----

## Goal Moving Forward

- Tengo una variable llamada manUnitedGames qeu utilizo como contador para sumar cuantos partidos gana el Man United
- Si quisiera calcularlo con otro equipo sería incómodo
- Vamos a arreglar este aspecto del código en el análisis de tipos en el bucle for
- También falta habilitar el output en diferentes formatos
- En este momento el output es un simple console.log
- La solución pasa por composición
- La idea es tener un objeto que referencia otro/s objeto/s
- El objeto anfitrión delegará parte de su comportamiento al objeto alojado
- El approach es el siguiente:
  - La clase **Summary** tiene un campo **analyzer: Analyzer** (satisface la interfaz Analyzer)
    - La **interfaz Analyzer** tiene un método **run(matches: MatchData[]): string**
      - Este string que devuelve debo guardarlo en algun campo de la clase
    - **Summary** tiene también un **outputTarget: OutputTarget** que responde a la interfaz OutputTarget
      - **OutputTarget** tiene un método **print(report: string): void**
    - Finalmente, **Summary** tiene un método **buildAndPrintReport(MatchData[])**
  - La interfaz **Analyzer** satisface las clases **AverageGoalsAnalysys y WinsAnalysis**
  - La interfaz **OutputTarget** satisface las clases **ConsoleReport y HTMLReport**
    - **Ambas contienen el  metodo run** que devuelve void, la clase Console imprimirá en consola y HTMLReport gaurdará el resultado en un HTML
  - Entonces, con la clase **Summary**, efectuaré un tipo de analisis, generaré algún tipo de output,con el método buildAndPrintreport que delega las tareas de analizar y generar el reporte en los objetos analyzer y outputTarget
------

## A Composition-Based Approach

- Hasta ahora el tipo MatchData está dentro de MatchReader.ts
- Lo muevo a un archivo separado en src/types/MatchData.ts

~~~js
import MatchResult from "../MatchResult"

type MatchData = [Date, string, string, number, number, MatchResult, string]
~~~

- Empecemos con la creación de clases. Summary
- Defino las dos interfaces (podría hacerlo en una carpeta/archivo separado)

~~~js
import { MatchData } from "../types/MatchData"

export interface Analyzer{
    run(matches: MatchData[]): string
}


export interface OutputTarget{
    print(report:string): void
}
~~~

- Ahora, en el constructor de la clase Summary debo pasarle una instancia de la clase Analyzer y otra de la clase OutputTarget
  - Es decir, clases que satisfacen estas interfaces lo que nos ayuda a hacer código reutilizable y escalable
- Utilizo el atajo para declararlas solo en el constructor usando la palabra reservada public

~~~js
import { Analyzer } from "./interfaces/Analyzer"
import { OutputTarget } from "./interfaces/OutputTarget"


export class Summary{
    constructor(public analyzer: Analyzer, public outputTarget:OutputTarget){
        
    }
}
~~~

## Implementing an Analyzer class

- Creo la carpeta analyzers y dentro la clase WinsAnalysis
- Debe satisfacer la interfaz Analyzer con el método run
- Copio y pego el bucle for del index.ts ( paste aquí del código sin retocar)

~~~js
let manUnitedWins= 0 //contador para que incremente en 1 cada vez que gana Manchester United



for(let match of reader.matches){ //cambio reader.data por reader.matches
    if(match[1] === "Man United" && match[5]===MatchResult.HomeWin){
        manUnitedWins++
    }else if(match[2]=== 'Man United' && match[5]===MatchResult.AwayWin){
        manUnitedWins ++
    }
}
~~~

- WinsAnalysis.ts

~~~js
import { MatchData } from "../types/MatchData";
import { Analyzer } from "../interfaces/Analyzer";
import MatchResult from "../MatchResult";

export class WinsAnalysis implements Analyzer {
                        //add teamName in the constructor
    constructor(public teamName: string){} 

            //import MatchData type
    run(matches: MatchData[]): string{
        let wins = 0 
    for(let match of matches){                       //import enum MatchResult   
        if(match[1] === this.teamName && match[5]===MatchResult.HomeWin){
        wins++
        }else if(match[2]=== this.teamName && match[5]===MatchResult.AwayWin){
        wins++
         }
       }
       return `Team ${this.teamName} wons ${wins} games `
    }

}
~~~

- La interfaz no restringe el que yo pueda añadir más métodos, pero si me exige que haya al menos los que marca la interfaz
----

## Building the reporter

- Ahora voy a crear la clase ConsoleReport que satisface la interfaz OutputTarget
- Solo debo mandarle el resultado de mi analisis y generar una impresión en consola

~~~js
import { OutputTarget } from "../interfaces/OutputTarget";


export class ConsoleReport implements OutputTarget{

    //no tengo porqué usar la misma palabra report como marca la interfaz
    print(report: string):void{
        console.log(report)
    }
}
~~~

- En la clase Summary, llamo al método buildAndPrintReport que introduce la MatchData dentro del Analyzer (en este caso WinsAnalisis, necesita MatchData para el método run) que devuelve un string que imprime el OutputTarget (en este caso ConsoleReport) 
- Vamos entonces a crear el método buildAndPrintReport de la clase Summary

~~~js
import { Analyzer } from "./interfaces/Analyzer"
import { OutputTarget } from "./interfaces/OutputTarget"
import { MatchData } from "./types/MatchData"


export class Summary{
    constructor(public analyzer: Analyzer, public outputTarget:OutputTarget){
        
    }

    buildAndPrintReport(matches: MatchData[]): void{
        const output = this.analyzer.run(matches)
        this.outputTarget.print(output)
    }
}
~~~
-----

## Putting it all together

- Vamos al index.ts

~~~js
import { CsvFileReader } from "./CsvFileBACKUP"
import { MatchReader } from "./MatchReader"
import { Summary } from "./Summary"
import { WinsAnalysis } from "./analyzers/WinsAnalisis"
import { ConsoleReport } from "./reporters/Consolereport"



const csvFile = new CsvFileReader('./data/football.csv')
const matchReader = new MatchReader(csvFile)
matchReader.load()

const ManUnitedAnalyzer = new WinsAnalysis('Man United')
const ManUnitedReport = new ConsoleReport()

const ManUnitedSummary = new Summary(ManUnitedAnalyzer, ManUnitedReport)

ManUnitedSummary.buildAndPrintReport(matchReader.matches)
~~~

- Podría hacer la instancia de Summary en una linea

~~~js
const manUnitedSummary = new Summary(new WinsAnalysis('Man United'), new ConsoleReport())
~~~
--------

## Generating HTML Reports

- Creo en la carpeta reporters HtmlReport.ts

~~~js
import fs from 'fs'
import { OutputTarget } from "../interfaces/OutputTarget";


export class HtmlReport implements OutputTarget{

    print(report: string): void {
        const html = `
            <div>
                <h1>Analysis</h1>
                <div>${report}</div>
            </div>
        `

        fs.writeFileSync('report.html', html)
    }
}
~~~

- Lo importo en el index.ts y meto la instancia en Summary

~~~js

import { CsvFileReader } from "./CsvFileBACKUP"
import { MatchReader } from "./MatchReader"
import { Summary } from "./Summary"
import { WinsAnalysis } from "./analyzers/WinsAnalisis"
import { ConsoleReport } from "./reporters/Consolereport"
import { HtmlReport } from "./reporters/HtmlReport"


const csvFile = new CsvFileReader('./data/football.csv')
const matchReader = new MatchReader(csvFile)
matchReader.load()

const ManUnitedAnalyzer = new WinsAnalysis('Man United')
const ManUnitedReport = new HtmlReport()

const ManUnitedSummary = new Summary(ManUnitedAnalyzer, ManUnitedReport)

ManUnitedSummary.buildAndPrintReport(matchReader.matches)
~~~

- Esto me ha generado en la raíz un html llamado report.html con esto

~~~html

<div>
    <h1>Analysis</h1>
    <div>Team Man United wons 18 games </div>
</div>
~~~

- De esta manera tengo un cñodigo reusable y escalable sin dramas
------

## One Last Thing!

- Puedo crear un atajo para que la declaración de la instancia de Summary no sea tan verbosa
- Puede ser que siempre quiera el mismo equipo y el mismo reporte
- Puedo crear un método estático. 
- Son métodos que pueden ser llamados sin crear una instancia de la clase (Summary.metodoEstatico())

~~~js
import { Analyzer } from "./interfaces/Analyzer"
import { OutputTarget } from "./interfaces/OutputTarget"
import { MatchData } from "./types/MatchData"
import { WinsAnalysis } from "./analyzers/WinsAnalisis"
import { HtmlReport } from "./reporters/HtmlReport"


export class Summary{

    static winsAnalysisWithHTMLReport(teamName: string): Summary{
            return new Summary(new WinsAnalysis(teamName), new HtmlReport())
    }
    
    constructor(public analyzer: Analyzer, public outputTarget:OutputTarget){
        
    }

    buildAndPrintReport(matches: MatchData[]): void{
        const output = this.analyzer.run(matches)
        this.outputTarget.print(output)
    }
}
~~~

- De esta manera puedo llamar a Summary.winsAnalysisWithHTMLReport('Man United')
- Puedo hacer lo mismo con MatchReader y crear un método estático

~~~js
import { dateStringTodate } from './utils'
import MatchResult from './MatchResult'
import { MatchData } from './types/MatchData'
import { CsvFileReader } from './CsvFileBACKUP'

interface DataReader {
    read(): void,
    data: string[][]
}

export class MatchReader{

    static fromCsv(filename: string): MatchReader{
        return new MatchReader(new CsvFileReader(filename))
    }
    
    matches: MatchData[]= []

    

    constructor (public reader: DataReader){
        
    }

    load():void{
        this.reader.read()
        this.matches = this.reader.data.map((row: string[]): MatchData=>{
        return [
            dateStringTodate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult, //le digo a Typescript que se llo que ocurre aqui, CRÉEME
            row[6]
        ]
      })
    }
}
~~~

- Ahora puedo hacerlo una nueva instancia con menos código

~~~js
const matchReader = MatchReader.fromCsv('../football.csv')
~~~
------

## Resumen

- Creamos un enum para MatchResult
  - El gol de esto es comunicar que estos valores están relacionados
- Creamos el tipo MatchData con una tupla para describir una fila del archivo csv
- En el approach de herencia creamos la clase abstracta csvFileReader con un genérico para usar genéricos dentro de la clase
    - Siempre que definamos una clase que herede de csvFileReader hay que pasarle un tipo de dato en lugar del genérico
    - En este caso le paso el tipo MatchData para el campo data de la clase MatchReader
- En el segundo approach usamos composición
- En el constructor de MatchReader indico que le paso un objeto de tipo DataReader
    - El único propósito de MatchReader es transformar la data que venga en un resultadod e tipo MatchData
- El otro caso claro de composición es el efectuado con Summary

  



  


