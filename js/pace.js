const calculateBtn = document.getElementById("calculateBtn");
const resultText = document.getElementById("result")


calculateBtn.addEventListener("click", () => {
    const distance = document.getElementById("distance").value;
    const time = document.getElementById("time").value;
    const pace = document.getElementById("pace").value;

    if (distance == "" && time == "" && pace == "") {
        resultText.textContent = "No fields fill in, please fill in 2 of the 3 fields ";
    } else if ((distance == "" && time == "") || (time == "" && pace == "") || (distance == "" && pace == "")) {
        resultText.textContent = "Only 1 field filled in, please fill in 2 of the 3 fields";
    } else if (distance != "" && time != "" && pace != "") {
        resultText.textContent = "All 3 fields filled in, please fill in only 2 of the 3 fields"
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

    
    resultText.textContent = "Valid input. Ready to calculate!";
});




