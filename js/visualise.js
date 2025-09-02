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
    const xAxisLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

    // Define the numbers that go on the Y-axis (Right now placeholders)
    const yAxisValues = [10, 0, 7, 20];

    // Define one dataset
    const dataset = {
        data: yAxisValues,      // Y values
        backgroundColor: "rgba(75, 192, 192, 0.6)" // Color of the bars
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
