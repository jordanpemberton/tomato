/****************************************************************************************
 * This is the file that contains the functionality for the timer of the
        Pomodoro App.
****************************************************************************************/

//Bool functions for the start of a session
let sessionStarted = false;
let sessionEnded = true;

//Bool functions for timer funcionality
let isTimerRunning = false; //variable keeping track of if the timer is running or not

let isWorking = true;       //variable to keep track of when it is a work interval
let breakTime = false;      //variable to keep track of when it is a break interval


//Variables related to the sessions
let pomodoroTimer = {workInterval: 0, breakInterval: 0, warningTime: 0};


let timeLeftInSession = pomodoroTimer.workInterval;

let timeSpentInSession = 0;
let totalTimeInSession = 0;


// DOM Elements:

// Task Selection Input Element:
const taskSelect = document.querySelector('#task-dropdown-header');
// Currently Selected Task:
const taskSelected = document.querySelector('option.task-dropdown-option[selected=true]');

// Task time inputs:           
const setTaskHour = document.querySelector('#set-task-hour');
const setTaskMin = document.querySelector('#set-task-min');
const setTaskSec = document.querySelector('#set-task-sec');
// Break time inputs:
const setBreakHour = document.querySelector('#set-break-hour');
const setBreakMin = document.querySelector('#set-break-min');
const setBreakSec = document.querySelector('#set-break-sec');
// Warning time inputs:
const setWarningMin = document.querySelector('#set-warning-min');
const setWarningSec = document.querySelector('#set-warning-sec');
// Set Time Button:
const setTimesButton = document.querySelector('#set-times-button');

// Timer Container:
const timerContainer = document.querySelector('#timer-container');
// Timer Task Header:
const taskTitle = document.querySelector('#task-timer-title');

// Timer fill bar:
const countdownFill = document.querySelector("#countdown-fill");
// Timer countdown time:
const countdownTime = document.querySelector("#countdown-time");

// Start Button:
const startButton = document.querySelector("#timer-start-pause");
// Stop Button:
const stopButton = document.querySelector("#timer-stop");
// Skip Button:
const skipButton = document.querySelector("#timer-skip");

// Reset:
const resetButton = document.querySelector("#timer-reset");


// Set times input:
setTimesButton.addEventListener('click', function() {
    // Get current Task Name: 
    let selectedID = taskSelect.value;
    let selected = document.querySelector(`option.task-dropdown-option[value="${selectedID}"]`);
    let taskName = selected.innerText;
    
    setDurations();

    // Update timeLeftInSession for correct timer session type:
    if (isWorking) {
        timeLeftInSession = pomodoroTimer.workInterval;
    } else {
        timeLeftInSession = pomodoroTimer.breakInterval;
    }
    // Display:
    taskTitle.innerText = taskName;
    resetHeader();
    displayTimeLeft();
    event.preventDefault();
})


// Start /Pause:
startButton.addEventListener('click', function(){
    toggleTimer();
    toggleTimerVisuals();
});

// Stop:
stopButton.addEventListener('click', function(){
    toggleTimer(true);
    toggleTimerVisuals();
});

// Skip:
skipButton.addEventListener('click', function(){
    if(sessionEnded){
        console.log("session has ended");
    }
    else{
        skipSection();
    }
    toggleTimerVisuals();
});

// Reset:
resetButton.addEventListener('click', resetTimer);


/****************************************************************************************
 * Function Name: toggleTimerVisuals()
 * Description: This function checks if isTimerRunning, if timer is running, 
 * sets startButton innerText = "Pause", if timer is not running, sets 
 * startButton innerText = "Start". 
****************************************************************************************/
function toggleTimerVisuals() {
    // If timer is running:
    if (isTimerRunning){
        // startButton.innerText = "Pause";
        startButton.innerHTML = '<i title="Pause Timer" class="fa fa-pause"></i>';
        timerContainer.classList.add('running');
    } 
    // If timer is not running:
    else {
        // startButton.innerText = "Start";
        startButton.innerHTML = '<i title="Start Timer" class="fa fa-play"></i>';
        timerContainer.classList.remove('running');
    }
}


/****************************************************************************************
 * Function Name: resetTimer()
 * Description: Restarts the current timer from start.
****************************************************************************************/
function resetTimer() {
    // Display time spent:
    totalTimeInSession = timeSpentInSession;
    displayTotalTimeOnTask();
    // Reset time spent:
    timeSpentInSession = 0;
    // Reset time left = work or break duration:
    if (isWorking) {
        timeLeftInSession = pomodoroTimer.workInterval;
    }
    if (breakTime) {
        timeLeftInSession = pomodoroTimer.breakInterval;
    }
    // Session?
    // sessionEnded = true;
    // sessionStarted = false;

    // Display new countdown:
    resetHeader();
    toggleTimerVisuals();
    displayTimeLeft();    
}


/****************************************************************************************
 * Function Name: toggleTimer(reset)
 * Description: This function takes one boolean argument, if that argument is
        true, the toggleTimer function ends the session. Otherwise, the
        toggleTimer function will start or stop the timer. Otherwise the function
        changes the state of the timer based off of a number of factors.
****************************************************************************************/
function toggleTimer(reset){
    if(reset){
        //ends the session
        if(!sessionStarted){
            console.log("session already over");
        }
        else{
            stopClock();                            //stops the session entirely
        }
    }
    //if the stop button is not pressed
    else{
        if(!sessionStarted){            //if the session hasn't started (before a time is put in for timer)
            if (pomodoroTimer.workInterval > 0) {
                sessionStarted = true;      //starts the session
            }
        }
        if(isTimerRunning){             //if the timer is running, stops the timer
            clearInterval(clockTimer);
            isTimerRunning = false;
        }
        else{                           //if user tries to toggle the timer when there is no time left in the session
            if(timeLeftInSession <= 0){
                console.log("no time"); //placeholder for possible front-end alert window
            }
            else{
                sessionEnded = false;   //this line is to allow for multiple trials of testing without refreshing the browser
                isTimerRunning = true;  //sets the timer to running
                //the actual process of counting down the timer
                clockTimer = setInterval(function(){
                    timeLeftInSession--;
                    if(isWorking){
                        timeSpentInSession++;       //while the work interval timer is running, adds time spent to the session
                    }
                    if(timeLeftInSession <= 0){     //when the timer reaches zero by counting down, switches intervals and continues
                        if(isWorking){
                            timeLeftInSession = pomodoroTimer.breakInterval;
                            swapSection();
                            displaySessionType();
                            resetHeader(); //added 8/8 ddk
                        }
                        else{
                            timeLeftInSession = pomodoroTimer.workInterval;
                            swapSection();
                            displaySessionType();
                            resetHeader(); //added 8/8 ddk
                        }
                    }
                    intervalWarning(pomodoroTimer.warningTime);
                    displayTimeLeft();
                }, 1000);   //set interval uses milliseconds, so this sets the interval of the timer to one second
            }
        }
    }
}


/****************************************************************************************
 * Function Name: displayTimeLeft()
 * Description: This function handles the updating of the timer. Inside of this
    function is the leadingZeros function, which adds a leading zero in front of a time
    value to maintain the time format HH:MM:SS throughout the timer. The function then
    displays the timer to a div in the HTML with the ID "pomodoro Timer".
****************************************************************************************/
function displayTimeLeft(){
    let timeRemaining = timeLeftInSession;
    let timeDisplayed = ' ';
    let seconds = timeRemaining % 60;

    let minutes = parseInt(timeRemaining / 60)  % 60;
    let hours = parseInt(timeRemaining / 3600);
    //following adds leading zeros for format: 00:00:00
    function leadingZeros(time){
        if(time < 10){
            return `0${time}`;
        }
        else{
            return time;
        }
    }
    if(hours > 0){
        timeDisplayed += `${leadingZeros(hours)}:` //adds the hours to the timer if there are any
    }
    timeDisplayed += `${leadingZeros(minutes)}:${leadingZeros(seconds)}` //adds the minutes and seconds to timer

    // Set displayed countdown time:
    countdownTime.innerText = timeDisplayed.toString();
    // Fill bar:
    displayFillBar();
}


/****************************************************************************************
 * Function Name: displayFillBar()
 * Description: This function updates the visual fill bar for the countdown.
****************************************************************************************/
function displayFillBar(){
    let fillPercent;
    // If work session:
    if (isWorking) {
        fillPercent = (pomodoroTimer.workInterval-timeLeftInSession) /pomodoroTimer.workInterval *100;
    }
    else if (breakTime) {
        fillPercent = (pomodoroTimer.breakInterval-timeLeftInSession) /pomodoroTimer.breakInterval *100;
    }
    countdownFill.style.setProperty('--countdown-fill-width', `${fillPercent}%`);
}

/****************************************************************************************
 * Function Name: intervalWarning()
 * Description: This function displays a warning by changing the color of the header
 * when the timer gets below a set interval
****************************************************************************************/

function intervalWarning(timeInSeconds){
    let warningTime = timeInSeconds;

    if(isWorking){
        if(timeLeftInSession == warningTime){
            document.querySelector('.navbar').classList.add("timer-warning");
            document.querySelector('#work-warning').classList.add('tw-show');
        }
    }
    else if (breakTime){
        if(timeLeftInSession == warningTime){
            document.querySelector('.navbar').classList.add('break-warning');
            document.querySelector('#break-warning').classList.add('bw-show');
        }
    }
}
/****************************************************************************************
 * Function Name: resetHeader()
 * Description: This function resets the warning header to its original color when the 
 * clock stops.
****************************************************************************************/
function resetHeader(){
    document.querySelector('.navbar').classList.remove('timer-warning');
    document.querySelector('.navbar').classList.remove('break-warning');
    document.querySelector('#break-warning').classList.remove('bw-show');
    document.querySelector('#work-warning').classList.remove('tw-show');
}
/****************************************************************************************
 * Function Name: stopClock()
 * Description: This function stops the clock, and sets the timer to 0, signalling the
    end of the session. The function then sets the total Time spent in the session to
    the accumulator time working and resets the boolean variables to start a fresh new
    section.
****************************************************************************************/
function stopClock(){
    clearInterval(clockTimer);
    isTimerRunning = false;
    timeLeftInSession = 0;
    totalTimeInSession = timeSpentInSession;
    displayTotalTimeOnTask();
    timeSpentInSession = 0;
    isWorking = true;
    breakTime = false;
    sessionEnded = true;
    sessionStarted = false;
    displayTimeLeft();
    displaySessionType();
}


/****************************************************************************************
 * Function Name: skipSection()
 * Description: This function switches the timer to the next section. So if the timer is
    currently on the working interval it gets switched to the break interval and vice
    versa
****************************************************************************************/
function skipSection(){
    swapSection();
    if(isWorking){
        timeLeftInSession = pomodoroTimer.workInterval;
    }
    else{
        timeLeftInSession = pomodoroTimer.breakInterval;
    }
    displayTimeLeft();
    displaySessionType();
}


/****************************************************************************************
 * Function Name: swapSection()
 * Description: This function swaps the boolean variables for is working and on break.
    This function is used throughout the file to simulate switching work/break intervals
****************************************************************************************/
function swapSection(){
    if(isWorking){
        isWorking = false;
        breakTime = true;
    }
    else{
        isWorking = true;
        breakTime = false;
    }
    // Reset fill bar: 
    displayFillBar();
}

/****************************************************************************************
 * Function Name: displaySessionType()
 * Description: This function displays which interval (work or break) the timer is running.
 * If work timer, displays the name of the current task.
****************************************************************************************/
function displaySessionType(){
    // Break Timer:
    if(breakTime){
        timerContainer.classList.remove('task-timer');
        timerContainer.classList.add('break-timer');
    }
    // Task Timer:
    else{
        timerContainer.classList.remove('break-timer');
        timerContainer.classList.add('task-timer'); 
    }
}


/****************************************************************************************
 * Function Name: displayTotalTimeOnTask()
 * Description:
****************************************************************************************/
function displayTotalTimeOnTask(){
    var totalTime = totalTimeInSession;
    var displayTimer = document.getElementById("total task");
    var timeDisplayed = " ";
    let seconds = totalTime % 60;

    let minutes = parseInt(totalTime / 60)  % 60;
    let hours = parseInt(totalTime / 3600);
    function leadingZeros(time){
        if(time < 10){
            return `0${time}`;
        }
        else{
            return time;
        }
    }
    if(hours > 0){
        timeDisplayed += `${leadingZeros(hours)}:` //adds the hours to the timer if there are any
    }
    timeDisplayed += `${leadingZeros(minutes)}:${leadingZeros(seconds)}` //adds the minutes and seconds to timer
    displayTimer.innerText = timeDisplayed.toString();
    document.getElementById("total_time").value = totalTimeInSession
}


/****************************************************************************************
 * Function Name: setDurations()
 * Description: This function gets time inputs for both timers (given initially), 
 * converts to seconds, and sets workInterval and breakInterval to those given times.
****************************************************************************************/
function setDurations(){
    // If no session already started:
    if(!sessionStarted){ 
        // Set task time:
        let taskHour = parseInt(document.querySelector("#set-task-hour").value);
        let taskMin = parseInt(document.querySelector("#set-task-min").value);
        let taskSec = parseInt(document.querySelector("#set-task-sec").value);
        
        let taskHourToSec = taskHour * 60 * 60;
        let taskMinToSec = taskMin * 60;
        let totalTaskSec = taskHourToSec + taskMinToSec + taskSec;

        if (totalTaskSec > 0) {
            pomodoroTimer.workInterval = totalTaskSec;
        }

        // Set break time:
        let breakHour = parseInt(document.querySelector("#set-break-hour").value);
        let breakMin = parseInt(document.querySelector("#set-break-min").value);
        let breakSec = parseInt(document.querySelector("#set-break-sec").value);

        let breakHourToSec = breakHour * 60 * 60;
        let breakMinToSec = breakMin * 60;
        let totalBreakSec = breakHourToSec + breakMinToSec + breakSec;

        pomodoroTimer.breakInterval = totalBreakSec;

        // Set warning time: 
        let warningMin = parseInt(document.querySelector('#set-warning-min').value);
        let warningSec = parseInt(document.querySelector("#set-warning-sec").value);

        let warningMinToSec = warningMin * 60;
        let totalWarningSec = warningMinToSec + warningSec;
        pomodoroTimer.warningTime = totalWarningSec;
    }
}



//to display the timer initially
displayTimeLeft();
displaySessionType();