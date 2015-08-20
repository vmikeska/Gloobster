

//extractAllCities(new Array(), '/me/tagged_places', everythingExtracted);

function extractAllCities(locations, currentUrl, onEverythingExtracted) {

    facebook.api(currentUrl, function (response) {
        var currentPlaces = extractCities(response.data);

        locations = locations.concat(currentPlaces.locations);
        if (response.paging.next) {
            extractAllCities(locations, response.paging.next, onEverythingExtracted);
        } else {
            onEverythingExtracted(locations);
        }
    });

};


function extractCities(placesData) {
    var result = { placesIds: [], locations: [] };

    for (var actPlaceIndex in placesData) {
        var place = placesData[actPlaceIndex].place;
        var location = place.location;

        result.placesIds.push(place.id);

        var newLocation = {};

        if (location.city && location.country) {
            newLocation.country = location.country;
            newLocation.city = location.city;
        }

        if (location.latitude && location.longitude) {
            newLocation.location = { latitude: location.latitude, longitude: location.longitude };
        }

        result.locations.push(newLocation);
    }


    return result;
}


function unique(arr) {
    var hash = {}, result = [];
    for (var i = 0, l = arr.length; i < l; ++i) {
        if (!hash.hasOwnProperty(arr[i])) { //it works with objects! in FF, at least
            hash[arr[i]] = true;
            result.push(arr[i]);
        }
    }
    return result;
}


function everythingExtracted(locations) {
    locations.forEach(function (location) {
        addPushpin(null, location.location.latitude, location.location.longitude);
    });

    var countries = new Array();
    locations.forEach(function (location) {
        if (location.country) {
            countries.push(location.country);
        }
    });
    var uniqueCountries = unique(countries);
    $scope.countriesVisited = uniqueCountries.length;
}