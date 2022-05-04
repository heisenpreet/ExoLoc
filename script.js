"use strict";

//DOM ELEMENTS
const sidebar = document.querySelector(".sidebar");
const form = document.querySelector(".workout__form");
const formSubmit = document.querySelector(".form__button");
const formDistance = document.querySelector(".form__distance");
const workoutType = document.querySelector(".form__select");

let map, mapEvent;
////////////////////////////////
///////////////////////////////
//  CASE 1 : Geolocation API Function
////////////////////////////////
///////////////////////////////

/**
 * Checking if the geolocation api is supported or not for older devices
 * the navigator.geoloaction api gets two callback functions , 1 is for success and 2nd is for the error
 */

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;

      ////////////////////////////////
      ///////////////////////////////
      //  CASE 2 : Using leaflet libarary to display map
      ////////////////////////////////
      ///////////////////////////////
      const coords = [latitude, longitude];
      map = L.map("map").setView(coords, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", function (e) {
        //IMPORTANT EVENT FX OF MAP

        form.classList.remove("hidden");
        formDistance.focus();
        sidebar.style.setProperty("opacity", "100%");

        mapEvent = e;
      });
    },
    function () {
      alert("couldn't connect");
    }
  );
}

// adding marker on the map as the form submits
formSubmit.addEventListener("click", function (e) {
  e.preventDefault();

  sidebar.style.removeProperty("opacity");
  form.classList.toggle("hidden");

  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
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
});

//changing credence to elve
workoutType.addEventListener("change", function (e) {
  document.querySelector(".cadence").classList.toggle("hidden");
  document.querySelector(".elve").classList.toggle("hidden");
});
