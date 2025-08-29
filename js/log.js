import Run from "./Run.js";

// Array to hold all runs
let runs = [];

// Select form and list container
// document.getElementById(...) looks into the HTML and grabs the element with that ID.
const form = document.getElementById("runForm"); // The form
const runsList = document.getElementById("runsList"); // The list displaying runs
const deleteButton = document.getElementById("deleteAllButton");
const sortDateCButton = document.getElementById("sortDateC");
const sortDateNCButton = document.getElementById("sortDateNC");
const sortDistanceAButton = document.getElementById("sortDistanceA");
const sortDistanceDButton = document.getElementById("sortDistanceD");

// Load runs from localStorage when the page first opens
// localStorage is a little 'storage box' in every browser that isnt cleared until the user deletes it.
// localStorage stores key-value pairs for us
// DOMContentLoaded is an event that fires when HTML has loaded, so it is now safe to load from localStorage
window.addEventListener("DOMContentLoaded", loadRuns);

// Listen for form submission
form.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page reload

    // Get values from inputs
    const date = document.getElementById("runDate").value;
    const distance = document.getElementById("distance").value;
    const hours = parseInt(document.getElementById("hours").value) || 0; // If input is empty use 0, but atm its a required field? Return to this
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;

    let run = new Run(date,distance, hours, minutes, seconds);

    // Add to runs array
    runs.push(run);

    // Update display
    displayRuns();

    // Save runs permanently so they stay even after refresh
    saveRuns();

    // Reset form
    form.reset();
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
});

sortDateNCButton.addEventListener("click", () => {
    // Sort runs array by date
    sortByDate(false);
    
    // Re-render the runs
    displayRuns();
});

sortDistanceAButton.addEventListener("click", () => {
    // Sort runs array by distance
    sortByDistance(true);
    
    // Re-render the runs
    displayRuns();
});

sortDistanceDButton.addEventListener("click", () => {
    // Sort runs array by distance
    sortByDistance(false);
    
    // Re-render the runs
    displayRuns();
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

    // Add both to the container
    runEntry.appendChild(runText);
    runEntry.appendChild(deleteBtn);

    return runEntry; // Return the fully built div so it can be added to runsList
}

// Delete a run by index
function deleteRun(index) {
    runs.splice(index, 1);                        // remove from array
    localStorage.setItem("runs", JSON.stringify(runs));  // update storage
    displayRuns();                                // refresh display
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
    } else {
        runs.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

/**
 * Sorts the runs array by distance.
 * @param {boolean} ascending - true = smallest first, false = largest first
 */
function sortByDistance(ascending = true) {
    if (ascending) {
        runs.sort((a, b) => a.distance - b.distance);
    } else {
        runs.sort((a, b) => b.distance - a.distance);
    }
}