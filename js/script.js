import { $taskInput, $taskContainer, $addButton, $errorMessage} from "./element.js";
import { sanitizeInput } from "./utility.js";

let taskList = [];

const addTaskHandler = () => {
    const taskTitle = sanitizeInput($taskInput.value);
    
    if (!taskTitle.length) {
        $errorMessage.hidden = false;
        $errorMessage.innerHTML = "Task Name must be provided";
        return;
    }
    else{
        $errorMessage.hidden = true;
    }

    const task = createTask(taskTitle);

    taskList.unshift(task);

    const taskElement = createTaskElement(task);
    $taskContainer.prepend(taskElement);
};

const createTask = (taskTitle) => {
    return {
        "id": Date.now(),
        "title": taskTitle,
        "createdAt": new Date().toLocaleDateString()
    }
};

const deleteTaskHandler = (event) => {
    const taskElement = event.target.parentElement;
    const taskId = taskElement.id;

    taskElement.remove();
    taskList = taskList.filter((task) => task.id!=taskId);
};

const createTaskElement = (task) => {
    const taskElement = document.createElement("li");
    const deleteButton = document.createElement("button");

    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", (event) => deleteTaskHandler(event));

    taskElement.id = task.id;
    taskElement.innerHTML = `${task.title}, ${task.createdAt} `;
    taskElement.appendChild(deleteButton);

    return taskElement;
};

$addButton.addEventListener("click", addTaskHandler);