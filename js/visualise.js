import Run from "./Run.js";

// Array to hold all runs
let runs = [];
let chart;

// Load runs from localStorage when the page first opens
// localStorage is a little 'storage box' in every browser that isnt cleared until the user deletes it.
// localStorage stores key-value pairs for us
// DOMContentLoaded is an event that fires when HTML has loaded, so it is now safe to load from localStorage
window.addEventListener("DOMContentLoaded", () => {
    loadRuns();
    setupDistanceChart();
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

function setupDistanceChart() {
    // Get the 2D drawing context of the <canvas> element
    const canvasContext = document.getElementById("barChart").getContext("2d");

    // Define the labels that go on the X-axis (Currently Placeholders)
    const xAxisLabels = generateXAxisLabels("01-06-2023","01-01-2024","month");

    // Define the numbers that go on the Y-axis (Currently Placeholders)
    const yAxisValues = [10, 0, 7, 20];

    // Define one dataset
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
                    text: "Distance (km)" // Y-axis title
                },
                beginAtZero: true
            }
        }
    };

    // Create the Chart.js chart object
    chart = new Chart(canvasContext, {
        type: "bar",
        data: chartData,
        options: chartOptions
    });
}

function generateXAxisLabels(startDateStr, endDateStr, groupBy) {
    // Convert strings to Date objects
    const start = parseDMY(startDateStr);
    const end = parseDMY(endDateStr);

    let cur = start;

    let labels = [];

    if (groupBy === "week") {
        while (cur <= end) {
            labels.push(cur.toLocaleDateString("en-GB")); //  We need the "en-GB" so it returns in format DD-MM-YYYY
            cur.setDate(cur.getDate() + 7); // jump one week
        }
    } else if (groupBy === "month") {
        cur.setDate(1);
        while (cur <= end) {
            labels.push(cur.toLocaleString("default", { month: "short", year: "numeric" }));
            cur.setMonth(cur.getMonth() + 1);
        }
    }

    return labels;
}

function parseDMY(str) {
    const [day, month, year] = str.split("-").map(Number);
    // MONTH IS ZERO BASED!!! January is 0, December is 11
    return new Date(year, month - 1, day);
}


