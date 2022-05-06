"use strict";

//DOM ELEMENTS
const sidebar = document.querySelector(".sidebar");
const form = document.querySelector(".workout__form");
const formSubmit = document.querySelector(".form__button");
const formDistance = document.querySelector(".form__distance");
const formDuration = document.querySelector(".form__duration");
const formCadence = document.querySelector(".form__cadence");
const formElve = document.querySelector(".form__elve");
const formLabel = document.querySelector(".label");
const workoutType = document.querySelector(".form__select");
const workoutList = document.querySelector(".workout");
const workoutListItem = document.querySelector(".workout__list");

//classes for data
class WorkOut {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration, label, type) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.label = label;
    this.type = type;
  }
}

class Running extends WorkOut {
  constructor(coords, distance, duration, cadence, label, type) {
    super(coords, distance, duration, label, type);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends WorkOut {
  constructor(coords, distance, duration, elveGain, label, type) {
    super(coords, distance, duration, label, type);
    this.elveGain = elveGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//////////////////////////////////
///////////////////////////////
//Application articture
class App {
  #map;
  #mapEvent; //private instance class fields
  #AllWorkouts = [];

  constructor() {
    this._getPosition();

    //DOM EVENT LISTENER

    // adding marker on the map as the form submits
    formSubmit.addEventListener("click", this._newWorkout.bind(this));

    //changing credence to elve
    workoutType.addEventListener("change", this._toogleElevationFields);

    workoutList.addEventListener("click", this._movetoPopup.bind(this));
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
    workoutList.classList.add("hidden");
    form.classList.remove("transform");
    formDistance.focus();
    sidebar.style.setProperty("opacity", "100%");

    this.#mapEvent = e;
  }

  _toogleElevationFields() {
    document.querySelector(".cadence").classList.toggle("hidden");
    document.querySelector(".elve").classList.toggle("hidden");
  }

  _newWorkout(e) {
    /**
     * Get Data from the form
     * Check if the data is valid or not
     * IF the workout is running , create a running object
     * If the workout is cyucling then create a cycling object
     *Add the new object to the workout array
     *Render workout on the list
     * Render marker on the map
     * Clear the form feild + Hide the form
     */
    const distance = +formDistance.value;
    const duration = +formDuration.value;
    const Type = workoutType.value;
    let label = formLabel.value;

    const { lat, lng } = this.#mapEvent.latlng; //coords
    let workout; //for each single workout object

    if (label === "") {
      label =
        Type +
        " on " +
        new Intl.DateTimeFormat(navigator.language, {
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date());
    }

    const valid = (...inputs) => inputs.every((input) => Number(input) > 0);

    if (Type === "Running") {
      const cadenceValue = +formCadence.value;

      if (!valid(distance, duration, cadenceValue)) {
        return alert("Invalid Inputs!!! Please Enter Valid Inputs");
      }
      workout = new Running(
        [lat, lng],
        distance,
        duration,
        cadenceValue,
        label,
        Type
      );
    }

    if (Type === "Cycling") {
      const elvationGain = +formElve.value;
      if (!valid(distance, duration, elvationGain)) {
        return alert("Invalid Inputs!!! Please Enter Valid Inputs");
      }

      workout = new Cycling(
        [lat, lng],
        distance,
        duration,
        elvationGain,
        label,
        Type
      );
    }
    //Renderint the workout object into an array

    this.#AllWorkouts.push(workout);

    e.preventDefault();
    this._renderWorkoutMarker(workout);

    this._renderWorkoutList(workout);
  }

  /////////
  _renderWorkoutMarker(workout) {
    sidebar.style.removeProperty("opacity");
    form.classList.toggle("transform");
    workoutList.classList.toggle("hidden");
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeButton: false,
          closeOnEscapeKey: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(workout.label)
      .openPopup();

    document.querySelector(".form").reset();
  }

  _renderWorkoutList(workout) {
    const html = ` <li class="workout__list-item workout__${
      workout.type
    }" data-id="${workout.id}">
      <h1 class="workout__label">${workout.label}</h1>
      <div class="workout__details">
        <p class="workout__info">
          <span class="workout__icon">${
            workout.type === "Running" ? "🏃‍♂️" : "🚴‍♀️"
          }  </span>
          <span class="workout__distance">${workout.distance}</span
          ><span class="workout__unit"> km </span>
        </p>
        <p class="workout__info">
          <span class="workout__icon"> ⏱ </span>
          <span class="workout__duration">${workout.duration}</span
          ><span class="workout__unit"> min </span>
        </p>
        <p class="workout__info">
          <span class="workout__icon"> ${
            workout.type === "Running" ? "🦶" : "🗻"
          } </span>
          <span class="workout__credence">${
            workout.type === "Running" ? workout.cadence : workout.elveGain
          }</span
          ><span class="workout__unit"> ${
            workout.type === "Running" ? "SPM" : "M"
          }</span>
        </p>
        <p class="workout__info">
          <span class="workout__icon"> ⚡ </span>
          <span class="workout__speed">${
            workout.type === "Running"
              ? workout.pace.toFixed(1)
              : workout.speed.toFixed(1)
          }</span
          ><span class="workout__unit"> ${
            workout.type === "Running" ? "m/min" : "km/h"
          }</span>
        </p>
      </div>
    </li>`;
    workoutListItem.insertAdjacentHTML("afterbegin", html);
  }

  _movetoPopup(e) {
    const workoutEL = e.target.closest(".workout__list-item");

    if (!workoutEL) return;
    const workoutId = this.#AllWorkouts.find(
      (el) => el.id === workoutEL.dataset.id
    );

    this.#map.setView(workoutId.coords, 13, {
      animate: true,
      pan: { duration: 1 },
    });
  }
}

const app = new App();
