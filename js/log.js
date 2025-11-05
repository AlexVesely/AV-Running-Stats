import Run from "./run.js";
import { runs2025 } from "./myRuns2025.js";

// Array holding all runs that have been loaded in
let runs = runs2025;

// Store current way runs are being sorted
let currentSort = () => sortByDate(true);

// document.getElementById(...) looks into the HTML and grabs the element with that ID.
const runsList = document.getElementById("runsList"); // The list displaying runs
const sortDateCButton = document.getElementById("sortDateC");
const sortDateNCButton = document.getElementById("sortDateNC");
const sortDistanceAButton = document.getElementById("sortDistanceA");
const sortDistanceDButton = document.getElementById("sortDistanceD");
const sortTimeAButton = document.getElementById("sortTimeA");
const sortTimeDButton = document.getElementById("sortTimeD");
const sortPaceAButton = document.getElementById("sortPaceA");
const sortPaceDButton = document.getElementById("sortPaceD");

// When page is loaded, load runs and sort by date ascending
document.addEventListener("DOMContentLoaded", () => {
    setActiveSortButton("sortDateC");
    displayRuns();
});


sortDateCButton.addEventListener("click", () => { sortByDate(true); displayRuns(); setActiveSortButton("sortDateC"); });
sortDateNCButton.addEventListener("click", () => { sortByDate(false); displayRuns(); setActiveSortButton("sortDateNC"); });
sortDistanceAButton.addEventListener("click", () => { sortByDistance(true); displayRuns(); setActiveSortButton("sortDistanceA"); });
sortDistanceDButton.addEventListener("click", () => { sortByDistance(false); displayRuns(); setActiveSortButton("sortDistanceD"); });
sortTimeAButton.addEventListener("click", () => { sortByTime(true); displayRuns(); setActiveSortButton("sortTimeA"); });
sortTimeDButton.addEventListener("click", () => { sortByTime(false); displayRuns(); setActiveSortButton("sortTimeD"); });
sortPaceAButton.addEventListener("click", () => { sortByPace(true); displayRuns(); setActiveSortButton("sortPaceA"); });
sortPaceDButton.addEventListener("click", () => { sortByPace(false); displayRuns(); setActiveSortButton("sortPaceD"); });

// Display all runs
function displayRuns() {
    runsList.innerHTML = ""; // clear old content displayed on page already

    runs.forEach((run) => {
        const runEntry = createRunEntry(run); // create a <div> for this run
        runsList.appendChild(runEntry);
    });
}

// Create a single run entry (text)
function createRunEntry(run) {
    const pace = run.getPace();
    const runEntry = document.createElement("div"); // Create a <div> element to hold everything
    runEntry.classList.add("run-entry"); // add CSS class to runEntry

    // Text
    const runText = document.createElement("span"); // Create a <span> to hold the run information
    runText.textContent = `${run.date} - ${run.distance} km in ${run.hours}h ${run.minutes}m ${run.seconds}s (Pace: ${pace})`;


    // Add to the container
    runEntry.appendChild(runText);

    return runEntry; // Return the fully built div so it can be added to runsList
}

/**
 * Sorts the runs array by date.
 * @param {boolean} chronological - true = oldest first, false = newest first
 */
function sortByDate(chronological = true) {
    if (chronological) {
        // Use .sort() with compare function (a,b) => 
        // Is a - b be positive or negative? That is how we know an element
        // is before/after another
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
