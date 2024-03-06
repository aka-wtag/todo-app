import {
    $taskInput,
    $addButton,
    $searchButton,
    $searchInput,
    $createButton,
    $inputWrapper,
    $blankFieldWrapper,
    $taskList,
    $clearButton,
    $splashScreen,
    $header,
    $main,
} from "./element.js";
import {
    sanitizeInput,
    showCompletedTime,
    showFormattedDate,
    clearInputField,
    showMessage,
} from "./utility.js";
import { DELETE_ICON, EDIT_ICON, DONE_ICON, PLUS_ICON } from "./svg.js";

let tasks = [];

const addTaskHandler = () => {
    const taskTitle = sanitizeInput($taskInput.value);

    if (!taskTitle) {
        showMessage(false, "You can not add a todo item without a title.");

        return;
    }

    const task = createTask(taskTitle);

    tasks.unshift(task);

    const $taskElement = createTaskElement(task);

    $taskElement.after($inputWrapper);

    $taskList.insertBefore($taskElement, $taskList.children[1]);

    clearInputField($taskInput);
    clearInputField($searchInput);

    showMessage(true, "Task added successfully.");
};

const createTask = (taskTitle) => {
    return {
        id: Date.now(),
        title: taskTitle,
        createdAt: new Date().toLocaleDateString(),
        isDone: false,
        doneAt: undefined,
    };
};

const deleteTaskHandler = (event) => {
    const $taskElement = event.currentTarget.parentElement.parentElement;

    const taskId = parseInt($taskElement.id);

    $taskElement.remove();

    tasks = tasks.filter((task) => task.id !== taskId);
};

const updateTaskEditHandler = (
    task,
    $taskTitleElement,
    $taskCreatedElement,
    $inputElement,
    $editButton,
    $saveButton,
    $cancelButton,
    $deleteButton
) => {
    const taskTitle = sanitizeInput($inputElement.value);

    if (!taskTitle) {
        showMessage(false, "You can not add a todo item without a title.");

        return;
    }
    task.title = taskTitle;

    $taskTitleElement.innerHTML = `${task.title}`;

    toggleElements(
        $taskTitleElement,
        $taskCreatedElement,
        $inputElement,
        $editButton,
        $saveButton,
        $cancelButton,
        $deleteButton
    );

    showMessage(true, "Changes are saved successfully");
};

const toggleElements = (
    $taskTitleElement,
    $taskCreatedElement,
    $inputElement,
    $editButton,
    $saveButton,
    $cancelButton,
    $deleteButton
) => {
    $taskTitleElement.hidden = !$taskTitleElement.hidden;
    $taskCreatedElement.hidden = !$taskCreatedElement.hidden;
    $editButton.hidden = !$editButton.hidden;
    $inputElement.hidden = !$inputElement.hidden;
    $saveButton.hidden = !$saveButton.hidden;
    $cancelButton.hidden = !$cancelButton.hidden;
    $deleteButton.hidden = !$deleteButton.hidden;
};

const markDoneTaskHandler = (
    event,
    task,
    $taskTitleElement,
    $editButton,
    $doneButton,
    $completdBadgeElement
) => {
    task.isDone = true;
    task.doneAt = new Date().toLocaleDateString();

    event.currentTarget.remove();

    $taskTitleElement.classList.add("task-title-completed");

    $editButton.hidden = true;
    $doneButton.hidden = true;
    $completdBadgeElement.hidden = false;

    const completedIn = showCompletedTime(task.createdAt, task.doneAt);

    $completdBadgeElement.innerHTML = `Completed in ${completedIn} days`;
};

const createTaskElement = (task) => {
    const $taskElement = document.createElement("div");
    const $taskTitleElement = document.createElement("h3");
    const $taskCreatedElement = document.createElement("p");
    const $buttonWrapper = document.createElement("div");
    const $deleteButton = document.createElement("button");
    const $editButton = document.createElement("button");
    const $saveButton = document.createElement("button");
    const $cancelButton = document.createElement("button");
    const $doneButton = document.createElement("button");
    const $inputElement = document.createElement("textarea");
    const $completdBadgeElement = document.createElement("p");

    $taskElement.classList.add("task");
    $taskTitleElement.classList.add("task-title");
    $taskCreatedElement.classList.add("task-created-at");
    $buttonWrapper.classList.add(
        "flex",
        "align-items-center",
        "task-button-wrapper"
    );
    $deleteButton.classList.add("button-icon");
    $editButton.classList.add("button-icon");
    $saveButton.classList.add("button-secondary");
    $cancelButton.classList.add("button-icon");
    $doneButton.classList.add("button-icon");
    $inputElement.classList.add("task-input");
    $inputElement.rows = 3;
    $completdBadgeElement.classList.add("task-completed-badge");

    $saveButton.hidden = true;
    $completdBadgeElement.hidden = true;
    $cancelButton.hidden = true;
    $inputElement.hidden = true;

    $taskElement.id = task.id;
    $taskTitleElement.innerText = task.title;

    $taskCreatedElement.innerText = `Created At : ${showFormattedDate(
        task.createdAt
    )}`;

    $inputElement.value = task.title;

    $deleteButton.innerHTML = DELETE_ICON;
    $editButton.innerHTML = EDIT_ICON;
    $saveButton.innerHTML = "Save";
    $doneButton.innerHTML = DONE_ICON;
    $cancelButton.innerHTML = DELETE_ICON;

    if (task.isDone) {
        $taskTitleElement.classList.add("task-title-completed");

        $editButton.hidden = true;
        $doneButton.hidden = true;
        $completdBadgeElement.hidden = false;

        const completedIn = showCompletedTime(task.createdAt, task.doneAt);

        $completdBadgeElement.innerHTML = `Completed in ${completedIn} days`;
    }

    $deleteButton.addEventListener("click", (event) =>
        deleteTaskHandler(event)
    );
    $editButton.addEventListener("click", () =>
        toggleElements(
            $taskTitleElement,
            $taskCreatedElement,
            $inputElement,
            $editButton,
            $saveButton,
            $cancelButton,
            $deleteButton
        )
    );
    $cancelButton.addEventListener("click", () => {
        $inputElement.value = task.title;
        showMessage(false, "We couldn’t save your changes");
        toggleElements(
            $taskTitleElement,
            $taskCreatedElement,
            $inputElement,
            $editButton,
            $saveButton,
            $cancelButton,
            $deleteButton
        );
    });
    $saveButton.addEventListener("click", () =>
        updateTaskEditHandler(
            task,
            $taskTitleElement,
            $taskCreatedElement,
            $inputElement,
            $editButton,
            $saveButton,
            $cancelButton,
            $deleteButton
        )
    );
    $doneButton.addEventListener("click", (event) =>
        markDoneTaskHandler(
            event,
            task,
            $taskTitleElement,
            $editButton,
            $doneButton,
            $completdBadgeElement
        )
    );

    $buttonWrapper.append(
        $saveButton,
        $doneButton,
        $editButton,
        $deleteButton,
        $cancelButton,
        $completdBadgeElement
    );
    $taskElement.append(
        $taskTitleElement,
        $taskCreatedElement,
        $inputElement,
        $buttonWrapper
    );

    return $taskElement;
};

const searchTaskHandler = () => {
    const searchedTask = sanitizeInput($searchInput.value).toLowerCase();

    const searchedTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchedTask)
    );

    renderTasks(searchedTasks);
};

const renderTasks = (tasks) => {
    $taskList.innerHTML = "";
    $taskList.appendChild($inputWrapper);

    tasks.forEach((task) => {
        $taskList.appendChild(createTaskElement(task));
    });

    $taskList.appendChild($blankFieldWrapper);
};

const showInputWrapper = () => {
    if ($inputWrapper.classList.contains("hide")) {
        $createButton.innerText = "Hide";

        if (!$blankFieldWrapper.classList.contains("hide")) {
            $blankFieldWrapper.classList.add("hide");
        }
    } else {
        $createButton.innerHTML = `${PLUS_ICON} Create`;

        if (tasks.length > 0) {
            if (!$blankFieldWrapper.classList.contains("hide")) {
                $blankFieldWrapper.classList.add("hide");
            }
        } else {
            if ($blankFieldWrapper.classList.contains("hide")) {
                $blankFieldWrapper.classList.remove("hide");
            }
        }
    }

    $inputWrapper.classList.toggle("hide");
};

$addButton.addEventListener("click", addTaskHandler);
$createButton.addEventListener("click", showInputWrapper);
$searchButton.addEventListener("click", searchTaskHandler);
$clearButton.addEventListener("click", () => clearInputField($taskInput));

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(function () {
        $splashScreen.style.display = "none";

        $header.classList.remove("hide");
        $main.classList.remove("hide");
    }, 2000);
});
