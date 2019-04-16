const API_ROOT = "http://localhost:8000";
const APP_PATH = "/wcc";

const loginEmail = document.getElementById("l_email");
const loginPassword = document.getElementById("l_password");
const signupEmail = document.getElementById("s_email");
const signupPassword = document.getElementById("s_password");
const signupPassword2 = document.getElementById("s_password2");

const Login = event => {
  event.preventDefault();
  const user = {
    email: loginEmail.value,
    password: loginPassword.value
  };
  fetch(`${API_ROOT}/rest-auth/login/`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      document.getElementById("l-non-field-alert").style.display = "none";
      document.getElementById("l-email-alert").style.display = "none";
      document.getElementById("l-password-alert").style.display = "none";
      if (json.key) {
        window.sessionStorage.setItem("token", json.key);
        window.location.replace(APP_PATH);
      }
      // Invalid input handeling
      if (json.non_field_errors) {
        document.getElementById("l-non-field-alert").innerHTML =
          json.non_field_errors;
        document.getElementById("l-non-field-alert").style.display = "inherit";
      }
      if (json.email) {
        document.getElementById("l-email-alert").innerHTML = json.email;
        document.getElementById("l-email-alert").style.display = "inherit";
      }
      if (json.password) {
        document.getElementById("l-password-alert").innerHTML = json.password;
        document.getElementById("l-password-alert").style.display = "inherit";
      }
      loginEmail.value = "";
      loginPassword.value = "";
    })
    .catch(error => console.log("Error", error));
};
