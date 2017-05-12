'use strict'

const superagent = require('superagent')
const apiKey = process.env.PLACES_WEBSERVICE_KEY

function filterPlace(places) {
  let foundPlace = false;
  do {

  } while (foundPlace === false)
  let rand = Math.floor(Math.random() * places.length);
  let place = {
    name: places[rand].name
  }
  if (places[rand].photos) {
    const photoRef = places[rand].photos[0].photo_reference;
    place.img = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&maxheight=400&maxwidth=400&key=${apiKey}`;
  }
  return place;
}

module.exports.filterPlace = filterPlace;
