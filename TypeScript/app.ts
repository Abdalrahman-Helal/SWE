// 2.3 Enums and Literals

// enum Size {
//   Smallest = 100,
//   Medium,
//   Large
// }

// let size: Size = Size.Smallest;

// if ( size === Size.Smallest) {

// }

// enum Direction {
//   Up = 'UP',
//   Down = 'DOWN',
//   Left = 'LEFT',
//   Right = 'RIGHT'
// }

// enum Description {
//   SmallText = "this is some sub text to read"
// }

// var value:Direction;

// console.log(Description.SmallText);

// ----- 2.4 any unknown and type casts

// let x: unknown = 1;

// if(typeof x == "number") {
//   const result = x + 1;
// } else if(typeof x == "string") {
//   const result = x.length;
// }

// const result = (x as number[][])[0][1];

// ----- 2.5 optional chaining and bang

// const arr = [[{name: "time"}]]

// // const el = arr.pop()?.pop()?.name
// const el = arr.pop()!.pop()!.name

//----------------------------- 3.1 Basic Function types

// function add(x: number, y: number): number {
//   return x + y;
// }
// const result = add(1, 2);

// function makeName(firstName: string, lastName: string, middleName?: string) {
//   if (middleName) return firstName + " " + middleName + " " + lastName
//   return firstName + " " + lastName;
// }

// function callFunc(
//   func: (f: string, l: string, m?: string) => string,
//   param1: string,
//   param2: string
// ) {
//   func(param1, param2);
// }

// callFunc(makeName, "Tim", "Ruscica")

// function mul(x: number, y: number): number {
//   return x * y;
// }

// function div(x: number, y: number): number {
//   return x / y;
// }

// function applyFunc(
//   funcs: ((a: number, b: number) => number)[],
//   values: [number, number][],
// ): number[] {
//   const result = [] as number[];
//   for (let i = 0; i < funcs.length; i++) {
//     const args = values[i];
//     const reuslt = funcs[i](args[0], args[1]);
//     result.push(result);
//   }

//   return result;
// }

// applyFunc(
//   [mul, div],
//   [
//     [1, 2],
//     [3, 4],
//   ],
// );

//--------------- 3.2 Advanced function types

// function sum(str: string,...number: number[]){

// }

// sum("message", 1,2,3)
// sum("message", 1,2,3,4,5,6,7,8,9,10)
// sum("message", 1,2,3,4,5,6,7,8,9,10)

// function getItemLength(name: string): number
// function getItemLength(name: string[]): number
// function getItemLength(nameOrNames: unknown): number {
//   if(typeof nameOrNames ==="string"){
//     return nameOrNames.length;
//   } else if(Array.isArray(nameOrNames)) {
//     return nameOrNames.length;
//   }

//   return 0;
// }

// console.log(getItemLength(""));

// 3.3 interfaces

// interface Person {
//   name: string;
//   age: number;
//   height?: number;
//   // hello: () => void;
// }

// const person: Person = {
//   name: "helal",
//   age: 22,
//   // height: 178
//   // hello : function () {
//   //   console.log(this.name + " says Hi");
//   // }
// }

// // person.hello();

// // interface Manager extends Employee, Person{
// //   employees : Person[]
// // }

// // interface Employee extends Person {
// //   employeeId: number;
// // }

// // const worker1: Employee = {
// //   name : 'ahmed',
// //   age: 22,
// //   height: 178,
// //   employeeId: 14
// // }

// // const worker2: Employee = {
// //   name : 'ali',
// //   age: 22,
// //   height: 178,
// //   employeeId: 15
// // }

// // const manager: Manager = {
// //   name: "helal",
// //   age: 25,
// //   employees: [worker1, worker2],
// //   employeeId: 1
// // }

// function getPerson(p: Person) : Person {
//   return {
//     name : 'Helal',
//     age: 22
//   }
// }

// console.log(getPerson(person));

// 4.1 Classes and abstract classes

// class Person {
//   // private name: string; // public , protected
//   protected name: string;
//   constructor(name: string) {
//     this.name = name;
//     this.greet();
//   }

//   private greet() {
//     console.log(`Hello, my name is ${this.name}`);
//   }

//   getName() {
//     if (this.name.length < 2) return "";
//     return this.name;
//   }

//   setName(name: string) {
//     if (name.length < 5) return;
//     this.name = name;
//   }
// }

// class Employee extends Person {
//   callMe() {
//     console.log(this.name);
//   }
// }

// const p1 = new Person("ahmed");
// p1.setName("helal");
// console.log(p1.getName());



// abstract class 

// abstract class Animal {
//   abstract makeSound(duration: number): void;

//   move(duration: number) {
//     console.log("Moving along ...");
//     this.makeSound(duration);
//   }
// }

// class Dog extends Animal {
//   makeSound(duration: number): void {
//     console.log('woof woof');
//   }
// }

// class Cat extends Animal {
//   makeSound(duration: number): void {
//     console.log('meow meow');
//   }
// }

// const dog = new Dog();
// dog.move(10);

// const cat = new Cat();
// cat.move(5);


// 4.2 Classes and interfaces 

// interface Animal {
//   speak(): void
// }

// class Dog implements Animal {
//   private name: string;
//   private color: string;

//   constructor(name: string, color: string) {
//     this.name = name;
//     this.color = color;
//   }

//   speak() {
//     console.log(`I am ${this.name} and I am ${this.color}`)
//   }
//   test() {
//     return 1;
//   }
// }

// // const dog: Animal = new Dog("Leo" , "Brown");


// class Cat implements Animal {
//   speak() {
//     console.log("Meow");
//   }
// }

// const dog = new Dog("Leo" , "Brown");
// const cat = new Cat();
// const animal: Animal[] = [cat, dog];

// function makeSound(animal: Animal) {
//   animal.speak();
// }

// makeSound(dog);
// makeSound(cat);



// 4.3 Static attributes and method

// class Dog {
//   static instanCount : number = 0;
//   name: string;
//   constructor(name: string) {
//     Dog.instanCount++;
//     this.name = name;
//   }

//   static DecreaseCount() {
//     this.instanCount--;
//   }
// }

// const dog1 = new Dog("Leo");
// const dog2 = new Dog("Max");

// console.log(Dog.instanCount);
// Dog.DecreaseCount();
// console.log(Dog.instanCount);

// 4.4 Generics

// class DataStore<T> {
//   private items: T[] = [];

//   addItem(item: T): void { 
//     this.items.push(item);
//   }

//   getItem(index: number): T { 
//     return this.items[index];
//   }
  
//   removeItem(index: number): void {
//     this.items.splice(index, 1);
//   }

//   getAllItems(): T[] {
//     return this.items;
//   }
// }


// interface User {
//   name: string;
//   id: number;
// }
// const data = new DataStore<User>();


// function getValue<K, V>(key: K , value1: V , value2: V): V {
//   if(key) {
//     return value1;
//   }
//   return value2;
// }

// const n1: number = 1;
// const n2: number = 2;

// getValue<string, number>('hello', n1, n2);
// getValue('hello', n1, n2);




// 5.1 type aliases

type Coordinate = [number, number]

type list = string[][];
function compareCoods(
  p1: Coordinate,
  p2: Coordinate
): Coordinate {
  return [p1[0], p2[1]];
}

const coords: Coordinate[] = [];