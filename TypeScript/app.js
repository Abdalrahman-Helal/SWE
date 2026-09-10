"use strict";
// 2.3 Enums and Literals
Object.defineProperty(exports, "__esModule", { value: true });
const person = {
    name: "helal",
    age: 22,
    // height: 178
    // hello : function () {
    //   console.log(this.name + " says Hi");
    // }
};
// person.hello();
// interface Manager extends Employee, Person{
//   employees : Person[]
// }
// interface Employee extends Person {
//   employeeId: number;
// }
// const worker1: Employee = {
//   name : 'ahmed',
//   age: 22,
//   height: 178,
//   employeeId: 14
// }
// const worker2: Employee = {
//   name : 'ali',
//   age: 22,
//   height: 178,
//   employeeId: 15
// }
// const manager: Manager = {
//   name: "helal",
//   age: 25,
//   employees: [worker1, worker2],
//   employeeId: 1
// }
function getPerson(p) {
    return {
        name: 'Helal',
        age: 22
    };
}
console.log(getPerson(person));
//# sourceMappingURL=app.js.map