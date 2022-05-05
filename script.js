"use strict";

//DOM ELEMENTS
const sidebar = document.querySelector(".sidebar");
const form = document.querySelector(".workout__form");
const formSubmit = document.querySelector(".form__button");
const formDistance = document.querySelector(".form__distance");
const workoutType = document.querySelector(".form__select");

class App {
  #map;
  #mapEvent; //private instance class fields

  constructor() {
    this._getPosition();

    //DOM EVENT LISTENER

    // adding marker on the map as the form submits
    formSubmit.addEventListener("click", this._newWorkout.bind(this));

    //changing credence to elve
    workoutType.addEventListener("change", this._toogleElevationFields);
  }

  _getPosition() {
    /**
     * Checking if the geolocation api is supported or not for older devices
     * the navigator.geoloaction api gets two callback functions , 1 is for success and 2nd is for the error
     */

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("couldn't connect");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    ////////////////////////////////
    ///////////////////////////////
    //  CASE 2 : Using leaflet libarary to display map
    ////////////////////////////////
    ///////////////////////////////
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(e) {
    //IMPORTANT EVENT FX OF MAP

    form.classList.remove("hidden");
    formDistance.focus();
    sidebar.style.setProperty("opacity", "100%");

    this.#mapEvent = e;
  }

  _toogleElevationFields() {
    document.querySelector(".cadence").classList.toggle("hidden");
    document.querySelector(".elve").classList.toggle("hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    sidebar.style.removeProperty("opacity");
    form.classList.toggle("hidden");

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeButton: false,
          closeOnEscapeKey: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("WORKOUT")
      .openPopup();

    document.querySelector(".form").reset();
  }
}

const app = new App();
