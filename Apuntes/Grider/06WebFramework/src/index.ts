import { User } from "./models/User";


const user = new User({name: "John", age: 20})


console.log(user.get("name"))

user.set({name: "Petri", age: 29})

console.log(user.get("name"))
console.log(user.get("age"))