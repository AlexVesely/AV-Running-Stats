import Run from "./run.js";
import { myRuns } from "./myRuns.js";

// Array to hold all runs
let runs = myRuns;
let barChart;
let lineChart;

const barChartForm = document.getElementById("barChartForm");
const lineChartForm = document.getElementById("lineChartForm");

// These get references to change lavel text depending on target chosen (distance or number of runs)
const yAxisSelect = document.getElementById("lineChartYAxisType");
const targetLabel = document.getElementById("targetLabel");
const targetInput = document.getElementById("target");

// Update target label/input when Y-axis type changes
yAxisSelect.addEventListener("change", function() {
    // "this.value" means: whatever option is currently selected in the dropdown
    if (this.value == "count") {
        targetLabel.textContent = "Target Runs:";
        targetInput.step = "1";
        targetInput.value = ""; // clear previous value
        targetInput.placeholder = "0";
    } else if (this.value == "distance") {
        targetLabel.textContent = "Target Distance:";
        targetInput.step = "0.01";
        targetInput.value = ""; // clear previous value
        targetInput.placeholder = "0.00";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    loadRuns();

     // Get the first and last day of the current month
    const startOfMonth = firstDayOfTodaysMonth();
    const endOfMonth = lastDayOfTodaysMonth();

    // Set those values into the date inputs
    document.getElementById("barChartStartDate").value = startOfMonth;
    document.getElementById("barChartEndDate").value = endOfMonth;
    document.getElementById("lineChartStartDate").value = "2025-01-01";
    document.getElementById("lineChartEndDate").value = "2025-12-31";
    document.getElementById("target").value = 500;
    
    // Set up charts of todays month when page is loaded
    updateBarChart(firstDayOfTodaysMonth(), lastDayOfTodaysMonth(), "day", "distance");

    updateLineChart("2025-01-01", "2025-12-31", "day", "distance", 500);
});

// Handle bar chart form submission
barChartForm.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page reload

    const startDate = document.getElementById("barChartStartDate").value;
    const endDate = document.getElementById("barChartEndDate").value;
    const groupBy = document.getElementById("barChartGroupBy").value;
    const yAxisType = document.getElementById("barChartYAxisType").value;

    updateBarChart(startDate, endDate, groupBy, yAxisType);
});

// Handle line chart form submission
lineChartForm.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page reload

    const startDate = document.getElementById("lineChartStartDate").value;
    const endDate = document.getElementById("lineChartEndDate").value;
    const groupBy = document.getElementById("lineChartGroupBy").value;
    const yAxisType = document.getElementById("lineChartYAxisType").value;
    const target = document.getElementById("target").value;

    updateLineChart(startDate, endDate, groupBy, yAxisType, target);
});

// Load runs saved in myRuns.js (Hardcoded examples)
function loadRuns() {
    runs = myRuns;
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

function generateXAxisLabels(startDateStr, endDateStr, groupBy) {
    // Convert strings to Date objects
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // Add one day to ensure inclusivity of all days
    end.setDate(end.getDate() + 1);

    let cur = new Date(start);

    const labels = [];
    if (groupBy === "day") {
        while (cur <= end) {
            labels.push(cur.toLocaleDateString("en-GB")); // DD/MM/YYYY
            cur.setDate(cur.getDate() + 1); // jump 1 day
        }
    } else if (groupBy == "week") {
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

function generateTotalYAxisLabels(startDateStr, endDateStr, groupBy, yAxisType) {
    // Convert strings to Date objects
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // Add one day to ensure inclusivity of all days
    end.setDate(end.getDate() + 1);

    let cur = new Date(start);

    const values = [];

    // Loop until the cur passes the end date
    // For each week/month find all runs that lie in that period and add the total distances/counts
    while (cur <= end) {
        let next; // End for this group
        if (groupBy == "day") {
            next = new Date(cur);
            next.setDate(cur.getDate() + 1);
        } else if (groupBy == "week") {
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

function generateCumulativeYAxisLabels(startDateStr, endDateStr, groupBy, yAxisType) {
    // Convert strings to Date objects
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // Add one day to ensure inclusivity of all days
    end.setDate(end.getDate() + 1);

    let cur = new Date(start);

    const values = [];
    let runningTotal = 0;

    // Loop until the cur passes the end date
    // For each week/month find all runs that lie in that period and add the total distances/counts
    while (cur <= end) {
        let next; // End for this group
        if (groupBy == "day") {
            next = new Date(cur);
            next.setDate(cur.getDate() + 1);
        } else if (groupBy == "week") {
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

        // Calculate total for this period
        let periodValue = 0;
        if (yAxisType === "count") {
            periodValue = runsInPeriod.length;
        } else if (yAxisType === "distance") {
            for (let i = 0; i < runsInPeriod.length; i++) { // total the distances in this time period
                periodValue += runsInPeriod[i].distance;
            }
        }

        // Add to running total and push to array
        runningTotal += periodValue;
        values.push(runningTotal);

        // Move to next period
        cur = next;
    }

    return values;
}

function updateLineChart(startDate, endDate, groupBy, yAxisType, target) {
    // Get the 2D drawing context of the <canvas> element
    const ctx = document.getElementById("lineChart").getContext("2d");

    // Destroy the old chart if it exists
    if (lineChart) {
        lineChart.destroy();
    }

    let yTitle
    // What to write on axis label?
    if (yAxisType == "distance") {
        yTitle = "Total Distance (km)";
    } else if (yAxisType == "count") {
        yTitle = "Number of runs";
    }

    // Define the labels that go on the X-axis
    const xAxisLabels = generateXAxisLabels(startDate, endDate, groupBy);

    // Define the numbers that go on the Y-axis
    const yAxisValues = generateCumulativeYAxisLabels(startDate,endDate,groupBy,yAxisType);

    // Dataset 1:
    const actualDataset = {
        label: "Actual",
        data: yAxisValues,
        borderColor: "aqua",
        backgroundColor: "black",
        fill: false,
        tension: 0 // 0 as I don't want the curve to dip
    };

    // Dataset 2:
    const targetDataset = {
        label: "Target",
        data: [
            { x: xAxisLabels[0], y: 0 }, // start at origin
            { x: xAxisLabels[xAxisLabels.length - 1], y: target } // end at target
        ],
        borderColor: "red",
        borderDash: [5, 5], // make it a dashed line
        fill: false,
        tension: 0
    };
    
    // Define the full chart data (labels + datasets)
    const chartData = {
        labels: xAxisLabels,
        datasets: [actualDataset, targetDataset]
    };

    // Define options for the chart (titles, scales, etc.)
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Period"
                }
            },
            y: {
                title: {
                    display: true,
                    text: yTitle
                },
                beginAtZero: true
            }
        }
    };

    // Create the new Chart.js lineChart object 
    lineChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions
    });
}

function updateBarChart(startDate, endDate, groupBy, yAxisType) {
    // Get the 2D drawing context of the <canvas> element
    const canvasContext = document.getElementById("barChart").getContext("2d");

    // Destroy the old chart if it exists
    if (barChart) {
        barChart.destroy();
    }

    let yTitle
    // What to write on axis label?
    if (yAxisType == "distance") {
        yTitle = "Total Distance (km)";
    } else if (yAxisType == "count") {
        yTitle = "Number of runs";
    }

    // Define the labels that go on the X-axis
    const xAxisLabels = generateXAxisLabels(startDate,endDate,groupBy);

    // Define the numbers that go on the Y-axis
    const yAxisValues = generateTotalYAxisLabels(startDate,endDate,groupBy,yAxisType);

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
    barChart = new Chart(canvasContext, {
        type: "bar",
        data: chartData,
        options: chartOptions
    });
}
