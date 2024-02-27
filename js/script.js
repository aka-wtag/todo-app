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

    $taskContainer.innerHTML = taskElement.outerHTML.concat($taskContainer.innerHTML);
};

const createTask = (taskTitle) => {
    return {
        "id": Date.now(),
        "title": taskTitle,
        "createdAt": new Date().toLocaleDateString()
    }
};

const createTaskElement = (task) => {
    const taskElement = document.createElement("li");
    taskElement.innerHTML = `<li>${task.title}, ${task.createdAt}</li>`;

    return taskElement;
};

$addButton.addEventListener("click", addTaskHandler);