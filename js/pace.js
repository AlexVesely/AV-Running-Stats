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
    } else if (distance != "" && time != "" && pace != empty) {
        resultText.textContent = "All 3 fields filled in, please fill in only 2 of the 3 fields"
    }

});


