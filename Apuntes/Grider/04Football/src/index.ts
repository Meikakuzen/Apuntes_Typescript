import fs from 'fs'

//me devuelve un string con todo el archivo
const matches = fs.readFileSync("./data/football.csv",{
    encoding: 'utf8', // si espero texto lo codeo a utf-8
    })
    .split('\n')
    .map((row: string): string[]=>{
        return row.split(',')
  })
console.log(matches)
