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

const saveTaskEditHandler = (task, taskDetails, inputField, editButton, saveButton, cancelButton) => {
    task.title = inputField.value;
    
    taskList.map((t) => {
        if(t.id==task.id){
            return task;
        }
        return t;
    });

    taskDetails.innerHTML = `${task.title}, ${task.createdAt} `;

    toggleElements(taskDetails, inputField, editButton, saveButton, cancelButton);
}

const toggleElements = (taskDetails, inputField, editButton, saveButton, cancelButton) => {
    taskDetails.hidden = !taskDetails.hidden;
    editButton.hidden = !editButton.hidden;
    inputField.hidden = !inputField.hidden;
    saveButton.hidden = !saveButton.hidden;
    cancelButton.hidden = !cancelButton.hidden;
}

const createTaskElement = (task) => {
    const taskElement = document.createElement("li");
    const inputField = document.createElement("input");
    const taskDetails = document.createElement("span");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    const saveButton = document.createElement("button");
    const cancelButton = document.createElement("button");

    taskElement.id = task.id;
    
    taskDetails.innerHTML = `${task.title}, ${task.createdAt} `;
    
    inputField.value = `${task.title}`;
    inputField.hidden = true;
    
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", (event) => deleteTaskHandler(event));
    
    editButton.innerHTML = "Edit";
    editButton.addEventListener("click", () => toggleElements(taskDetails, inputField, editButton, saveButton, cancelButton));
    
    saveButton.innerHTML = "Save";
    saveButton.addEventListener("click", () => saveTaskEditHandler(task, taskDetails, inputField, editButton, saveButton, cancelButton));
    saveButton.hidden = true;
    
    cancelButton.innerHTML = "Cancel";
    cancelButton.addEventListener("click", () => {
        inputField.value = task.title;
        toggleElements(taskDetails, inputField, editButton, saveButton, cancelButton);
    });
    cancelButton.hidden = true;

    taskElement.appendChild(taskDetails);
    taskElement.appendChild(inputField);
    taskElement.appendChild(deleteButton);
    taskElement.appendChild(editButton);
    taskElement.appendChild(saveButton);
    taskElement.appendChild(cancelButton);

    return taskElement;
};

$addButton.addEventListener("click", addTaskHandler);