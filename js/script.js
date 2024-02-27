const taskInput = document.getElementById("input-task");
const addButton = document.getElementById("add-task");
const taskContainer = document.getElementById("task-container");

const reg = /[&<>"'/`]/ig;

let taskList = [];

const addTaskHandler = () => {
    const taskTitle = taskInput.value.replace(reg, "").trim();
    
    if (!taskTitle.length) {
        alert("Please enter your task");
        return;
    }

    const task = createTask(taskTitle);

    taskList.unshift(task);

    const taskElement = createTaskElement(task);

    taskContainer.innerHTML = taskElement.outerHTML.concat(taskContainer.innerHTML);
};

const createTask = (taskTitle) => {
    return {
        "id": taskList.length+1,
        "title": taskTitle,
        "createdAt": new Date().toLocaleDateString()
    }
};

const createTaskElement = (task) => {
    const taskElement = document.createElement("li");
    taskElement.innerHTML = `<li>${task.title}, ${task.createdAt}</li>`;

    return taskElement;
};

addButton.addEventListener("click", addTaskHandler);