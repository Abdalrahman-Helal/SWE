"use strict";
// 2.3 Enums and Literals
Object.defineProperty(exports, "__esModule", { value: true });
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
class Person {
    name;
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
}
const p1 = new Person("Tim");
p1.setName("helal");
console.log(p1.getName());
//# sourceMappingURL=app.js.map