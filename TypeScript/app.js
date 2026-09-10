"use strict";
// 2.3 Enums and Literals
Object.defineProperty(exports, "__esModule", { value: true });
class Dog {
    name;
    color;
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }
    speak() {
        console.log(`I am ${this.name} and I am ${this.color}`);
    }
    test() {
        return 1;
    }
}
// const dog: Animal = new Dog("Leo" , "Brown");
class Cat {
    speak() {
        console.log("Meow");
    }
}
const dog = new Dog("Leo", "Brown");
const cat = new Cat();
const animal = [cat, dog];
function makeSound(animal) {
    animal.speak();
}
makeSound(dog);
makeSound(cat);
//# sourceMappingURL=app.js.map