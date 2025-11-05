const calculateBtn = document.getElementById("calculateBtn");
const resultText = document.getElementById("result")

calculateBtn.addEventListener("click", () => {
    const distance = document.getElementById("distance").value;
    const time = document.getElementById("time").value;
    const pace = document.getElementById("pace").value;

    if (distance == "" && time == "" && pace == "") {
        resultText.textContent = "No fields fill in, please fill in 2 of the 3 fields ";
        return;
    } else if ((distance == "" && time == "") || (time == "" && pace == "") || (distance == "" && pace == "")) {
        resultText.textContent = "Only 1 field filled in, please fill in 2 of the 3 fields";
        return;
    } else if (distance != "" && time != "" && pace != "") {
        resultText.textContent = "All 3 fields filled in, please fill in only 2 of the 3 fields"
        return;
    }

    // Validation for pace: formats like S, SS, M:SS, MM:SS
    
    // Define a regex that matches valid pace formats.
    // ^ and $ make sure the entire string must match (no extra junk).
    // \d{1,2} → one or two digits (e.g. "5", "09", "12").
    // (: \d{1,2})? → optionally allow ":NN" (colon followed by one or two digits).
    // The outer (...) ? means the whole thing can be optional (so "" is valid).
    const paceRegex = /^(\d{1,2}(:\d{1,2})?)?$/;
    if (pace !== "" && !paceRegex.test(pace)) {
        resultText.textContent = "Invalid pace format. Use S, SS, M:SS, or MM:SS.";
        return;
    }

    // Validation for time: formats like H, HH, M:SS, MM:SS, H:MM:SS, HH:MM:SS

    // Define a regex (regular  that matches valid time formats.
    // ^ and $ → the whole string must match exactly, no extra characters.
    // \d{1,2} → matches 1 or 2 digits (e.g., "5", "12") at the start.
    // (: \d{1,2}){0,2} → matches a colon followed by 1 or 2 digits, repeated 0 to 2 times.
    //    - So it allows formats like "H", "HH", "M:SS", "MM:SS", "H:MM:SS", "HH:MM:SS".
    // The outer (...) ? allows the whole string to be optional (so "" is valid).
    const timeRegex = /^(\d{1,2}(:\d{1,2}){0,2})?$/;
    if (time !== "" && !timeRegex.test(time)) {
        resultText.textContent = "Invalid time format. Use H, HH, M:SS, MM:SS, or HH:MM:SS.";
        return;
    }

    if (distance == "") {
        calcDistance(time, pace);
    } else if (time == "") {
        calcTime(distance, pace);
    } else {
        calcPace(distance, time);
    }
});

// Convert time string into total seconds
function timeToSeconds(timeStr) {
    const parts = timeStr.split(":").map(Number); // split by ":" and convert to numbers
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
        return parts[0];
    }
    return 0;
}

// Convert seconds into "HH:MM:SS" or "MM:SS" format
function secondsToTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = Math.round(seconds % 60);

    // Make 2-digit strings for minutes and seconds

    if (minutes < 10) {
        minutes = "0" + minutes;
    } 

    if (secs < 10) {
        secs = "0" + secs;
    }

    if (hours > 0) {
        return hours + ":" + minutes + ":" + secs;
    } else {
        return minutes + ":" + secs;
    }
}

// Convert pace string "MM:SS" to seconds per km
function paceToSeconds(paceStr) {
    const parts = paceStr.split(":").map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else {
        return parts[0]; // just minutes
    }
}

function calcDistance(timeStr, paceStr) {
    const timeSec = timeToSeconds(timeStr);
    const paceSec = paceToSeconds(paceStr);
    const distance = timeSec / paceSec;
    
    document.getElementById("distance").value = distance.toFixed(2); // fill distance input
    resultText.textContent = `${distance.toFixed(2)} km in ${timeStr} with a pace of ${paceStr} / km`;
}

function calcTime(distance, paceStr) {
    const paceSec = paceToSeconds(paceStr);
    const totalSeconds = distance * paceSec;
    document.getElementById("time").value = secondsToTime(totalSeconds); // fill time input
    resultText.textContent = `${distance} km in ${secondsToTime(totalSeconds)} with a pace of ${paceStr} / km`;
}

function calcPace(distance, timeStr) {
    const timeSec = timeToSeconds(timeStr);
    const paceSec = timeSec / distance;
    const minutes = Math.floor(paceSec / 60);
    const seconds = Math.round(paceSec % 60);

    const paceStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    document.getElementById("pace").value = paceStr; // fill pace input
    resultText.textContent = `${distance} km in ${timeStr} with a pace of ${paceStr} / km`;
}
