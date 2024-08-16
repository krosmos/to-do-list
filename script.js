const formTitle = document.querySelector('.form-title');
const title = document.querySelector(".title");
const taskInfo = document.querySelector(".info");
const due = document.querySelector(".due");
const add = document.querySelector(".add-btn");
const time = document.querySelector(".time");
const taskList = document.querySelector(".tasklist");
const reco = document.querySelector('.recommended-task');

let Tasks = [];
document.addEventListener("DOMContentLoaded", ()=>{
    let oldTasks = loadTasks();
    Tasks = Tasks.concat(oldTasks);
    recommendTask();
});
function handleAddClick(e) {
    e.preventDefault();
    if (title.value !== "") {
        const Task = {
            title: title.value,
            info: taskInfo.value,
            date: due.value,
            time: time.value,
            id: Date.now()
        }; 
        
        saveTasks(Task);
        displayTask(Task);
        recommendTask();
        title.value = "";
        taskInfo.value = "";
        due.value = "";
        time.value = "";
    }
}
add.addEventListener('click', handleAddClick);

function displayTask(obj) {
    const taskNode = document.createElement("li");
    taskNode.dataset.taskId = obj.id;
    taskNode.innerHTML = `
        <div class="task-title-container">
        <h3 class="display-name">• ${obj.title}</h3>
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash-can del"></i></button>
        </div>
        <p class="task-desc">${obj.info}</p>
        <h6>Time: ${displayDate(obj.date)} - ${obj.time}</h6>
    `;
    taskList.appendChild(taskNode);
}
function saveTasks(taskObj) {
    Tasks.push(taskObj);
    localStorage.setItem("Tasks", JSON.stringify(Tasks));
}
function loadTasks() {
    //loop { displayTask( arr[ obj ] ) }
    let retrievedTasks = JSON.parse( localStorage.getItem('Tasks') ) || [];
    retrievedTasks.forEach(task => displayTask(task));
    return retrievedTasks;
}   

taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
        editTask(e.target.closest('.edit-btn'));
    }

    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(e.target.closest('.delete-btn'));
        }
    }
});
function editTask(editBtn) {
    const taskItem = editBtn.closest('li');
    const taskId = parseInt(taskItem.dataset.taskId, 10);

    const task = Tasks.find(task => task.id === taskId);
    if (task) {
        // Populate the form with task details for editing
        title.value = task.title;
        taskInfo.value = task.info;
        due.value = task.date;
        time.value = task.time;

        add.textContent = "Update Task";
        formTitle.textContent = `Edit Task:`;
        // Remove previous event listener to avoid multiple updates
        add.removeEventListener('click', handleAddClick);

        // Add an event listener for updating the task
        add.addEventListener('click', function handleUpdateClick(e) {
            e.preventDefault();
            if (title.value !== "") {
                // Update the task object with new values
                task.title = title.value;
                task.info = taskInfo.value;
                task.date = due.value;
                task.time = time.value;

                // Update the Tasks array and local storage
                localStorage.setItem('Tasks', JSON.stringify(Tasks));

                // Update the task display in the DOM
                taskItem.querySelector('.display-name').textContent = `• ${task.title}`;
                taskItem.querySelector('p').textContent = task.info;
                taskItem.querySelector('h6').textContent = `Time: ${displayDate(task.date)} - ${task.time}`;

                // Reset the form and button text
                title.value = "";
                taskInfo.value = "";
                due.value = "";
                time.value = "";
                add.textContent = "Add Task";
                formTitle.textContent = `Add Task:`;
                recommendTask();
                // Remove this update event listener and add back the add listener
                add.removeEventListener('click', handleUpdateClick);
                add.addEventListener('click', handleAddClick);
            }
        });
    }
}
function deleteTask(deleteBtn){
    const taskItem = deleteBtn.closest('li');
    const taskId = parseInt(taskItem.dataset.taskId, 10);
  
    taskItem.remove();
    Tasks = Tasks.filter(task => task.id !== taskId);
    (Tasks.length === 0)?reco.innerHTML = "":recommendTask();
    localStorage.setItem('Tasks', JSON.stringify(Tasks));
}


function displayDate(date){
    if(date !== ""){
    var res = date.split("-"); 
    var months = ["Jan", "Feb", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"];
    return `${res[2]} ${months[res[1]-1]}, ${res[0]}`;
    }else{
        return '';
    }
}

function recommendTask() {
    // Get the current time
    const curr = new Date();

    // Calculate time differences for all tasks
    let timeDiff = Tasks.map(task => {
        let taskDate = new Date(task.date); // Ensure date is parsed correctly
        let taskTime = timeStringToSeconds(task.time);
        // Combine the date and time
        taskDate.setSeconds(taskDate.getSeconds() + taskTime);
        let diff = taskDate - curr;
        return { id: task.id, diff: diff };
    });

    // Filter out past tasks and find the one with the minimum difference
    let futureTasks = timeDiff.filter(item => item.diff >= 0);
    if (futureTasks.length === 0) return; // No future tasks

    let minTask = futureTasks.reduce((min, current) => (current.diff < min.diff ? current : min));

    // Find the task object from the Tasks array
    let recommendedTask = Tasks.find(task => task.id === minTask.id);

    // Clear previous recommended task and display the new one
    reco.innerHTML = '';
    displayOnRecommend(recommendedTask);
}

function displayOnRecommend(task) {
    if (!task) return; // Guard clause to ensure task exists
    const taskNode = document.createElement("li");
    taskNode.dataset.taskId = task.id;
    taskNode.innerHTML = `
        <div class="task-title-container">
        <h3 class="display-name">• ${task.title}</h3>
        </div>
        <p class="task-desc">${task.info}</p>
        <h6>Time: ${displayDate(task.date)} - ${task.time}</h6>
    `;
    reco.appendChild(taskNode);
}
function timeStringToSeconds(str){
    let a = str.split(':');
    let sec = (+a[0])*60*60 + (+a[1])*60;
    return sec;
}