var SCOPE = "https://www.googleapis.com/auth/spreadsheets";
var SHEET_ID = "1RdnSkZQ4UZv2L5QRFA-xKZ4cITsekDEesrI4sBEBV6Y";
var RANGE = "Sheet1";
var login = false;

function makeApiCall() {
  if (login == true) {
    var params = {
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
    };

    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var valueRangeBody = {
      majorDimension: "ROWS",
      values: [[fname.toLowerCase(), lname.toLowerCase()]],
    };
    if (fname != "" && lname != "") {
      //validation
      var request = gapi.client.sheets.spreadsheets.values.append(
        //append the data
        params,
        valueRangeBody
      );
      request.then(
        function (response) {},
        function (reason) {
          console.error("error: " + reason.result.error.message);
        }
      );
    } else {
      alert("Fill the input fields");
    }
  } else {
    alert("SignIn to save");
  }
}

function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPE,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
      ],
    })
    .then(function () {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get()); //access
      login = true;
    });
}

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    login = true;
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn(); //user signin
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut(); //user signout

  login = false;
}

function appendPre(message) {
  var pre = document.getElementById("data"); //reference to table
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}

function listMajors() {
  //function to fetch the data releted to resp. firstname
  var formnames = document.getElementById("fetchnames");
  formnames.addEventListener("submit", (e) => {
    e.preventDefault();
    gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: SHEET_ID,
        range: RANGE,
      })
      .then(
        function (response) {
          var range = response.result;
          console.log(range);
          if (range.values.length > 0) {
            var firstnames = document.getElementById("firstnames").value;
            var temp = "";
            var count = 0;
            // data1 = response.value.reverse();
            range.values.forEach((u) => {
              console.log(u);
              if (u[0] === firstnames.toLowerCase()) {
                count += 1;
                temp += "<tr>";
                temp += "<td>" + u[0] + "</td>";
                temp += "<td>" + u[1] + "</td>";
              }
            });
            if (count == 0) {
              temp = "No data related to search is available";
            }
            document.getElementById("data").innerHTML = temp;
          }
        },
        function (response) {
          appendPre("Error: " + response.result.error.message);
        }
      );
  });
}
