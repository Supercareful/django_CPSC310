<script type="text/javascript">

var map;
var delay = 0;
var i = 0;
var geocoder;
var initLocations = {{ init_locations|safe }};
var geocodeLocations = {{ geocode_locations|safe }};
var attempts = 0;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.2561055, lng: -123.1939531},
    zoom: 11
  });
  geocoder = new google.maps.Geocoder();
  
  plotLocations(initLocations);
  geocodeAndPlotLocations();
  }

// used code from http://stackoverflow.com/questions/19640055/multiple-markers-google-map-api-v3-from-array-of-addresses-and-avoid-over-query
function geocodeAddress(location, next) {
  address = location.fields.address + ', ' + location.fields.city
  storeName = location.fields.store_name
  geocoder.geocode({ 'address': address, 'bounds': map.getBounds() }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      attempts = 0;
      delay = 0;
      createMarker(storeName, address, results[0].geometry.location)
    } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      if (attempts < 1) {
        i--;
        attempts++;
        delay = 1000;
      } else {
        attempts++;
      }
    } else {
      console.log('Geocode not successful for the following reason: ' + status);
    }
    next();
  });
}

function createMarker(storeName, address, latLng) {
  var marker = new google.maps.Marker({
    map: map,
    position: latLng
  });

  marker.addListener('click', function() {
    var contentString = "<strong>" + storeName + "</strong></br>" +
                        "<p>" + address + "</p>";
    var infowindow = new google.maps.InfoWindow ({
      content: contentString
    });
    infowindow.open(map, marker);
  });
}

function plotLocations(locations) {
  for (var j = 0; j < locations.length; j++) {
    loc = locations[j];
    createMarker(loc.fields.store_name, loc.fields.address + ", " + loc.fields.city, {'lat': loc.fields.latitude, 'lng': loc.fields.longitude });
  }
}

function geocodeAndPlotLocations() {
  if (i < 50 && attempts < 3) {
    setTimeout(function() { 
      geocodeAddress(geocodeLocations[i], geocodeAndPlotLocations)
    }, delay);
    i++;
  }
}


</script>
    <script async defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDw3QjnTZGH6JIV9NyKnrXsxo6acAKITJY&callback=initMap">
    </script>