"use strict";
(function() {
  const BASE_URL = "https://api.zippopotam.us/us/";
  let longitude1;
  let longitude2;
  let flag;
  const MINUTES_IN_HOUR = 60;
  const TIME_ZONE_WIDTH = 15;

  window.addEventListener("load", init);

  /**
   * This is the main function which adds an event listener to the button
   */
  function init() {
    let button = document.querySelector("button");
    button.addEventListener("click", fetchTimeDiff);

  }

  /**
   * This function reads the user input from the textarea and fetches the zipcodes from the API.
   */
  function fetchTimeDiff() {
    longitude1 = 0;
    longitude2 = 0;
    flag = false;
    let first = document.getElementById("first").value;
    let second = document.getElementById("second").value;

    if (second !== "") {
      fetch(BASE_URL + second)
        .then(statusCheck)
        .then(res => res.json())
        .then(findLongitude2)
        .catch(throwError);
    }

    fetch(BASE_URL + first)
      .then(statusCheck)
      .then(res => res.json())
      .then(findLongitude1)
      .catch(throwError);
  }

  /**
   * This function takes the json object returned by the API and checks if it exists.
   * It throws an error otherwise.
   * @param {object} res : json object returned by fetch
   * @returns {object} json object which has been validated
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * This function retrieves the first longitude from the first json object
   * @param {object} res : json object returned by fetch
   */
  function findLongitude1(res) {
    longitude1 = res.places[0].longitude;
    if (!flag) {
      findTimeDiff();
    }
  }

  /**
   * This function retrieves the second longitude from the second json object
   * @param {object} res : json object returned by fetch
   */
  function findLongitude2(res) {
    longitude2 = res.places[0].longitude;
    if (!flag) {
      findTimeDiff();
    }
  }

  /**
   * This function calculates the time difference or time zone using the longitude values.
   */
  function findTimeDiff() {
    let timeDiff = longitude1 - longitude2;
    let timeZone = Math.abs(timeDiff / TIME_ZONE_WIDTH);
    let timeDiffMinutes = timeZone * MINUTES_IN_HOUR;
    let minutes = timeDiffMinutes % MINUTES_IN_HOUR;
    let heading = document.querySelector("h5");
    if (longitude2 !== 0) {
      heading.textContent = "The time difference is " + Math.abs((timeDiffMinutes -
      minutes) / MINUTES_IN_HOUR) + " hour(s) and " + Math.round(minutes) + " minute(s)";
      document.querySelector("p").classList.add("hidden");
    } else {
      heading.textContent = "The time zone is GMT-" + Math.round(timeZone);
      document.querySelector("p").classList.remove("hidden");
    }
    document.getElementById("result").classList.remove("hidden");
  }

  /**
   * This functions adds an error message to the page if anything fails because the
   * user enters invalid zipcodes.
   */
  function throwError() {
    flag = true;
    let heading = document.querySelector("h5");
    heading.textContent = "Please enter valid zipcodes";
    document.getElementById("result").classList.remove("hidden");
  }
})();