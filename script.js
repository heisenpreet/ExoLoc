"use strict";

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
      const map = L.map("map").setView(coords, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", function (mapEvent) {
        const { lat, lng } = mapEvent.latlng;
        L.marker([lat, lng]).addTo(map).bindPopup(L.popup({})).openPopup();
      });
    },
    function () {
      alert("couldn't connect");
    }
  );
}
