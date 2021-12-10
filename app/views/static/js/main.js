var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  //   var x = document.getElementsByClassName("tab");
  var x = document.getElementsByTagName("fieldset");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    var button = document.getElementById("nextBtn");
    // button.classList.add("disabled");
    button.setAttribute("disabled", "disabled");
    button.innerHTML = "Submit";

    file_input = document.getElementById("file-input");
    button.disabled = file_input.files.length == 0;
  } else {
    var button = document.getElementById("nextBtn");
    document.getElementById("nextBtn").innerHTML = "Next";
    button.disabled = false;
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n);
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByTagName("fieldset");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("msform").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x,
    y,
    i,
    z,
    valid = true;
  var x = document.getElementsByTagName("fieldset");
  y = x[currentTab].getElementsByTagName("input");
  z = x[currentTab].getElementsByTagName("select");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  for (i = 0; i < z.length; i++) {
    if (z[i].value == "") {
      // add an "invalid" class to the field:
      z[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

function selectFile(object) {
  var files = object.files;
  var item = files[0].text();

  var button = document.getElementById("nextBtn");
  var input_text = document.getElementById("input-text");
  var config_data = document.getElementsByName("config-data")[0];

  if (files.length == 0) {
    button.disabled = true;
    input_text.textContent = "Choose Config File";
    return;
  }

  input_text.textContent = files[0].name;
  button.disabled = false;

  item.then((v) => {
    var data = v.split("\n");
    var file_data = {};
    data.forEach((element) => {
      var row = element.split("=");
      var key = row[0].trim();
      var value = row[1].trim();

      file_data[key] = value;
    });
    button.disabled = file_data["input_filepath"].trim().length == 0
    config_data.value = JSON.stringify(file_data);

    show();
  });

  console.log(`ZUMA:`);
}

function show() {
  var input_text = document.getElementById("input-text");
  console.log(input_text.value);
}
