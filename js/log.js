// Array to hold all runs
let runs = [];

// Select form and list container
// document.getElementById(...) looks into the HTML and grabs the element with that ID.
const form = document.getElementById("runForm"); // The form
const runsList = document.getElementById("runsList"); // The list displaying runs

// Listen for form submission
form.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page reload

    // Get values from inputs
    const date = document.getElementById("runDate").value;
    const distance = document.getElementById("distance").value;
    const hours = parseInt(document.getElementById("hours").value) || 0; // If input is empty use 0, but atm its a required field? Return to this
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;

    // Create a run object
    const run = {
        date: date,
        distance: distance,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };

    // Add to runs array
    runs.push(run);

    // Update display
    displayRuns();

    // Reset form
    form.reset();
});

// Function to display all runs
function displayRuns() {
    runsList.innerHTML = ""; // clear old content, dont output runs on screen already again

    runs.forEach((run) => {
        const pace = calcPace(run.hours, run.minutes, run.seconds, run.distance)


        const runEntry = document.createElement("p"); // Make a new <p>
        // Create content to put within <p>
        runEntry.textContent = `${run.date} - ${run.distance} km in 
        ${run.hours}h ${run.minutes}m ${run.seconds}s (Pace: ${pace})`;
        runsList.appendChild(runEntry); //Sticks it into the runsList div
    });
}

function calcPace(hours, min, sec, distance) {
    if (distance <= 0) return "Invalid distance";

    const totalSeconds = (hours * 3600) + (min * 60) + sec;
    const paceSeconds = totalSeconds / distance;

    // Convert pace into mm:ss format
    const paceMinutes = Math.floor(paceSeconds / 60);
        const paceRemainingSeconds = Math.round(paceSeconds % 60)
            .toString()
            .padStart(2, "0"); // ensures always 2 digits (e.g., 05, 09)

        const paceFormatted = `${paceMinutes}:${paceRemainingSeconds} min/km`;
        return paceFormatted

}