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

    public getLocationLat(){
        return this.location.lat;
    }

    public getLocationLng(){
        return this.location.lng;
    }

}


export default{
    User
}