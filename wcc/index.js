const API_ROOT = "http://localhost:8000";
const LOGIN_PATH = "/wcc/login.html";

const NearbyCards = document.getElementById("nearby-cards");
const PreferedCards = document.getElementById("prefered-cards");
const BingoAlert = document.getElementById("bingo-alert");
const BingoWait = document.getElementById("bingo-wait");
let UserPosition = [];

const LoadShops = event => {
  GetNearbyShops(event);
  GetPreferedShops(event);
};

// Nearby Shops
const GetNearbyShops = event => {
  // Check if authenticated
  if (!window.sessionStorage.getItem("token")) {
    window.location.replace(LOGIN_PATH);
  }
  // Write welcome message in navbar
  document.getElementById(
    "welcome"
  ).innerHTML = `Welcome, ${window.sessionStorage.getItem("email")}`;
  // If geolocation is available, try to get the user's position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(SuccessCallback, ErrorCallback);
    BingoWait.style.display = "inherit";
    BingoWait.innerHTML = 'Loading <i class="fas fa-spinner"></i>';
  } else {
    BingoAlert.innerHTML =
      "Sorry, your browser does not support HTML5 geolocation.";
    BingoAlert.style.display = "inherit";
  }
};

SuccessCallback = position => {
  BingoWait.style.display = "none";
  UserPosition.push(position.coords.longitude);
  UserPosition.push(position.coords.latitude);
  GetUserId();
  fetch(
    `${API_ROOT}/shops/?lon=${UserPosition[0]}&lat=${
      UserPosition[1]
    }&id=${window.sessionStorage.getItem("id")}`,
    {
      headers: {
        Authorization: `Token ${window.sessionStorage.getItem("token")}`
      }
    }
  )
    .then(response => response.json())
    .then(json => json.results)
    .then(shops => {
      const CardHTML = shops
        .map(
          shop =>
            `<div class="col-4 p-2">
            <div class="card mx-auto" style="width: 16rem;">
              <h5 class="card-header p-3">${shop.name}</h5>
              <h8 class="card-header p-1">${shop.distance} Kms away</h8>
              <img
                class="card-img-top"
                src="${shop.picture}"
                alt="Card image cap"
              />
              <div class="card-body">
                <a href="#" id="${
                  shop.id
                }" class="btn btn-success" onclick="LikeShop(event)">Like</a>
                <a href="#" class="btn btn-danger">Dislike</a>
              </div>
            </div>
          </div>`
        )
        .join("");
      NearbyCards.innerHTML = CardHTML;
      return CardHTML;
    })
    .catch(err => console.log(err));
};

ErrorCallback = error => {
  BingoWait.style.display = "none";
  if (error.code == 1) {
    BingoAlert.innerHTML = "You've decided not to share your position.";
    BingoAlert.style.display = "inherit";
  } else if (error.code == 2) {
    BingoAlert.innerHTML =
      "The network is down or the positioning service can't be reached.";
    BingoAlert.style.display = "inherit";
  } else if (error.code == 3) {
    BingoAlert.innerHTML =
      "The attempt timed out before it could get the location data.";
    BingoAlert.style.display = "inherit";
  } else {
    BingoAlert.innerHTML = "Geolocation failed due to unknown error.";
    BingoAlert.style.display = "inherit";
  }
};

const GetUserId = () => {
  // get the current user id
  if (!window.sessionStorage.getItem("id")) {
    fetch(`${API_ROOT}/rest-auth/user/`, {
      headers: {
        Authorization: `Token ${window.sessionStorage.getItem("token")}`
      }
    })
      .then(response => response.json())
      .then(user => window.sessionStorage.setItem("id", user.id))
      .catch(err => console.log(err));
  }
};

const GetPreferedShops = event => {
  GetUserId();
  // get prefered shops for current user
  fetch(`${API_ROOT}/prefered/?id=${window.sessionStorage.getItem("id")}`, {
    headers: {
      Authorization: `Token ${window.sessionStorage.getItem("token")}`
    }
  })
    .then(response => response.json())
    .then(shops => {
      const CardHTML = shops
        .map(
          shop =>
            `<div class="col-4 p-2">
            <div class="card mx-auto" style="width: 16rem;">
              <h5 class="card-header p-3">${shop.name}</h5>
              <img
                class="card-img-top"
                src="${shop.picture}"
                alt="Card image cap"
              />
              <div class="card-body">
              <a href="#" id=${
                shop.id
              } onclick="UnlikeShop(event)" class="btn btn-danger">Remove</a>
              </div>
            </div>
          </div>`
        )
        .join("");
      PreferedCards.innerHTML = CardHTML;
      return CardHTML;
    })
    .catch(err => console.log(err));
};

const LikeShop = event => {
  GetUserId();
  // get the list of the shop likers
  fetch(`${API_ROOT}/shops/${event.target.id}/`, {
    headers: {
      Authorization: `Token ${window.sessionStorage.getItem("token")}`
    }
  })
    .then(response => response.json())
    .then(shop => shop.likers)
    .then(likers => {
      // add current user to likers and patch
      likers.push(parseInt(window.sessionStorage.getItem("id")));
      return likers;
    })
    .then(updated_likers => {
      const data = {
        likers: updated_likers
      };
      fetch(`${API_ROOT}/like/${event.target.id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Token ${window.sessionStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      })
        .then(() => LoadShops(event))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

const UnlikeShop = event => {
  GetUserId();
  // get the list of the shop likers
  fetch(`${API_ROOT}/shops/${event.target.id}/`, {
    headers: {
      Authorization: `Token ${window.sessionStorage.getItem("token")}`
    }
  })
    .then(response => response.json())
    .then(shop => shop.likers)
    // remove current user from likers and patch
    .then(likers =>
      likers.filter(
        item => item !== parseInt(window.sessionStorage.getItem("id"))
      )
    )
    .then(updated_likers => {
      const data = {
        likers: updated_likers
      };
      fetch(`${API_ROOT}/like/${event.target.id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Token ${window.sessionStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      })
        .then(() => LoadShops(event))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

const Logout = () => {
  if (window.sessionStorage.getItem("token")) {
    fetch(`${API_ROOT}/rest-auth/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${window.sessionStorage.getItem("token")}`
      }
    })
      .then(() => {
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("id");
        window.location.replace(LOGIN_PATH);
      })
      .catch(err => console.log(err));
  }
};
