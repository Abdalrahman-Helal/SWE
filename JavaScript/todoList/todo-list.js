const todoList = JSON.parse(localStorage.getItem('todoList')) || [{
  name: 'make dinner',
  dueDate: '2022-2-10'
}, {
  name: 'watch football',
  dueDate: '2022-4-10'
}];

renderTodoList();

function renderTodoList() {
  let todoListHTML = ''
  todoList.forEach(function (todoObject, index) {
    const { name, dueDate } = todoObject;
    const html = `
    <div>${name}</div>
    <div>${dueDate}</div>
    <button onclick ="
      todoList.splice(${index}, 1); saveToStorage();
      renderTodoList(); " class="delete-todo-button">Delete</button>
      `
    todoListHTML += html;
  });
 document.querySelector('.js-todo-list').innerHTML = todoListHTML;
}
  // for(let i = 0; i < todoList.length; i++) {
  //   const todoObject = todoList[i];
  //   // const name = todoObject.name;
  //   // const dueDate = todoObject.dueDate;
  //   const { name , dueDate } = todoObject;
  //   const html = `
  //   <div>${name}</div>
  //   <div>${dueDate}</div>

  //     <button onclick ="
  //     todoList.splice(${i}, 1); saveToStorage();
  //     renderTodoList(); " class="delete-todo-button">Delete</button>
  //     `
  //   todoListHTML += html;
  // }

  function addTodo() {
    const inputELement = document.querySelector('.js-name-input');
    const name = inputELement.value;

    const dataInputElement = document.querySelector('.js-due-date-input');
    const dueDate = dataInputElement.value;

    todoList.push({ name, dueDate }); // or
    //todoList.push({name : name , dueDate : dueDate});
    console.log(todoList);
    inputELement.value = '';
    //localStorage.setItem('todoList', JSON.stringify(todoList));
    saveToStorage(); // same as above
    renderTodoList();
  }

  function saveToStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }

  console.log(todoListHTML);
  document.querySelector('.js-todo-list').innerHTML = todoListHTML;
