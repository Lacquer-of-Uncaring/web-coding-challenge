const API_ROOT = "http://localhost:8000/";

const NearbyCards = document.getElementById("nearby-cards");
const BingoAlert = document.getElementById("bingo-alert");
let UserPosition = [];

const GetNearbyShops = event => {
  // If geolocation is available, try to get the user's position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(SuccessCallback, ErrorCallback);
  } else {
    BingoAlert.innerHTML = BingoAlert.style.display = "inherit";
    ("Sorry, your browser does not support HTML5 geolocation.");
  }
};

SuccessCallback = position => {
  UserPosition.push(position.coords.longitude);
  UserPosition.push(position.coords.latitude);

  fetch(`${API_ROOT}shops/?lon=${UserPosition[0]}&lat=${UserPosition[1]}`)
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
                <a href="#" class="btn btn-success">Like</a>
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
  if (error.code == 1) {
    BingoAlert.innerHTML = "You've decided not to share your position.";
    BingoAlert.style.display = "inherit";
  } else if (error.code == 2) {
    BingoAlert.innerHTML = BingoAlert.style.display = "inherit";
    ("The network is down or the positioning service can't be reached.");
  } else if (error.code == 3) {
    BingoAlert.innerHTML = BingoAlert.style.display = "inherit";
    ("The attempt timed out before it could get the location data.");
  } else {
    BingoAlert.innerHTML = "Geolocation failed due to unknown error.";
    BingoAlert.style.display = "inherit";
  }
};
