const API_ROOT = "http://localhost:8000";
const APP_PATH = "/wcc";

const loginEmail = document.getElementById("l_email");
const loginPassword = document.getElementById("l_password");
const signupEmail = document.getElementById("s_email");
const signupPassword = document.getElementById("s_password");
const signupPassword2 = document.getElementById("s_password2");

const lNonFieldAlert = document.getElementById("l-non-field-alert");
const lEmailAlert = document.getElementById("l-email-alert");
const lPasswordAlert = document.getElementById("l-password-alert");
const signupSuccess = document.getElementById("signup-success");
const sNonFieldAlert = document.getElementById("s-non-field-alert");
const sEmailAlert = document.getElementById("s-email-alert");
const sPasswordAlert = document.getElementById("s-password-alert");
const sPassword2Alert = document.getElementById("s-password2-alert");

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
      lNonFieldAlert.style.display = "none";
      lEmailAlert.style.display = "none";
      lPasswordAlert.style.display = "none";
      if (json.key) {
        window.sessionStorage.setItem("token", json.key);
        window.sessionStorage.setItem("email", user.email);
        window.location.replace(APP_PATH);
      }
      // Invalid input handeling
      if (json.non_field_errors) {
        lNonFieldAlert.innerHTML = json.non_field_errors;
        lNonFieldAlert.style.display = "inherit";
      }
      if (json.email) {
        lEmailAlert.innerHTML = json.email;
        lEmailAlert.style.display = "inherit";
      }
      if (json.password) {
        lPasswordAlert.innerHTML = json.password;
        lPasswordAlert.style.display = "inherit";
      }
      // loginEmail.value = "";
      loginPassword.value = "";
    })
    .catch(error => console.log("Error", error));
};

const Signup = event => {
  event.preventDefault();
  const user = {
    email: signupEmail.value,
    password1: signupPassword.value,
    password2: signupPassword2.value
  };
  fetch(`${API_ROOT}/rest-auth/registration/`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      // if signup is successful
      if (response.status == 500) {
        signupSuccess.innerHTML = "Successful Signup!";
        signupSuccess.style.display = "inherit";
        setTimeout(() => {
          signupSuccess.style.display = "none";
        }, 5000);
      }
      return response.json();
    })
    .then(json => {
      sNonFieldAlert.style.display = "none";
      sEmailAlert.style.display = "none";
      sPasswordAlert.style.display = "none";
      sPassword2Alert.style.display = "none";
      // Invalid input handeling
      if (json.non_field_errors) {
        sNonFieldAlert.innerHTML = json.non_field_errors;
        sNonFieldAlert.style.display = "inherit";
      }
      if (json.email) {
        sEmailAlert.innerHTML = json.email;
        sEmailAlert.style.display = "inherit";
      }
      if (json.password1) {
        sPasswordAlert.innerHTML = json.password1;
        sPasswordAlert.style.display = "inherit";
      }
      if (json.password2) {
        sPassword2Alert.innerHTML = json.password2;
        sPassword2Alert.style.display = "inherit";
      }
      // signupEmail.value = "";
      signupPassword.value = "";
      signupPassword2.value = "";
    })
    .catch(error => console.log("Error", error));
};
