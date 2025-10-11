import Run from "./Run.js";

// Array to hold all runs
let runs = [];

// If this is null it means we're adding a run in the form
// If this is an int, we're editing the run at that index
let editingIndex = null;

// Store current way runs are being sorted
// You can store a method in a variable!?
let currentSort = () => sortByDate(true);

// document.getElementById(...) looks into the HTML and grabs the element with that ID.
const form = document.getElementById("runForm"); // The form
const runsList = document.getElementById("runsList"); // The list displaying runs

const deleteButton = document.getElementById("deleteAllButton");
const cancelEditBtn = document.getElementById("cancelEditBtn"); // new button in HTML, hidden by default

const sortDateCButton = document.getElementById("sortDateC");
const sortDateNCButton = document.getElementById("sortDateNC");
const sortDistanceAButton = document.getElementById("sortDistanceA");
const sortDistanceDButton = document.getElementById("sortDistanceD");
const sortTimeAButton = document.getElementById("sortTimeA");
const sortTimeDButton = document.getElementById("sortTimeD");
const sortPaceAButton = document.getElementById("sortPaceA");
const sortPaceDButton = document.getElementById("sortPaceD");

// Load runs from localStorage when the page first opens
// localStorage is a little 'storage box' in every browser that isnt cleared until the user deletes it.
// localStorage stores key-value pairs for us
// DOMContentLoaded is an event that fires when HTML has loaded, so it is now safe to load from localStorage
window.addEventListener("DOMContentLoaded", loadRuns);

// When page is loaded
document.addEventListener("DOMContentLoaded", () => {
    setActiveSortButton("sortDateC");
});

// Listen for form submission
form.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page reload

    // Get values from inputs
    const date = document.getElementById("runDate").value;
    const distance = document.getElementById("distance").value;
    const hours = parseInt(document.getElementById("hours").value) || 0;;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value);

    const totalTime = hours * 3600 + minutes * 60 + seconds;

    if (hours == 0 && minutes == 0 && seconds == 0) {
        alert("You must enter a time greater than zero!");
        return;
    }

    if (editingIndex === null) {
        // Add new run
        let run = new Run(date, distance, hours, minutes, seconds);
        runs.push(run);
    } else {
        // Edit existing run
        runs[editingIndex] = new Run(date, distance, hours, minutes, seconds);
        editingIndex = null; // back to add mode
        submitBtn.textContent = "Add Run";
        cancelEditBtn.style.display = "none";
    }

    // Show all delete buttons again
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    });

    currentSort();

    // Update display
    displayRuns();

    // Save runs permanently so they stay even after refresh
    saveRuns();

    // Reset form
    form.reset();
});

cancelEditBtn.addEventListener("click", () => {
    form.reset();
    editingIndex = null;
    submitBtn.textContent = "Add Run";
    cancelEditBtn.style.display = "none";

    // Remove highlight from all runs
    document.querySelectorAll(".run-entry").forEach(el => el.classList.remove("editing"));

    // Show all delete buttons again
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
});

});

deleteButton.addEventListener("click", function() {
    if (confirm("Are you sure you want to delete all runs?")) {
    // Clear the runs array
    runs = [];

    // Remove from localStorage
    localStorage.removeItem("runs");

    // Clear the displayed list
    runsList.innerHTML = "";
    }
});

sortDateCButton.addEventListener("click", () => {
    // Sort runs array by date
    sortByDate(true);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortDateC");
});

sortDateNCButton.addEventListener("click", () => {
    // Sort runs array by date
    sortByDate(false);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortDateNC");
});

sortDistanceAButton.addEventListener("click", () => {
    // Sort runs array by distance
    sortByDistance(true);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortDistanceA");
});

sortDistanceDButton.addEventListener("click", () => {
    // Sort runs array by distance
    sortByDistance(false);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortDistanceD");
});

sortTimeAButton.addEventListener("click", () => {
    // Sort runs array by time
    sortByTime(true);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortTimeA");
});

sortTimeDButton.addEventListener("click", () => {
    // Sort runs array by time
    sortByTime(false);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortTimeD");
});

sortPaceAButton.addEventListener("click", () => {
    // Sort runs array by pace
    sortByPace(true);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortPaceA");
});

sortPaceDButton.addEventListener("click", () => {
    // Sort runs array by pace
    sortByPace(false);
    
    // Re-render the runs
    displayRuns();

    // Grey out currently used sort button
    setActiveSortButton("sortPaceD");
});

// Display all runs
function displayRuns() {
    runsList.innerHTML = ""; // clear old content displayed on page already

    runs.forEach((run, index) => {
        const runEntry = createRunEntry(run, index); // create a <div> for this run
        runsList.appendChild(runEntry);
    });
}

// Create a single run entry (text + delete button)
function createRunEntry(run, index) {
    const pace = run.getPace();

    const runEntry = document.createElement("div"); // Create a <div> element to hold everything
    runEntry.classList.add("run-entry"); // add CSS class to runEntry

    // Text
    const runText = document.createElement("span"); // Create a <span> to hold the run information
    runText.textContent = `${run.date} - ${run.distance} km in ${run.hours}h ${run.minutes}m ${run.seconds}s (Pace: ${pace})`;

    // Delete button
    const deleteBtn = document.createElement("button"); // Create <button> element
    deleteBtn.textContent = "X"; // Set "X" as button text
    deleteBtn.classList.add("delete-btn"); // add CSS class to deleteBtn
    deleteBtn.addEventListener("click", () => deleteRun(index));

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => editRun(index));

    // Add both to the container
    runEntry.appendChild(runText);
    runEntry.appendChild(editBtn);
    runEntry.appendChild(deleteBtn);

    return runEntry; // Return the fully built div so it can be added to runsList
}

// Delete a run by index
function deleteRun(index) {
    runs.splice(index, 1);                        // remove from array
    localStorage.setItem("runs", JSON.stringify(runs));  // update storage
    displayRuns();                                // refresh display
}

function editRun(index) {
    editingIndex = index; // Specify which index of runs is currently being edited

    const run = runs[index];

    document.getElementById("runDate").value = run.date;
    document.getElementById("distance").value = run.distance;
    document.getElementById("hours").value = run.hours;
    document.getElementById("minutes").value = run.minutes;
    document.getElementById("seconds").value = run.seconds;

    submitBtn.textContent = "Save Run";
    cancelEditBtn.style.display = "inline"; // show cancel button

    // Highlight current run being edited
    document.querySelectorAll(".run-entry").forEach((el, i) => {
        el.classList.toggle("editing", i === index);
    });

    // Hide all delete buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.disabled = true;         // disable the button
        btn.style.opacity = "0.5";   // visually indicate disabled state
        btn.style.cursor = "not-allowed"; // change cursor
});
}


// Save runs array into localStorage
function saveRuns() {
    // localStorage only stores strings, so we convert to JSON
    localStorage.setItem("runs", JSON.stringify(runs));
}

// Load runs array from localStorage
function loadRuns() {
    const storedRuns = localStorage.getItem("runs");
    if (storedRuns) {
        // Parse JSON back into objects
        const parsedRuns = JSON.parse(storedRuns);

        // Recreate them as Run instances
        runs = parsedRuns.map(r => new Run(r.date, r.distance, r.hours, r.minutes, r.seconds)); // Cheeky declarative programming
    }

    currentSort();
    displayRuns();
}

/**
 * Sorts the runs array by date.
 * @param {boolean} chronological - true = oldest first, false = newest first
 */
function sortByDate(chronological = true) {
    if (chronological) {
        // Use .sort() with compare function (a,b) => 
        // Should a - b be positive or negative? That is how we know an element 
        // should be is before/after another
        // Turn date string into date object, so its milliseconds, and compare that int
        runs.sort((a, b) => new Date(a.date) - new Date(b.date));
        currentSort = () => sortByDate(true); // update current sort choice
    } else {
        runs.sort((a, b) => new Date(b.date) - new Date(a.date));
        currentSort = () => sortByDate(false); // update current sort choice
    }
}

/**
 * Sorts the runs array by distance.
 * @param {boolean} ascending - true = smallest first, false = largest first
 */
function sortByDistance(ascending = true) {
    if (ascending) {
        runs.sort((a, b) => a.distance - b.distance);
        currentSort = () => sortByDistance(true); // update current sort choice
    } else {
        runs.sort((a, b) => b.distance - a.distance);
        currentSort = () => sortByDistance(false); // update current sort choice
    }
}

/**
 * Sorts the runs array by total time.
 * @param {boolean} ascending - true = shortest first, false = longest first
 */
function sortByTime(ascending = true) {
    if (ascending) {
        runs.sort((a, b) => a.getTotalSeconds() - b.getTotalSeconds());
        currentSort = () => sortByTime(true); // update current sort choice        
    } else {
        runs.sort((a, b) => b.getTotalSeconds() - a.getTotalSeconds());
        currentSort = () => sortByTime(false); // update current sort choice        
    }
}

/**
 * Sorts the runs array by pace.
 * @param {boolean} ascending - true = fastest first, false = slowest first
 */
function sortByPace(ascending = true) {
    if (ascending) {
        runs.sort((a, b) => (a.getTotalSeconds() / a.distance) - (b.getTotalSeconds() / b.distance));
        currentSort = () => sortByPace(true); // update current sort choice
    } else {
        runs.sort((a, b) => (b.getTotalSeconds() / b.distance) - (a.getTotalSeconds() / a.distance));
        currentSort = () => sortByPace(false); // update current sort choice
    }
}

function setActiveSortButton(buttonId) {
    // Remove 'active' class from all sort buttons
    document.querySelectorAll(".sort-btn").forEach(btn => btn.classList.remove("active"));

    // Add 'active' to the clicked one
    const btn = document.getElementById(buttonId);
    if (btn) btn.classList.add("active");
}
