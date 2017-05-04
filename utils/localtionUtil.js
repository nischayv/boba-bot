'use strict'

function formatLocation(location) {
  let locationString = ''
  for (let key in location) {
    if (location.hasOwnProperty(key)) {
      locationString += `${location[key]}, `
    }
  }
  locationString = locationString.slice(0, locationString.length - 2);
  return locationString.replace(/ /g, '+');
}

module.exports.formatLocation = formatLocation;
