
// When the DOM is fully loaded, execute the following code
document.addEventListener("DOMContentLoaded", () => {
    // Selecting tags from HTML
    const todoForm = document.forms.todo;
    const taskInput = document.querySelector("#task");
    const listContainer = document.getElementById("list-container");


    // Function to add a new task
    function addTask(taskText, checked) {

        const item = document.createElement("li");

        // Create a checkbox input
        const checkbox = document.createElement("input");
        checkbox.classList.add("check-box");
        checkbox.type = "checkbox";
        checkbox.checked = checked;
        checkbox.addEventListener("change", completeTask);


        // Create a label for the task text
        const label = document.createElement("label");
        label.textContent = taskText;
        if (checked) {
            label.style.textDecoration = "line-through";
        }


        // Create dump (delete) button
        const dumpBtn = document.createElement("span");
        dumpBtn.innerHTML = "\u00d7";
        dumpBtn.addEventListener("click", deleteTask);


        // Create edit button
        const editBtn = document.createElement("span");
        editBtn.classList.add("edit");
        editBtn.innerHTML = "🖉";
        editBtn.addEventListener("click", editTask);


        // Create save button
        const saveBtn = document.createElement("span");
        saveBtn.classList.add("edit");
        saveBtn.innerHTML = "💾";
        saveBtn.classList.add("hide");
        saveBtn.addEventListener("click", saveEdit);

        // Create alarm button
        const alarmBtn = document.createElement("span");
        alarmBtn.classList.add("alarm");
        alarmBtn.innerHTML ="&#9201";
        alarmBtn.addEventListener("click", alarmTask);

        item.appendChild(alarmBtn);
        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(dumpBtn);
        item.appendChild(editBtn);
        item.appendChild(saveBtn);

        listContainer.appendChild(item);

    }

    // Function to handle task completion
    function completeTask() {

        const label = this.nextElementSibling;
        label.style.textDecoration = this.checked ? "line-through" : "none";

        const isChecked = this.checked;
        const originalState = this.getAttribute("data-original-state") === "true";

        const confirmationMessage = isChecked
            ? "Are you sure you want to mark this task as completed?"
            : "Are you sure you want to mark this task as not completed?";

        const userResponse = window.confirm(confirmationMessage);

        if (userResponse) {
            if (isChecked) {
                alert("Congrats! You completed a task.");
            }
        } else {
            this.checked = originalState;
        }

        // Hide the edit button when the checkbox is checked.
        const editBtn = this.parentElement.querySelector(".edit");
        if (editBtn) {
            editBtn.style.display = this.checked ? "none" : "inline";
        }

        // Also hide the alarm button when the checkbox is checked.
        const alarmBtn = this.parentElement.querySelector(".alarm");
        if (alarmBtn) {
            alarmBtn.style.display = this.checked ? "none" : "inline";
        }

        label.style.textDecoration = this.checked ? "line-through" : "none";
        saveTasks();
    }


    // Function to delete a task.
    function deleteTask() {

        const item = this.parentElement;

        // Ask for confirmation using a confirm alert or Popup.
        const confirmationMessage = "Are you sure you want to delete this task?";
        const userResponse = window.confirm(confirmationMessage);
    
        if (userResponse) {
            // User confirmed the action, Then remove the task.
            item.remove();
            saveTasks();
        } else {
            // User canceled the action, do nothing.
        }
    }

    // Function to edit a task.
    function editTask() {
        const item = this.parentElement;
        const label = item.querySelector("label");
        label.setAttribute("contenteditable", true);
        this.classList.add("hide");
        this.nextElementSibling.classList.remove("hide");
    }

    // Function to save edited task
    function saveEdit() {
        const item = this.parentElement;
        const label = item.querySelector("label");
        label.removeAttribute("contenteditable");
        this.classList.add("hide");
        this.previousElementSibling.classList.remove("hide");
        saveTasks();
    }

    
    // Function to set alarm task
    function alarmTask() {
      // code to open popup alarm
      let popup = document.getElementById("popup");
      popup.classList.add("open-popup");
    }
  
    // Function to close the popup
    function closePopup() {
      let popup = document.getElementById("popup");
      popup.classList.remove("open-popup");
    }

    // Attach an event listener to the "closePopup" button
    let closePopupButton = document.getElementById("closePopupButton");
    closePopupButton.addEventListener("click", closePopup)

  
  //  Closing Saved Alarm messege when click on OK button
   function closeAlarmAlert(){
    let msg = document.getElementById("alertMessege");
    msg.classList.remove("closeAlertMessege");
   }
   let okBtn = document.getElementById("closeBtn");
   okBtn.addEventListener("click",closeAlarmAlert);
    
    
    

    // Function to save tasks to local storage
    function saveTasks() {
        const tasks = [];
        const items = listContainer.querySelectorAll("li");

        items.forEach((item) => {
            const label = item.querySelector("label");
            const checkbox = item.querySelector("input[type='checkbox']");
            const editButton = item.querySelector(".edit");
            const editButtonHidden = editButton.classList.contains("hide");
            tasks.push({ text: label.textContent, checked: checkbox.checked });
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Load saved tasks from local storage
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        savedTasks.forEach((taskData) => {
            addTask(taskData.text, taskData.checked);

            // // Hide the edit button when checkbox is checked.
            const checkbox = listContainer.lastElementChild.querySelector(".check-box");
            if (checkbox.checked) {
                const editBtn = listContainer.lastElementChild.querySelector(".edit");
                editBtn.style.display = "none"; 
            }

        });
    }

    // Load saved tasks when the page loads
    loadTasks();
    

    // Add a new task when the form is submitted
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText === "") {
          // Show an alert if the task text is empty
          alert("Please add your task first then click on 'Add button' ");
          return; // Don't proceed further
        }
        else if (taskText !== "") {
            addTask(taskText, false);
            taskInput.value = "";
            saveTasks();
        }
    });

    
});




// Creating a Alarm //

// set our variables
var time, alarm, currentH, currentM,
    activeAlarm = false,
    sound = new Audio("https://freesound.org/data/previews/316/316847_4939433-lq.mp3");

/*
  audio sound source: https://freesound.org/people/SieuAmThanh/sounds/397787/
*/

// loop alarm
sound.loop = true;

// define a function to display the current time
function displayTime() {
  var now = new Date();
  time = now.toLocaleTimeString();
  clock.textContent = time;
  // time = "1:00:00 AM";
  // watch for alarm
  if (time === alarm) {
    sound.play();

    popup.classList.add("open-popup");
    
    // show snooze button
    snooze.className = "";
  }
  setTimeout(displayTime, 1000);
}
displayTime();

// add option values relative towards time
function addMinSecVals(id) {
  var select = id;
  var min = 59;
  
  for (i = 0; i <= min; i++) {
    // defined as new Option(text, value)
    select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i < 10 ? "0" + i : i);
  }
}
function addHours(id) {
  var select = id;
  var hour = 12;
  
  for (i = 1; i <= hour; i++) {
    // defined as new Option(text, value)
    select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i);
  }
}
addMinSecVals(minutes);
addMinSecVals(seconds);
addHours(hours);

// set and clear alarm
startstop.onclick = function() {
  
  // set the alarm
  if (activeAlarm === false) {
    
    hours.disabled = true;
    minutes.disabled = true;
    seconds.disabled = true;
    ampm.disabled = true;
    
    alarm = hours.value + ":" + minutes.value + ":" + seconds.value + " " + ampm.value;
    this.textContent = "Clear Alarm";
    activeAlarm = true;
    
    // To show popup of saved alarm message.
    let msg = document.getElementById("alertMessege");
    msg.classList.add("closeAlertMessege");

    // To remove popup window when click on Set Alarm
    popup.classList.remove("open-popup",);
    
  } else {
    // clear the alarm
    hours.disabled = false;
    minutes.disabled = false;
    seconds.disabled = false;
    ampm.disabled = false;
    
    sound.pause();
    alarm = "00:00:00 AM";
    this.textContent = "Set Alarm";
    
    // hide snooze button
    snooze.className = "hide";
    activeAlarm = false;
  }
};

// snooze for 5 minutes
snooze.onclick = function() {
  popup.classList.remove("open-popup");
  if (activeAlarm === true) {
    // grab the current hour and minute
    currentH = time.substr(0, time.length - 9);
    currentM = time.substr(currentH.length + 1, time.length - 8);
    
    if (currentM >= "55") {
      minutes.value = "00";
      hours.value = parseInt(currentH) + 1;
    } else {
      if (parseInt(currentM) + 5 <= 9) {
        minutes.value = "0" + parseInt(currentM + 5);
      } else {
        minutes.value = parseInt(currentM) + 5;
      }
    }
    
    // hide snooze button
    snooze.className = "hide";
    
    // now reset alarm
    startstop.click();
    startstop.click();
  } else {
    return false;
  }
};


