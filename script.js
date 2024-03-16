const TaskList = [];
function addTask(){
    let taskname = document.querySelector('.js-taskname');
    let taskdate = document.querySelector('.js-taskdate');
    const taskObj = {name: taskname.value, date: taskdate.value};
    TaskList.push(taskObj);
    
    displayTask();
    taskname.value = '';
    taskdate.value = '';
}
function displayTask(){
    let listBox = document.querySelector('.js-taskList');
    let display = '';
    for(let i = 0;i < TaskList.length; i++){
        let tempObj = TaskList[i];

        let task = `
            <div></div>
            <div>${tempObj.name}</div>
            <div>${tempObj.date}</div>
            <button class="Done-btn" onclick="
                removeTask(${i});
            ">Done</button>
            <div></div>
        `;
        display += task;
    }
    listBox.innerHTML = display;
}
function removeTask(index){
    TaskList.splice( index, 1);
    displayTask();
}