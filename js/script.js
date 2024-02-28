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

    const $taskElement = createTaskElement(task);
    $taskContainer.prepend($taskElement);
};

const createTask = (taskTitle) => {
    return {
        "id": Date.now(),
        "title": taskTitle,
        "createdAt": new Date().toLocaleDateString(),
        "isDone": false
    }
};

const deleteTaskHandler = (event) => {
    const $taskElement = event.target.parentElement;
    const taskId = $taskElement.id;

    $taskElement.remove();
    taskList = taskList.filter((task) => task.id!=taskId);
};

const updateTaskEditHandler = (task, $taskDetails, $inputField, $editButton, $updateButton, $cancelButton) => {
    task.title = $inputField.value;
    
    taskList.map((t) => {
        if(t.id==task.id){
            return task;
        }
        return t;
    });

    $taskDetails.innerHTML = `${task.title}, ${task.createdAt} `;

    toggleElements($taskDetails, $inputField, $editButton, $updateButton, $cancelButton);
}

const toggleElements = ($taskDetails, $inputField, $editButton, $updateButton, $cancelButton) => {
    $taskDetails.hidden = !$taskDetails.hidden;
    $editButton.hidden = !$editButton.hidden;
    $inputField.hidden = !$inputField.hidden;
    $updateButton.hidden = !$updateButton.hidden;
    $cancelButton.hidden = !$cancelButton.hidden;
}

const markDoneTaskHandler = (event, task, $taskDetails, $editButton) => {
    const $strikeTaskDetails = document.createElement("s");
    $strikeTaskDetails.innerHTML = $taskDetails.innerHTML;
    $taskDetails.innerHTML = "";
    $taskDetails.appendChild($strikeTaskDetails);

    $editButton.hidden = true;

    task.isDone = true;
    taskList = taskList.map((t) => {
        if(t==task){
            return task;
        }
        return t;
    });

    event.target.remove();
}

const createTaskElement = (task) => {
    const $taskElement = document.createElement("li");
    const $inputField = document.createElement("input");
    const $taskDetails = document.createElement("span");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $updateButton = document.createElement("button");
    const $cancelButton = document.createElement("button");
    const $doneButton = document.createElement("button");

    $taskElement.id = task.id;
    
    $taskDetails.innerHTML = `${task.title}, ${task.createdAt} `;
    
    $inputField.value = `${task.title}`;
    $inputField.hidden = true;
    
    $deleteButton.innerText = "Delete";
    $deleteButton.addEventListener("click", (event) => deleteTaskHandler(event));
    
    $editButton.innerHTML = "Edit";
    $editButton.addEventListener("click", () => toggleElements($taskDetails, $inputField, $editButton, $updateButton, $cancelButton));
    
    $updateButton.innerHTML = "Update";
    $updateButton.addEventListener("click", () => updateTaskEditHandler(task, $taskDetails, $inputField, $editButton, $updateButton, $cancelButton));
    $updateButton.hidden = true;
    
    $cancelButton.innerHTML = "Cancel";
    $cancelButton.addEventListener("click", () => {
        $inputField.value = task.title;
        toggleElements($taskDetails, $inputField, $editButton, $updateButton, $cancelButton);
    });
    $cancelButton.hidden = true;

    $doneButton.innerHTML = "Done";
    $doneButton.addEventListener("click", (event) => markDoneTaskHandler(event, task, $taskDetails, $editButton));

    $taskElement.appendChild($taskDetails);
    $taskElement.appendChild($inputField);
    $taskElement.appendChild($deleteButton);
    $taskElement.appendChild($editButton);
    $taskElement.appendChild($updateButton);
    $taskElement.appendChild($cancelButton);
    $taskElement.appendChild($doneButton);

    return $taskElement;
};

$addButton.addEventListener("click", addTaskHandler);