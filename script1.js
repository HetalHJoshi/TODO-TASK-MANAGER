let tasks = [];

// Load tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
  displayTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add or Update Task
function addOrUpdateTask() {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const status = document.getElementById("status").value;
  const taskId = document.getElementById("taskId").value.trim();

  if (!title || !desc) {
    alert("Both title and description are required!");
    return;
  }

  if (taskId) {
    // Update existing task
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].title = title;
      tasks[taskIndex].desc = desc;
      tasks[taskIndex].status = status;
    }
  } else {
    // Add new task with UUID
    const newTask = {
      id: crypto.randomUUID(),
      title,
      desc,
      status,
    };
    tasks.push(newTask);
  }

  saveTasks();
  resetForm();
  displayTasks();
}

// Reset Form Fields
function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("status").value = "todo";
  document.getElementById("taskId").value = "";
}

// Display Tasks with Filters
function displayTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  // Get filter values
  const filterTitle = document
    .getElementById("filterTitle")
    .value.toLowerCase();
  const filterDesc = document.getElementById("filterDesc").value.toLowerCase();
  const filterTitleDesc = document
    .getElementById("filterTitleDesc")
    .value.toLowerCase();
  const filterStatus = document.getElementById("filterStatus").value;

  tasks
    .filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(filterTitle);
      const descMatch = task.desc.toLowerCase().includes(filterDesc);
      const titleDescMatch =
        task.title.toLowerCase().includes(filterTitleDesc) ||
        task.desc.toLowerCase().includes(filterTitleDesc);
      const statusMatch = filterStatus === "" || task.status === filterStatus;

      return titleMatch && descMatch && titleDescMatch && statusMatch;
    })
    .forEach((task) => {
      taskList.innerHTML += `
                <div class="col-md-4">
                    <div class="card ${getStatusClass(task.status)} shadow">
                        <div class="card-body">
                            <h5 class="card-title">${task.title}</h5>
                            <p class="card-text">${task.desc}</p>
                            <select class="form-select form-select-sm mb-2" onchange="updateTaskStatus('${
                              task.id
                            }', this.value)">
                                <option value="todo" ${
                                  task.status === "todo" ? "selected" : ""
                                }>To Do</option>
                                <option value="inprogress" ${
                                  task.status === "inprogress" ? "selected" : ""
                                }>In Progress</option>
                                <option value="done" ${
                                  task.status === "done" ? "selected" : ""
                                }>Done</option>
                            </select>
                            <div class="mt-3 d-flex justify-content-between">
                                <button class="btn btn-warning btn-sm" onclick="editTask('${
                                  task.id
                                }')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteTask('${
                                  task.id
                                }')">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });
}

// Filter Tasks (Trigger on Input Change)
function filterTasks() {
  displayTasks();
}

// Update Task Status
function updateTaskStatus(id, newStatus) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
    displayTasks();
  }
}

// Edit Task
function editTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    document.getElementById("title").value = task.title;
    document.getElementById("desc").value = task.desc;
    document.getElementById("status").value = task.status;
    document.getElementById("taskId").value = task.id;
  }
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  displayTasks();
}

// Get Status Class for Styling
function getStatusClass(status) {
  return status === "todo"
    ? "bg-danger bg-opacity-25 border border-danger"
    : status === "inprogress"
    ? "bg-warning bg-opacity-25 border border-warning"
    : "bg-success bg-opacity-25 border border-success";
}

// Initialize
document.addEventListener("DOMContentLoaded", loadTasks);
