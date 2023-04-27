# 02 GoogleMaps Typescript Grider

- Esta será una aplicación en Typescript
- De manera random generará un Usuario y una Compañía con nombre y dirección aleatorios
- Haremos que enseñe los domicilios en el browser con Google Map
----

## Estructura

- Tenemos 3 clases principales:
  - Map.ts
  - User.ts
  - Company.ts
- Creo User.ts con la clase User y un index.ts
----

## Generating Random Data

- Documentación en npmjs.com de 'faker' package
- Para instalar

> npm i @faker-js/faker

- Tiene un módulo llamado address que genera un zipCode, city, country, latitud, longitud etc
- Tiene otro llamado company, otro llamado namen  (tiene más)
- Para importarlo

> import {faker} from '@faker-js/faker'

- Para instalar los tipos
  
> npm i @types/faker

- Ahora si me coloco en la importacion {faker} + Ctrl se linkea, si clico aparecen los tipos de la librería
  - NOTA: hay ciertos problemas con esta librería, ene ste caso no funciona
  - Podría ver que en el módulo address el zipCode(format?: string): string  me pide un string y devuelve un string, etc
  - Las que interesan que son latitude y longitude no llevan parámetros y devuelven un string
  - Seguramente tendré que castearlo a número

~~~ts
import {faker} from '@faker-js/faker'

export class User{
    name: string;
    location:{
        lat: number // este objeto no esta inicializado
        lng: number
    }
    constructor(){
        this.name = faker.name.firstName()
        //this.location.lat = faker.address.latitude();  esto no funcionaría porque location da undefined

        this.location ={
            //como .latitude y .longitude devuelve string y yo los necesito como numeros uso parseFloat
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude())
        }
        
    }

}


~~~
---

## Exportaciones

- Importo la clase User en index.ts 
- Como uso solo export (sin el default) debo usar las llaves para importarlo

> import {User} from './User.ts'

- Si coloco export default 'red' a la hora de importarlo no usaría llaves y le doy el nombre que quiera

> import color from '.User.ts'

- En el mundo Typescript existe la convención de no usar export default 
- index.ts:

~~~ts
import {User} from './User'

const user = new User()

console.log(user)
~~~

- Estoy usando React, así que importo index.ts en App.tsx y aparece este objeto en consola

~~~json
User {name: 'Watson', location: {…}}
location: 
{lat: -73.0396, lng: -153.9378}
name: 
"Watson"
~~~
----

## Definiendo a Company

- Creo el archivo Company.ts con la clase Company
~~~ts
import {faker} from '@faker-js/faker'

export class Company {

    name: string;
    catchPhrase:string;
    location:{
        lat: number;
        lng: number
    };
    constructor(){
        this.name = faker.company.name()
        this.catchPhrase = faker.company.catchPhrase()
        this.location ={
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude())
        }
    }
}
~~~

- Importo Companty en index.ts
- index.ts
 
~~~ts
import {User} from './User'
import { Company } from './Company'

const user = new User()

const company = new Company()

console.log(user)
console.log(company)
~~~
-----

# ApiKey GoogleMaps

- AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU
- Instalar @react-google-maps/api
- Para crear una imagen de google maps en React usar este código

~~~ts
import React, { useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle={
    width : '400px',
    height: '400px'
}

const center ={
    lat: -45.654
    lng: -38.523 
}

const Mapa = () => {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU"
    })
  
    const [map, setMap] = useState(null)

    const onLoad = useCallback(function callback(map: any){
        const bounds = new window.google.maps.LatLngBounds()
        map.fitBounds(bounds)
        setMap(map)
    }, [])

    const onUnmount = useCallback((map: any)=>{
        setMap(null)
    }, [])
  
  
    return isLoaded ? (
        <GoogleMap
        mapContainerStyle = {containerStyle}
        center = {center}
        zoom ={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        >

        </GoogleMap>
    ): <></>
}

export default Mapa
~~~

- Puedo encapsular la latitud y longitud en dos métodos y setearlos
- Exporto la instancia de user

~~~ts
const center ={
    lat: user.getLocationLat(),
    lng: user.getLocationLng() 
}
~~~

- Llegados a este punto detengo el proyecto porque no cumple con los objetivos.
- Yo estoy usando React y es totalmente diferente al curso


