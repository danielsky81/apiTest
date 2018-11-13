var surfSpots = [
    {id: '01', title: 'Magheroarty, Co. Donegal', location: {lat: 55.162985, lng: -8.143272}},
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
    {title: 'Castlefreake, Co. Cork', location: {lat: 51.557116, lng: -8.966045}},
    {title: 'Garretstown, Co. Cork', location: {lat: 51.640394, lng: -8.564358}},
    {title: 'Tramore, Co. Waterford', location: {lat: 52.153083, lng: -7.107811}},
    {title: 'Portrush, Co. Antrim', location: {lat: 55.170241, lng: -6.731873}},
    {title: 'Magheramore, Co. Wicklow', location: {lat: 52.930841, lng: -6.023053}},
    {title: 'Whiterock, County Dublin', location: {lat: 53.265934, lng: -6.106232}}
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
const params = 'waveHeight,airTemperature';

var xhr = new XMLHttpRequest();
xhr.open('GET', `https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}`, true);

xhr.setRequestHeader('Authorization', 'b891271c-e610-11e8-83ef-0242ac130004-b891282a-e610-11e8-83ef-0242ac130004');

xhr.onreadystatechange = function() {

    // console.log('READYSTATE: ', xhr.readyState);
    // console.log('STATUS: ', xhr.status);

    if (this.readyState == 4 && this.status == 200) {
        // console.log(this.responseText);
        document.getElementById('data').innerHTML = this.responseText;
    } else if (this.readyState == 4 && this.status == 402) {
        document.getElementById('data').innerHTML = 'Data request exceeded! Please come back tomorrow';
    }
};

xhr.onerror = function() {
    console.log('Request error: ');
};

xhr.send();


// fetch(`https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}`, {
//   headers: {
//     'Authorization': 'b891271c-e610-11e8-83ef-0242ac130004-b891282a-e610-11e8-83ef-0242ac130004'
//   }
// }).then(function(response) {
//   // Do something with response data.
//   return response.json();
// //   console.log(jsonData);
// }).then(function(data) {
//     console.log(data);
    
//     let output = '<h2>Forecast</h2>';
//     data.hours.forEach(function(weather) {
//         output += `
//         <div>
//             <h2>Temp: ${weather[0].airTemperature[0].value}</h2>
//             <h2>Wave height: ${weather[0].waveHeight[0].value}</h2>
//         </div>
//         `;
//     });
//     document.getElementById('data').innerText = output;
// }).catch(function(error) {
//     return console.log(error);
// });
