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

- 