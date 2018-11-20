var surfSpots = [
    {title: 'Magheroarty, Co. Donegal', location: {lat: 55.162985, lng: -8.143272}},
    {title: 'Falcarragh, Co. Donegal', location: {lat: 55.16073, lng: -8.085937}},
    {title: 'Rossnowlagh, Co. Donegal', location: {lat: 54.555689, lng: -8.210135}},
    {title: 'Bundoran, Co. Donegal', location: {lat: 54.508327, lng: -8.255281}},
    {title: 'Easky, Co. Sligo', location: {lat: 54.295691, lng: -8.98613}},
    {title: 'Inishcrone, Co. Sligo', location: {lat: 54.211954, lng: -9.102001}},
    {title: 'Keel, Achill Island', location: {lat: 53.974364, lng: -10.070858}},
    {title: 'Dun Loughan, Co. Galway', location: {lat: 53.419968, lng: -10.145874}},
    {title: 'Lahinch, Co. Clare', location: {lat: 52.942328, lng: -9.368334}},
    {title: 'Doonbeg, Co. Clare', location: {lat: 52.76445, lng: -9.493389}},
    {title: 'Castlegregory, Co. Kerry', location: {lat: 52.276666, lng: -10.037212}},
    {title: 'Inch Strand, Co. Kerry', location: {lat: 52.128852, lng: -9.955673}},
    {title: 'Barley Cove, Co. Cork', location: {lat: 51.469675, lng: -9.775343}},
    {title: 'Inchydoney, Co. Cork', location: {lat: 51.597281, lng: -8.861418}},
    {title: 'Castlefreake, Co. Cork', location: {lat: 51.557116, lng: -8.966045}, point: 'Southwest'},
    {title: 'Garretstown, Co. Cork', location: {lat: 51.640394, lng: -8.564358}},
    {title: 'Tramore, Co. Waterford', location: {lat: 52.153083, lng: -7.107811}},
    {title: 'Portrush, Co. Antrim', location: {lat: 55.170241, lng: -6.731873}},
    {title: 'Magheramore, Co. Wicklow', location: {lat: 52.930841, lng: -6.023053}},
    {title: 'Whiterock, County Dublin', location: {lat: 53.265934, lng: -6.106232}, point: 'Southeast'}
] 

function initMap() {

    var styles = [
        {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [
                { color: '#11487D' }
            ]
        },
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
                { visibility: 'off' }
            ]
        },
        {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
                { color: '#70D6BC' }
            ]
        },
        {
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
                { visibility: 'off' }
            ]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                { color: '#38C7BD' }
            ]
        },
        {
            featureType: 'road',
            elementType: 'labels',
            stylers: [
                { visibility: 'off' }
            ]
        },
        {
            featureType: 'water',
            elementType: 'all',
            stylers: [
                { color: '#0E7FA6' }
            ]
        }
    ]

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 53.326116, lng: -7.946834},
        zoom: 6,
        styles: styles,
        disableDefaultUI: true,
        mapTypeControl: false
    });

    var markers = [];
    
    var infoWindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < surfSpots.length; i++) {
        var position = surfSpots[i].location;
        var title = surfSpots[i].title;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
              }
        });
        // Push marker to our array of markers
        markers.push(marker);
        // Create an onclick event to open an infoWindow at each marker
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
        });
        bounds.extend(marker.position);
    }

    // Extend the boundaries of the map for each marker
    // map.fitBounds(bounds);

    function populateInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div id=infoWindow>' + marker.title + '</div>');
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });
        }
    }
}

// Stormglass API

const lat = surfSpots[19].location['lat'];
const lng = surfSpots[19].location['lng'];
const params = 'seaLevel,waveHeight,airTemperature,currentDirection,swellDirection,swellHeight,swellPeriod,waterTemperature,waveDirection,waveHeight,wavePeriod,windDirection,windSpeed';

// const polygon = surfSpots.map(function(spot) {
//     return spot.location.lat;
// })

// var logSurfSpotsLat = surfSpots.map(function(spot) {
//     return spot.location.lat;
//   });
  
//   var logSurfSpotsLng = surfSpots.map(function(spot) {
//     return spot.location.lng;
//   });
  
//   var polygon = logSurfSpotsLat[17] +','+ logSurfSpotsLng[17] +':'+
//     logSurfSpotsLat[1] +','+ logSurfSpotsLng[1] +':'+
//     logSurfSpotsLat[0] +','+ logSurfSpotsLng[0] +':'+
//     logSurfSpotsLat[2] +','+ logSurfSpotsLng[2] +':'+
//     logSurfSpotsLat[3] +','+ logSurfSpotsLng[3] +':'+
//     logSurfSpotsLat[4] +','+ logSurfSpotsLng[4] +':'+
//     logSurfSpotsLat[5] +','+ logSurfSpotsLng[5] +':'+
//     logSurfSpotsLat[6] +','+ logSurfSpotsLng[6] +':'+
//     logSurfSpotsLat[7] +','+ logSurfSpotsLng[7] +':'+
//     logSurfSpotsLat[8] +','+ logSurfSpotsLng[8] +':'+
//     logSurfSpotsLat[9] +','+ logSurfSpotsLng[9] +':'+
//     logSurfSpotsLat[10] +','+ logSurfSpotsLng[10] +':'+
//     logSurfSpotsLat[11] +','+ logSurfSpotsLng[11] +':'+
//     logSurfSpotsLat[12] +','+ logSurfSpotsLng[12] +':'+
//     logSurfSpotsLat[14] +','+ logSurfSpotsLng[14] +':'+
//     logSurfSpotsLat[13] +','+ logSurfSpotsLng[13] +':'+
//     logSurfSpotsLat[15] +','+ logSurfSpotsLng[15] +':'+
//     logSurfSpotsLat[16] +','+ logSurfSpotsLng[16] +':'+
//     logSurfSpotsLat[18] +','+ logSurfSpotsLng[18] +':'+
//     logSurfSpotsLat[19] +','+ logSurfSpotsLng[19];

//     console.log(polygon);

// var box = '60,20:58,17'

var xhr = new XMLHttpRequest();
xhr.open('GET', `https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}`, true);
// xhr.open('GET', `https://api.stormglass.io/point?box=${box}`, true);

xhr.setRequestHeader('Authorization', 'b891271c-e610-11e8-83ef-0242ac130004-b891282a-e610-11e8-83ef-0242ac130004');

xhr.onreadystatechange = function() {

    // console.log('READYSTATE: ', xhr.readyState);
    // console.log('STATUS: ', xhr.status);

    if (this.readyState == 4 && this.status == 200) {
        // console.log(this.responseText);
        // document.getElementById('data').innerHTML = this.responseText;
        var weather = JSON.parse(this.responseText);
        console.log(weather);

// Download JSON file:

        var output = '';

        var seaLevel = weather.hours[0].seaLevel[0].value;
        var time = weather.hours[0].time;
        var airTemperature = Math.round(weather.hours[0].airTemperature[0].value);
        var waveHeight = (weather.hours[0].waveHeight[0].value).toFixed(1);

        var currentDirection = (weather.hours[0].currentDirection[0].value).toFixed(1);
        var swellDirection = (weather.hours[0].swellDirection[0].value).toFixed(1);
        var swellHeight = weather.hours[0].swellHeight[0].value;
        var swellPeriod = Math.round(weather.hours[0].swellPeriod[0].value);
        var waterTemperature = Math.round(weather.hours[0].waterTemperature[0].value);
        var waveDirection = (weather.hours[0].waveDirection[0].value).toFixed(1);
        var waveHeight = (weather.hours[0].waveHeight[0].value).toFixed(1);
        var wavePeriod = Math.round(weather.hours[0].wavePeriod[0].value);
        var windDirection = (weather.hours[0].windDirection[0].value).toFixed(1);
        var windSpeed = Math.round(weather.hours[0].windSpeed[0].value);

        var timeNow = new Date();

        // Display time for tidal & temperature information

        var timeHour = ('0' + timeNow.getHours()).slice(-2);
        var timeMinutes = timeNow.getMinutes();

        function direction(value) {
            if (value >= 0 && value < 22.5 || value >=337.5) {
                return 'North';
            } else if (value >= 22.5 && value < 67.5) {
                return 'Northeast';
            } else if (value >= 67.5 && value < 112.5) {
                return 'East';
            } else if (value >= 112.5 && value < 157.5) {
                return 'Southeast';
            } else if (value >= 157.5 && value < 202.5) {
                return 'South';
            } else if (value >= 202.5 && value < 247.5) {
                    return 'Southwest';
            } else if (value >= 247.5 && value <292.5) {
                    return 'West';
            } else if (value >= 292.5 && value <337.5) {
                    return 'Northwest';
            }
        };


        output += '<div>' +
            '<ul>' +
                '<li>Today is: '+timeNow+'</li>'+
                '<li>Surf Spot: '+surfSpots[19].title+'</li>' +
                '<br>' +
                '<li>Date & Time: '+time+'</li>' +
                '<li>Tide size: '+seaLevel+'</li>' +
                '<br>' +
                '<li>Air Temperature: '+airTemperature+' &#8451</li>' +
                '<li>Water Temperature: '+waterTemperature+' &#8451</li>' +
                '<br>' +
                '<li>Wave Height: '+waveHeight+' m</li>' +
                '<li>Wave Period: '+wavePeriod+' seconds</li>' +
                '<li>Swell Height: '+swellHeight+' m</li>' +
                '<li>Swell Period: '+swellPeriod+' seconds</li>' +
                '<br>' +
                '<li>Surf Spot pointing: '+surfSpots[19].point+'</li>' +
                '<li>Current Direction from: '+direction(currentDirection)+'</li>' +
                '<li>Swell Direction from: '+direction(swellDirection)+'</li>' +
                '<li>Wave Direction from: '+direction(waveDirection)+'</li>' +
                '<li>Wind Direction from: '+direction(windDirection)+'</li>' +
                '<br>' +
                '<li>Wind Speed: '+windSpeed+' m/second</li>' +
            '</ul>'

            document.getElementById('data01').innerHTML = output;

    } else if (this.readyState == 4 && this.status == 402) {
        document.getElementById('data01').innerHTML = 'Data request exceeded! Please come back tomorrow';
    }
};

xhr.onerror = function() {
    console.log('Request error: ');
};

xhr.send();