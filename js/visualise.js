import Run from "./Run.js";

// Array to hold all runs
let runs = [];
let chart;

const chartForm = document.getElementById("chartForm");

// Load runs from localStorage when the page first opens
// localStorage is a little 'storage box' in every browser that isnt cleared until the user deletes it.
// localStorage stores key-value pairs for us
// DOMContentLoaded is an event that fires when HTML has loaded, so it is now safe to load from localStorage
window.addEventListener("DOMContentLoaded", () => {
    loadRuns();
    
    // Set up chart of todays month when page is loaded
    updateChart(firstDayOfTodaysMonth(),lastDayOfTodaysMonth(),"week","distance");
});

chartForm.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page reload

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const groupBy = document.getElementById("groupBy").value;
    const yAxisType = document.getElementById("yAxisType").value;

    updateChart(startDate, endDate, groupBy, yAxisType);
});

// Load runs array from localStorage
function loadRuns() {
    const storedRuns = localStorage.getItem("runs");
    if (storedRuns) {
        // Parse JSON back into objects
        const parsedRuns = JSON.parse(storedRuns);

        // Recreate them as Run instances
        runs = parsedRuns.map(r => new Run(r.date, r.distance, r.hours, r.minutes, r.seconds)); // Cheeky declarative programming
    }
}

function firstDayOfTodaysMonth() {
    const today = new Date(); // This creates a Date object of today's date!
    
    const todaysYear = today.getFullYear();
    const todaysMonth = String(today.getMonth() + 1).padStart(2, "0"); // add 1 because months are 0-indexed
    
    const firstDay = `${todaysYear}-${todaysMonth}-01`;

    return firstDay;
}

function lastDayOfTodaysMonth() {
    const today = new Date(); // This creates a Date object of today's date!
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 0th day of a month is the last day of a month

    const todaysYear = today.getFullYear();
    const todaysMonth = String(today.getMonth() + 1).padStart(2, "0"); // add 1 because months are 0-indexed

    const lastDay = `${todaysYear}-${todaysMonth}-${String(lastDate.getDate()).padStart(2,"0")}`; 

    return lastDay;
}

function updateChart(startDate, endDate, groupBy, yAxisType) {
    // Get the 2D drawing context of the <canvas> element
    const canvasContext = document.getElementById("barChart").getContext("2d");

    // Destroy the old chart if it exists
    if (chart) {
        chart.destroy();
    }

    let yTitle
    // What to write on axis label?
    if (yAxisType == "distance") {
        yTitle = "Total Distance (km)";
    } else if (yAxisType == "count") {
        yTitle = "Number of runs";
    }

    // Define the labels that go on the X-axis (Currently Placeholders)
    const xAxisLabels = generateXAxisLabels(startDate,endDate,groupBy);

    // Define the numbers that go on the Y-axis (Currently Placeholders)
    const yAxisValues = generateYAxisLabels(startDate,endDate,groupBy,yAxisType);

    // Define dataset
    const dataset = {
        data: yAxisValues,      // Y values
        backgroundColor: "aqua" // Color of the bars
    };

    // Define the full chart data (labels + datasets)
    const chartData = {
        labels: xAxisLabels,
        datasets: [dataset]
    };

    // Define options for the chart (titles, scales, etc.)
    const chartOptions = {
        responsive: true, // Make chart resize with the window
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Period" // X-axis title
                }
            },
            y: {
                title: {
                    display: true,
                    text: yTitle // Y-axis title
                },
                beginAtZero: true
            }
        }
    };

    // Create the new Chart.js chart object 
    chart = new Chart(canvasContext, {
        type: "bar",
        data: chartData,
        options: chartOptions
    });
}

function generateXAxisLabels(startDateStr, endDateStr, groupBy) {
    // Convert strings to Date objects
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    let cur = new Date(start);

    const labels = [];

    if (groupBy == "week") {
        while (cur <= end) {
            labels.push(cur.toLocaleDateString("en-GB")); //  We need the "en-GB" so it returns in format DD-MM-YYYY
            cur.setDate(cur.getDate() + 7); // jump one week
        }
    } else if (groupBy == "month") {
        cur.setDate(1);
        while (cur <= end) {
            labels.push(cur.toLocaleString("default", { month: "short", year: "numeric" }));
            cur.setMonth(cur.getMonth() + 1);
        }
    }

    return labels;
}

function generateYAxisLabels(startDateStr, endDateStr, groupBy, yAxisType) {
    // Convert strings to Date objects
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    let cur = new Date(start);

    const values = [];

    // Loop until the cur passes the end date
    // For each week/month find all runs that lie in that period and add the total distances/counts
    while (cur <= end) {
        let next; // End for this group
        if (groupBy == "week") {
            next = new Date(cur);
            next.setDate(cur.getDate() + 7); // Set end of this group as cur + 7 days
        } else if (groupBy == "month") {
            next = new Date(cur.getFullYear(), cur.getMonth() + 1, 1); // Set end of this group as the 1st of the next month after cur
        }

        // Go through all runs and remove any that don't lie within [cur, next)
        const runsInPeriod = runs.filter(run => {
            const runDate = new Date(run.date); // Parse run data string into a Date
            return runDate >= cur && runDate < next;
        });

        if (yAxisType == "count") {
            values.push(runsInPeriod.length); // Push number of runs in this period
        } else if (yAxisType == "distance") {
            let totalDistance = 0;
            for (let i = 0; i < runsInPeriod.length; i++) { // total the distances in this time period
                totalDistance += runsInPeriod[i].distance;
            }
            values.push(totalDistance);
        }

        // step forward
        cur = next;
    }

    return values;
}
