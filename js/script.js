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
    $allFilterButton,
    $incompleteFilterButton,
    $completedFilterButton,
    $paginationButton,
} from "./element.js";
import {
    sanitizeInput,
    showCompletedTime,
    showFormattedDate,
    clearInputField,
    showMessage,
} from "./utility.js";
import {
    DELETE_ICON,
    EDIT_ICON,
    DONE_ICON,
    PLUS_ICON,
    CANCEL_ICON,
} from "./svg.js";
import { ALL, INCOMPLETE, COMPLETED } from "./const.js";

let tasks = [];

let filterBy = ALL;

const START_INDEX = 0;
const TASK_PER_PAGE = 9;
let endIndex;
let currentPage = 1;
let totalPage = 1;
let pageAdjustmentCount;

const addTaskHandler = () => {
    const taskTitle = sanitizeInput($taskInput.value);

    if (!taskTitle) {
        showMessage(false, "You can not add a todo item without a title.");

        return;
    }

    const task = createTask(taskTitle);

    tasks.unshift(task);

    clearInputField($taskInput);

    if (tasks.length === 1) {
        toggleFilterElements();

        handleActiveFilter();
    }

    showMessage(true, "Task added successfully.");

    handlePageTasks();
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

const deleteTaskHandler = (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);

    if (tasks.length === 0) {
        toggleFilterElements();

        handleActiveFilter();
    }
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

    toggleEditElements(
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

const toggleEditElements = (
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

const toggleFilterElements = () => {
    $allFilterButton.classList.toggle("button-inactive");
    $allFilterButton.classList.toggle("button-active");
    $incompleteFilterButton.classList.toggle("button-inactive");
    $incompleteFilterButton.classList.toggle("button-active");
    $completedFilterButton.classList.toggle("button-inactive");
    $completedFilterButton.classList.toggle("button-active");
};

const markDoneTaskHandler = (
    event,
    task,
    $taskTitleElement,
    $editButton,
    $doneButton,
    $saveButton,
    $completdBadgeElement
) => {
    if (!$saveButton.hidden) {
        $saveButton.click();
        if ($editButton.hidden) {
            return;
        }
    }

    task.isDone = true;
    task.doneAt = new Date().toLocaleDateString();

    event.currentTarget.remove();

    $taskTitleElement.classList.add("task-title-completed");

    $editButton.hidden = true;
    $doneButton.hidden = true;
    $completdBadgeElement.hidden = false;

    const completedIn = showCompletedTime(task.createdAt, task.doneAt);

    $completdBadgeElement.innerHTML = `Completed in ${completedIn} days`;

    handlePageTasks();
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
    $cancelButton.innerHTML = CANCEL_ICON;

    if (task.isDone) {
        $taskTitleElement.classList.add("task-title-completed");

        $editButton.hidden = true;
        $doneButton.hidden = true;
        $completdBadgeElement.hidden = false;

        const completedIn = showCompletedTime(task.createdAt, task.doneAt);

        $completdBadgeElement.innerHTML = `Completed in ${completedIn} days`;
    }

    $deleteButton.addEventListener("click", () => deleteTaskHandler(task.id));
    $editButton.addEventListener("click", () =>
        toggleEditElements(
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
        toggleEditElements(
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
            $saveButton,
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
    let searchedTasks = searchTasks($searchInput.value);

    if (filterBy !== ALL) {
        searchedTasks = filterTasks(searchedTasks);
    }

    renderTasks(searchedTasks);
};

const getPaginatedList = (tasks) => {
    if ($inputWrapper.classList.contains("hide")) {
        endIndex = currentPage * TASK_PER_PAGE;
        pageAdjustmentCount = 1;
    } else {
        endIndex = currentPage * TASK_PER_PAGE - 1;
        pageAdjustmentCount = 0;
    }

    totalPage =
        Math.floor((tasks.length - pageAdjustmentCount) / TASK_PER_PAGE) + 1;

    if (totalPage > 1) {
        $paginationButton.classList.remove("hide");
    } else {
        $paginationButton.classList.add("hide");
    }

    if (currentPage < totalPage) {
        $paginationButton.textContent = "Load More";
    } else {
        $paginationButton.textContent = "Show Less";
    }

    return tasks?.slice(START_INDEX, endIndex);
};

const paginationHandler = () => {
    if (currentPage < totalPage) {
        currentPage += 1;
    } else {
        currentPage = 1;
    }

    handlePageTasks();
};

const searchTasks = (searchInput) => {
    const searchedTask = sanitizeInput(searchInput).toLowerCase();

    return tasks.filter((task) =>
        task.title.toLowerCase().includes(searchedTask)
    );
};

const handleSearchButton = () => {
    $searchInput.value = "";

    $searchInput.hidden = !$searchInput.hidden;

    if (!$searchInput.hidden) {
        $searchInput.focus();
    } else {
        handlePageTasks();
    }
};

const handleFilteredTasks = () => {
    let filteredTasks = tasks;

    if ($searchInput.value !== "") {
        filteredTasks = searchTasks($searchInput.value);
    }

    filteredTasks = filterTasks(filteredTasks);

    renderTasks(filteredTasks);
};

const filterTasks = (tasks) => {
    if (filterBy === INCOMPLETE) {
        return tasks.filter((task) => !task.isDone);
    } else if (filterBy === COMPLETED) {
        return tasks.filter((task) => task.isDone);
    }

    return tasks;
};

const handleActiveFilter = () => {
    $allFilterButton.classList.remove("active-filter");
    $incompleteFilterButton.classList.remove("active-filter");
    $completedFilterButton.classList.remove("active-filter");

    if (filterBy === ALL) {
        $allFilterButton.classList.add("active-filter");
    } else if (filterBy === INCOMPLETE) {
        $incompleteFilterButton.classList.add("active-filter");
    } else {
        $completedFilterButton.classList.add("active-filter");
    }
};

const handlePageTasks = () => {
    let pageTasks = tasks;

    if ($searchInput.value !== "") {
        pageTasks = searchTasks($searchInput.value);
    }

    if (filterBy !== ALL) {
        pageTasks = filterTasks(pageTasks);
    }

    renderTasks(pageTasks);
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

    handlePageTasks();
};

const renderTasks = (tasks) => {
    $taskList.innerHTML = "";
    $taskList.appendChild($inputWrapper);

    const paginatedTasks = getPaginatedList(tasks);

    paginatedTasks.forEach((task) => {
        $taskList.appendChild(createTaskElement(task));
    });

    $taskList.appendChild($blankFieldWrapper);
};

$addButton.addEventListener("click", addTaskHandler);
$createButton.addEventListener("click", showInputWrapper);
$blankFieldWrapper.addEventListener("click", showInputWrapper);
$searchButton.addEventListener("click", handleSearchButton);
$searchInput.addEventListener("input", searchTaskHandler);
$clearButton.addEventListener("click", () => clearInputField($taskInput));

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(function () {
        $splashScreen.style.display = "none";

        $header.classList.remove("hide");
        $main.classList.remove("hide");
    }, 2000);
});

$allFilterButton.addEventListener("click", () => {
    filterBy = ALL;

    handleActiveFilter();

    handleFilteredTasks();
});
$incompleteFilterButton.addEventListener("click", () => {
    filterBy = INCOMPLETE;

    handleActiveFilter();

    handleFilteredTasks();
});
$completedFilterButton.addEventListener("click", () => {
    filterBy = COMPLETED;

    handleActiveFilter();

    handleFilteredTasks();
});

$paginationButton.addEventListener("click", paginationHandler);
