const taskInput = document.getElementById("input-task");
const addButton = document.getElementById("add-task");
const taskContainer = document.getElementById("task-container");

const reg = /[&<>"'/`]/ig;

let taskList = [];

const addTaskHandler = () => {
    const taskTitle = taskInput.value.replace(reg, "");
    
    if (!taskTitle.length) {
        alert("Please enter your task");
        return;
    }

    const task = createTask(taskTitle);

    taskList.unshift(task);

    taskContainer.innerHTML = `<li id="${task.id}">
                                    ${task.title}, ${task.createdAt} 
                                    <button onclick="deleteTaskHandler(this)">Delete</button>
                                </li>`.concat(taskContainer.innerHTML);
};

const createTask = (taskTitle) => {
    return {
        "id": taskList.length+1,
        "title": taskTitle,
        "createdAt": new Date().toLocaleDateString()
    }
};

const deleteTaskHandler = (event) => {
    const taskElement = event.parentElement;
    const taskId = event.parentElement.id;

    taskElement.remove();
    taskList = taskList.filter((task) => task.id!=taskId);
};

addButton.addEventListener("click", addTaskHandler);