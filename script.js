let tasks = [];
let editIndex = -1;

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  displayTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addOrUpdateTask() {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const status = document.getElementById("status").value;

  if (!title || !desc) {
    alert("Both title and description are required!");
    return;
  }

  if (editIndex === -1) {
    tasks.push({ title, desc, status });
  } else {
    tasks[editIndex] = { title, desc, status };
    editIndex = -1;
  }

  saveTasks();
  resetForm();
  displayTasks();
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("status").value = "todo";
}

function displayTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.filter(filterLogic).forEach((task, index) => {
    taskList.innerHTML += `
                <div class="col-md-4">
                    <div class="card task-card ${getStatusClass(
                      task.status
                    )} shadow">
                        <div class="card-body">
                            <h5 class="card-title text-dark">${task.title}</h5>
                            <p class="card-text text-dark">${task.desc}</p>
                            
                            <!-- Status Dropdown -->
                            <select class="form-select form-select-sm mb-2" onchange="updateTaskStatus(${index}, this.value)">
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
                                <button class="btn btn-warning btn-sm" onclick="editTask(${index})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
  });
}

function updateTaskStatus(index, newStatus) {
  tasks[index].status = newStatus;
  saveTasks();
  displayTasks();
}

function editTask(index) {
  editIndex = index;
  document.getElementById("title").value = tasks[index].title;
  document.getElementById("desc").value = tasks[index].desc;
  document.getElementById("status").value = tasks[index].status;
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  displayTasks();
}

function filterTasks() {
  displayTasks();
}

function filterLogic(task) {
  const titleFilter = document
    .getElementById("filterTitle")
    .value.toLowerCase();
  const descFilter = document.getElementById("filterDesc").value.toLowerCase();
  const titleDescFilter = document
    .getElementById("filterTitleDesc")
    .value.toLowerCase();
  const statusFilter = document.getElementById("filterStatus").value;

  const titleMatch =
    titleFilter === "" || task.title.toLowerCase().includes(titleFilter);
  const descMatch =
    descFilter === "" || task.desc.toLowerCase().includes(descFilter);
  const titleDescMatch =
    titleDescFilter === "" ||
    task.title.toLowerCase().includes(titleDescFilter) ||
    task.desc.toLowerCase().includes(titleDescFilter);
  const statusMatch = statusFilter === "" || task.status === statusFilter;

  return titleMatch && descMatch && titleDescMatch && statusMatch;
}

function getStatusClass(status) {
  return status === "todo"
    ? "bg-danger bg-opacity-25 border border-danger"
    : status === "inprogress"
    ? "bg-warning bg-opacity-25 border border-warning"
    : "bg-success bg-opacity-25 border border-success";
}

window.onload = loadTasks;
