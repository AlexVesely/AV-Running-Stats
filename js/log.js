import Run from "./Run.js";

// Array to hold all runs
let runs = [];

// Select form and list container
// document.getElementById(...) looks into the HTML and grabs the element with that ID.
const form = document.getElementById("runForm"); // The form
const runsList = document.getElementById("runsList"); // The list displaying runs

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

// Function to display all runs
function displayRuns() {
    runsList.innerHTML = ""; // clear old content, dont output runs on screen already again

    runs.forEach((run) => {
        const pace = run.getPace();


        const runEntry = document.createElement("p"); // Make a new <p>
        // Create content to put within <p>
        runEntry.textContent = `${run.date} - ${run.distance} km in 
        ${run.hours}h ${run.minutes}m ${run.seconds}s (Pace: ${pace})`;
        runsList.appendChild(runEntry); //Sticks it into the runsList div
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

    displayRuns();
}