// Local Storage Checks

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

if (storageAvailable('localStorage')) {
    console.log('Yippee! We can use localStorage awesomeness');
  } else {
    console.log('Too bad, no localStorage for us');
};

// Surf Spots definition

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
    {title: 'Castlefreake, Co. Cork', location: {lat: 51.557116, lng: -8.966045}, point: 225},
    {title: 'Garretstown, Co. Cork', location: {lat: 51.640394, lng: -8.564358}},
    {title: 'Tramore, Co. Waterford', location: {lat: 52.153083, lng: -7.107811}},
    {title: 'Portrush, Co. Antrim', location: {lat: 55.170241, lng: -6.731873}},
    {title: 'Magheramore, Co. Wicklow', location: {lat: 52.930841, lng: -6.023053}},
    {title: 'Whiterock, County Dublin', location: {lat: 53.265934, lng: -6.106232}, point: 135}
] 

// ****************************************************************** Google Maps API

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

// To be used with OpenWeatherMap API and Stormglass API

const lat = surfSpots[19].location['lat'];
const lng = surfSpots[19].location['lng'];

var surfSpot = surfSpots[19];

// console.log(surfSpots[19]);

// ****************************************************************** OpenWeatherMap API

var apiOpenWeather = '74ecf887ea2ee80ab6586f67dfe5ee24';

var xhr = new XMLHttpRequest();

xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${apiOpenWeather}`, true);

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var openWeather = JSON.parse(this.responseText);
        // console.log(openWeather);

// Storing data locally

        var openWeatherApi = openWeather;
        var openWeatherApiData;

        localStorage.setItem('openWeatherApi', JSON.stringify(openWeather));

// BELOW MOVED OUTSIDE XHR REQUEST AS STORED LOCALLY:

//         var output = '';

// // Unix time to local time conversion

//         function unixToLocal(t) {
//             var dt = new Date(t*1000);
//             var hr = dt.getHours();
//             var m = '0' + dt.getMinutes();
//             return hr+ ':' +m.substr(-2); 
//         }

//         var sunrise = openWeather.sys.sunrise;
//         var sunset = openWeather.sys.sunset;

//         // console.log(unixToLocal(sunrise));
//         // console.log(unixToLocal(sunset));
//         // console.log(openWeather.weather[0].main);
//         // console.log(openWeather.main.temp);
//         // console.log(openWeather.wind.speed);
//         // console.log(openWeather.weather[0].description);

//         output += '<div>' +
//             '<ul>' +
//                 '<li>Surf Spot: '+surfSpot.title+'</li>' +       
//                 '<br>' +
//                 '<li>Sunrise: '+unixToLocal(sunrise)+'</li>'+
//                 '<li>Sunset: '+unixToLocal(sunset)+'</li>' +
//                 '<br>' +
//                 '<li>Weather: '+openWeather.weather[0].main+'</li>' +
//             '</ul>'

//             document.getElementById('data01').innerHTML = output;

    } else if (this.readyState == 4 && this.status == 402) {
        document.getElementById('data01').innerHTML = 'Data request exceeded! Please come back tomorrow';
    }  
};

xhr.onerror = function() {
    console.log('Request error');
};

xhr.send();

// ****************************************************************** Stormglass API

const params = 'airTemperature,waterTemperature,waveHeight,wavePeriod,swellDirection,swellHeight,swellPeriod,windDirection,windSpeed';

var xhr = new XMLHttpRequest();
xhr.open('GET', `https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}`, true);

xhr.setRequestHeader('Authorization', 'b891271c-e610-11e8-83ef-0242ac130004-b891282a-e610-11e8-83ef-0242ac130004');

xhr.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
        var weatherAPI = JSON.parse(this.responseText);
        // console.log('Stormglass API JSON data:');

// Storing data locally

var stormglassAPI = weatherAPI;
var stormglassAPIData;

localStorage.setItem('stormglassAPI', JSON.stringify(weatherAPI));

// MOVE OUTSIDE OF XHR REQUEST

// console.log(weather); // unspliced

// var weatherSpliced = (weather.hours).splice(24);

// // console.log(weather); // day data

// var afternoon = (weather.hours).splice(-9, 6);

//                     // console.log(afternoon);
//                     // console.log(afternoon[0].airTemperature[0].value);
//                     // console.log(weather);

// var midday = (weather.hours).splice(-7, 4);

// var morning = (weather.hours).splice(-9, 6);

//                     // console.log(morning);
//                     // console.log(midday);
//                     // console.log(afternoon);

//                     // console.log(total);

//                     // for (var v in morning) {
//                     //     total += morning[v].airTemperature[0].value;
//                     //     console.log(total);
//                     // }

//                     // for (var i = 0; i < morning.length; i++) {
//                     //     total += morning[i].airTemperature[0].value;
//                     //     console.log(total);
//                     // }

// // function that calculate an average data for selection of arrays:

// // function timeOfDay(time) {
// //     var total = 0;
// //     time.forEach(function(hour) {
// //         total += hour.airTemperature[0].value;
// //         console.log(total);
// //     });
// //     var average = Math.round(total / time.length);
// //     return average;
// // }

// var parameters = [waveHeight, wavePeriod, windDirection, windSpeed, airTemperature, waterTemperature];

// function timeOfDay(time, param) {
//     var total = 0;
//     time.forEach(function(hour) {
//         total += hour.parameters[0].value;
//         console.log(total);
//     });
//     var average = Math.round(total / time.length);
//     return average;
// }

// console.log(timeOfDay(midday));
// console.log(timeOfDay(morning));
// console.log(timeOfDay(afternoon));

// // morning.forEach(function(hour) {
// //     total += hour.airTemperature[0].value;
// //     console.log(total);
// // });

// var morningAv = Math.round(total / morning.length) 

// console.log(morningAv);



//         // DATA

//         var output = '';

// // getting an average values for data values with several sources
// // maybe stick to the first source i.e. SG as it is the most frequent and first in all data
// // NOT REQUIRED ANYMORE

//         // var total = 0;
//         // var length = 0;

//         // for (var v in weather.hours[12].airTemperature) {
//         //     total += weather.hours[12].airTemperature[v].value;
//         //     length++;
//         // };

//         // var averageAirTemp = total / length;

//         // console.log('Average Air Temperature: ' +averageAirTemp);

// // Data break down into types and values:

//         var time = weather.hours[12].time;
//         var airTemperature = Math.round(airTemperature);
//         var waterTemperature = Math.round(weather.hours[12].waterTemperature[0].value);
//         var waveHeight = (weather.hours[12].waveHeight[0].value).toFixed(1);
//         var wavePeriod = Math.round(weather.hours[12].wavePeriod[0].value);
//         var swellDirection = (weather.hours[12].swellDirection[0].value).toFixed(1);
//         var windDirection = (weather.hours[12].windDirection[0].value).toFixed(1);
//         var windSpeed = Math.round(weather.hours[12].windSpeed[0].value);

//         var timeNow = new Date();

//         console.log('Todays date: ' + timeNow.getFullYear() + '.' + timeNow.getMonth() + '.' + timeNow.getDate());

// // Display time for tidal & temperature information

//         var timeHour = ('0' + timeNow.getHours()).slice(-2);
//         var timeMinutes = timeNow.getMinutes();

// // Function to return Word Direction in Names:

//         // function direction(value) {
//         //     if (value >= 0 && value < 22.5 || value >=337.5) {
//         //         return 'North';
//         //     } else if (value >= 22.5 && value < 67.5) {
//         //         return 'Northeast';
//         //     } else if (value >= 67.5 && value < 112.5) {
//         //         return 'East';
//         //     } else if (value >= 112.5 && value < 157.5) {
//         //         return 'Southeast';
//         //     } else if (value >= 157.5 && value < 202.5) {
//         //         return 'South';
//         //     } else if (value >= 202.5 && value < 247.5) {
//         //             return 'Southwest';
//         //     } else if (value >= 247.5 && value <292.5) {
//         //             return 'West';
//         //     } else if (value >= 292.5 && value <337.5) {
//         //             return 'Northwest';
//         //     }
//         // };

// // Function that return degrees that fall withing range of word directions:

//         function direction(value) {
//             if (value >= 0 && value < 22.5 || value >=337.5) {
//                 return 0;
//             } else if (value >= 22.5 && value < 67.5) {
//                 return 45;
//             } else if (value >= 67.5 && value < 112.5) {
//                 return 90;
//             } else if (value >= 112.5 && value < 157.5) {
//                 return 135;
//             } else if (value >= 157.5 && value < 202.5) {
//                 return 180;
//             } else if (value >= 202.5 && value < 247.5) {
//                     return 225;
//             } else if (value >= 247.5 && value <292.5) {
//                     return 270;
//             } else if (value >= 292.5 && value <337.5) {
//                     return 315;
//             }
//         };

// // Wind types that usues the wind direction and surf spots pointing direction to determin tyoe of wind for location

//         // var wind = direction(windDirection);
//         var wind = direction(windDirection);
//         var point = surfSpot.point;

//         console.log('Wind & Surf Spot wind directions: ' + wind + ' ' + point);

//         // var North = 0;
//         // var Northeast = 45;
//         // var East = 90;
//         // var Southeast = 135;
//         // var South = 180;
//         // var Southwest = 225;
//         // var West = 270;
//         // var Northwest = 315;

//         var range = [wind, point];

//         console.log('An Array of wind & point direction values: ' + range);
        
//         function check() {
//             if ((wind - point) === 0) {
//               return 'Offshore';
//             } else if (
//               (range[0] === 0) && (range[1] === 180) ||
//               (range[0] === 180) && (range[1] === 0) ||
//               (range[0] === 90) && (range[1] === 270) ||
//               (range[0] === 270) && (range[1] === 90) ||
//               (range[0] === 45) && (range[1] === 225) ||
//               (range[0] === 225) && (range[1] === 45) ||
//               (range[0] === 135) && (range[1] === 315) ||
//               (range[0] === 315) && (range[1] === 135)) {
//               return 'Onshore';
//             } else {
//               return 'Crosswind';
//             }
//           }
        
//         console.log('Type of wind result is: ' + check());


// // Alternative simpler solution:

// // function checkDirection(wind, point) {
    
// //     let direction;
// //     let array = [[0, 180],[45, 225],[90, 270],[135, 315]];
    
// //     if (wind - point === 0) return 'Offshore';

// //     array.forEach( arr => {
// //         if (arr.includes(wind) && arr.includes(point)) {
// //             return direction =  true;
// //         }
// //     });

// //     return direction ? 'Onshore' : 'Crosswind';
// // }
// // console.log(checkDirection(45, 225))

// // OUTPUT 1 - As per API requested time

//         output += '<div>' +
//             '<ul>' +
//                 '<li>Today is: '+timeNow+'</li>'+
//                 '<li>Surf Spot: '+surfSpot.title+'</li>' +
//                 '<br>' +
//                 '<li>Date & Time of the Forecast: '+time+'</li>' +
//                 '<br>' +
//                 '<li>Air Temperature: '+airTemperature+' &#8451</li>' +
//                 '<li>Water Temperature: '+waterTemperature+' &#8451</li>' +
//                 '<br>' +
//                 '<li>Wave Height: '+waveHeight+' m</li>' +
//                 '<li>Wave Period: '+wavePeriod+' seconds</li>' +
//                 '<br>' +
//                 '<li>Surf Spot pointing: '+surfSpot.point+'</li>' +
//                 '<li>Swell Direction from: '+direction(swellDirection)+'</li>' +
//                 '<li>Wind Direction from: '+direction(windDirection)+'</li>' +
//                 '<li>Wind Direction from: '+windDirection+'</li>' +
//                 '<li>Wind: '+range+' '+check()+'</li>' +
//                 '<br>' +
//                 '<li>Wind Speed: '+windSpeed+' m/second</li>' +
//             '</ul>'

//             document.getElementById('data02').innerHTML = output;

// // OUTPUT 2 NOW

//         var outputtwo = '';

//         // Time NOW

//         var timeNow = new Date();
//         // var timeNowHour = timeNow.getHours();

//         var timeNowHour = 13;

//         console.log('Current time (Hour): ' + timeNowHour);

//         // UTC time to Hour and Minutes + Check the current Hour and provide data for that Time

//         var timeWeather = new Date(weather.hours[timeNowHour].time);
//         var timeWeatherHour = timeWeather.getUTCHours();

//         console.log('Time from API (Hour): ' + timeWeatherHour);

//         var dataNow = weather.hours[timeNowHour];

//         var airTemperature = Math.round(dataNow.airTemperature[0].value);
//         var waterTemperature = Math.round(dataNow.waterTemperature[0].value);
//         var waveHeight = (dataNow.waveHeight[0].value).toFixed(1);
//         var wavePeriod = Math.round(dataNow.wavePeriod[0].value);
//         var swellDirection = (dataNow.swellDirection[0].value).toFixed(1);
//         var windDirection = (dataNow.windDirection[0].value).toFixed(1);
//         var windSpeed = Math.round(dataNow.windSpeed[0].value);

//         outputtwo += '<div>' +
//             '<ul>' +
//                 '<li>Today is: '+timeNow+'</li>'+
//                 '<li>Surf Spot: '+surfSpot.title+'</li>' +
//                 '<br>' +
//                 '<li>Air Temperature: '+airTemperature+' &#8451</li>' +
//                 '<li>Water Temperature: '+waterTemperature+' &#8451</li>' +
//                 '<br>' +
//                 '<li>Wave Height: '+waveHeight+' m</li>' +
//                 '<li>Wave Period: '+wavePeriod+' seconds</li>' +
//                 '<br>' +
//                 // '<li>Surf Spot pointing: '+surfSpot.point+'</li>' +
//                 // '<li>Swell Direction from: '+direction(swellDirection)+'</li>' +
//                 // '<li>Wind Direction from: '+direction(windDirection)+'</li>' +
//                 '<li>Wind: '+range+' '+check()+'</li>' +
//                 // '<br>' +
//                 '<li>Wind Speed: '+windSpeed+' m/second</li>' +
//             '</ul>'

//             document.getElementById('data04').innerHTML = outputtwo;


// // OUTPUT 3

// var outputthree = '';

// var dataNow = weather.hours[timeNowHour];

// var airTemperature0 = Math.round(weather.hours[0].airTemperature[0].value);
// var airTemperature1 = Math.round(weather.hours[2].airTemperature[0].value);
// var airTemperature2 = Math.round(weather.hours[4].airTemperature[0].value);
// var airTemperature3 = Math.round(weather.hours[6].airTemperature[0].value);
// var airTemperature4 = Math.round(weather.hours[8].airTemperature[0].value);
// var airTemperature5 = Math.round(weather.hours[10].airTemperature[0].value);
// var airTemperature6 = Math.round(weather.hours[12].airTemperature[0].value);
// var airTemperature7 = Math.round(weather.hours[14].airTemperature[0].value);
// var airTemperature8 = Math.round(weather.hours[16].airTemperature[0].value);
// var airTemperature9 = Math.round(weather.hours[18].airTemperature[0].value);
// var airTemperature10 = Math.round(weather.hours[20].airTemperature[0].value);
// var airTemperature11 = Math.round(weather.hours[22].airTemperature[0].value);
// var airTemperature12 = Math.round(weather.hours[23].airTemperature[0].value);
// var waterTemperature1 = Math.round(weather.hours[0].waterTemperature[0].value);
// var waterTemperature2 = Math.round(weather.hours[2].waterTemperature[0].value);
// var waterTemperature3 = Math.round(weather.hours[4].waterTemperature[0].value);
// var waterTemperature4 = Math.round(weather.hours[6].waterTemperature[0].value);
// var waterTemperature5 = Math.round(weather.hours[8].waterTemperature[0].value);
// var waterTemperature6 = Math.round(weather.hours[10].waterTemperature[0].value);
// var waterTemperature7 = Math.round(weather.hours[12].waterTemperature[0].value);
// var waterTemperature8 = Math.round(weather.hours[14].waterTemperature[0].value);
// var waterTemperature9 = Math.round(weather.hours[16].waterTemperature[0].value);
// var waterTemperature10 = Math.round(weather.hours[18].waterTemperature[0].value);
// var waterTemperature11 = Math.round(weather.hours[20].waterTemperature[0].value);
// var waterTemperature12 = Math.round(weather.hours[22].waterTemperature[0].value);

// var waveHeight1 = (weather.hours[0].waveHeight[0].value).toFixed(1);
// var waveHeight2 = (weather.hours[2].waveHeight[0].value).toFixed(1);
// var waveHeight3 = (weather.hours[4].waveHeight[0].value).toFixed(1);
// var waveHeight4 = (weather.hours[6].waveHeight[0].value).toFixed(1);
// var waveHeight5 = (weather.hours[8].waveHeight[0].value).toFixed(1);
// var waveHeight6 = (weather.hours[10].waveHeight[0].value).toFixed(1);
// var waveHeight7 = (weather.hours[12].waveHeight[0].value).toFixed(1);
// var waveHeight8 = (weather.hours[14].waveHeight[0].value).toFixed(1);
// var waveHeight9 = (weather.hours[16].waveHeight[0].value).toFixed(1);
// var waveHeight10 = (weather.hours[18].waveHeight[0].value).toFixed(1);
// var waveHeight11 = (weather.hours[20].waveHeight[0].value).toFixed(1);
// var waveHeight12 = (weather.hours[22].waveHeight[0].value).toFixed(1);

// var swellHeight1 = (weather.hours[0].swellHeight[0].value).toFixed(1);
// var swellHeight2 = (weather.hours[2].swellHeight[0].value).toFixed(1);
// var swellHeight3 = (weather.hours[4].swellHeight[0].value).toFixed(1);
// var swellHeight4 = (weather.hours[6].swellHeight[0].value).toFixed(1);
// var swellHeight5 = (weather.hours[8].swellHeight[0].value).toFixed(1);
// var swellHeight6 = (weather.hours[10].swellHeight[0].value).toFixed(1);
// var swellHeight7 = (weather.hours[12].swellHeight[0].value).toFixed(1);
// var swellHeight8 = (weather.hours[14].swellHeight[0].value).toFixed(1);
// var swellHeight9 = (weather.hours[16].swellHeight[0].value).toFixed(1);
// var swellHeight10 = (weather.hours[18].swellHeight[0].value).toFixed(1);
// var swellHeight11 = (weather.hours[20].swellHeight[0].value).toFixed(1);
// var swellHeight12 = (weather.hours[22].swellHeight[0].value).toFixed(1);

// var swellPeriod1 = (weather.hours[0].swellPeriod[0].value).toFixed(1);
// var swellPeriod2 = (weather.hours[2].swellPeriod[0].value).toFixed(1);
// var swellPeriod3 = (weather.hours[4].swellPeriod[0].value).toFixed(1);
// var swellPeriod4 = (weather.hours[6].swellPeriod[0].value).toFixed(1);
// var swellPeriod5 = (weather.hours[8].swellPeriod[0].value).toFixed(1);
// var swellPeriod6 = (weather.hours[10].swellPeriod[0].value).toFixed(1);
// var swellPeriod7 = (weather.hours[12].swellPeriod[0].value).toFixed(1);
// var swellPeriod8 = (weather.hours[14].swellPeriod[0].value).toFixed(1);
// var swellPeriod9 = (weather.hours[16].swellPeriod[0].value).toFixed(1);
// var swellPeriod10 = (weather.hours[18].swellPeriod[0].value).toFixed(1);
// var swellPeriod11 = (weather.hours[20].swellPeriod[0].value).toFixed(1);
// var swellPeriod12 = (weather.hours[22].swellPeriod[0].value).toFixed(1);

// var wavePeriod1 = Math.round(weather.hours[0].wavePeriod[0].value);
// var wavePeriod2 = Math.round(weather.hours[2].wavePeriod[0].value);
// var wavePeriod3 = Math.round(weather.hours[4].wavePeriod[0].value);
// var wavePeriod4 = Math.round(weather.hours[6].wavePeriod[0].value);
// var wavePeriod5 = Math.round(weather.hours[8].wavePeriod[0].value);
// var wavePeriod6 = Math.round(weather.hours[10].wavePeriod[0].value);
// var wavePeriod7 = Math.round(weather.hours[12].wavePeriod[0].value);
// var wavePeriod8 = Math.round(weather.hours[14].wavePeriod[0].value);
// var wavePeriod9 = Math.round(weather.hours[16].wavePeriod[0].value);
// var wavePeriod10 = Math.round(weather.hours[18].wavePeriod[0].value);
// var wavePeriod11 = Math.round(weather.hours[20].wavePeriod[0].value);
// var wavePeriod12 = Math.round(weather.hours[22].wavePeriod[0].value);

// var swellDirection1 = (weather.hours[0].swellDirection[0].value).toFixed(1);
// var swellDirection2 = (weather.hours[4].swellDirection[0].value).toFixed(1);
// var swellDirection3 = (weather.hours[8].swellDirection[0].value).toFixed(1);
// var swellDirection4 = (weather.hours[12].swellDirection[0].value).toFixed(1);
// var swellDirection5 = (weather.hours[18].swellDirection[0].value).toFixed(1);
// var swellDirection6 = (weather.hours[22].swellDirection[0].value).toFixed(1);

// var windDirection1 = (weather.hours[0].windDirection[0].value).toFixed(1);
// var windDirection2 = (weather.hours[4].windDirection[0].value).toFixed(1);
// var windDirection3 = (weather.hours[8].windDirection[0].value).toFixed(1);
// var windDirection4 = (weather.hours[12].windDirection[0].value).toFixed(1);
// var windDirection5 = (weather.hours[18].windDirection[0].value).toFixed(1);
// var windDirection6 = (weather.hours[22].windDirection[0].value).toFixed(1);

// // var windDirection = (weather.hours[12].windDirection[0].value).toFixed(1);
// var windSpeed = Math.round(weather.hours[12].windSpeed[0].value);

//    outputthree += '<div>' +
//         '<ul>' +
//             '<li>Today is: '+timeNow+'</li>'+
//             '<li>Surf Spot: '+surfSpot.title+'</li>' +
//             '<br>' +
//             '<li>Air Temperature: '+airTemperature0+' &#8451 | Water Temperature: '+waterTemperature1+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature1+' &#8451 | Water Temperature: '+waterTemperature2+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature2+' &#8451 | Water Temperature: '+waterTemperature3+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature3+' &#8451 | Water Temperature: '+waterTemperature4+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature4+' &#8451 | Water Temperature: '+waterTemperature5+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature5+' &#8451 | Water Temperature: '+waterTemperature6+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature6+' &#8451 | Water Temperature: '+waterTemperature7+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature7+' &#8451 | Water Temperature: '+waterTemperature8+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature8+' &#8451 | Water Temperature: '+waterTemperature9+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature9+' &#8451 | Water Temperature: '+waterTemperature10+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature10+' &#8451 | Water Temperature: '+waterTemperature11+' &#8451</li>' +
//             '<li>Air Temperature: '+airTemperature11+' &#8451 | Water Temperature: '+waterTemperature12+' &#8451</li>' +
//             '<br>' +
//             '<li>Wave/Swell Height: '+waveHeight1+' / '+swellHeight1+'  m | Wave/Swell Period: '+wavePeriod1+' / '+swellPeriod1+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight2+' / '+swellHeight2+' m | Wave/Swell Period: '+wavePeriod2+' / '+swellPeriod2+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight3+' / '+swellHeight3+' m | Wave/Swell Period: '+wavePeriod3+' / '+swellPeriod3+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight4+' / '+swellHeight4+' m | Wave/Swell Period: '+wavePeriod4+' / '+swellPeriod4+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight5+' / '+swellHeight5+' m | Wave/Swell Period: '+wavePeriod5+' / '+swellPeriod5+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight6+' / '+swellHeight6+' m | Wave/Swell Period: '+wavePeriod6+' / '+swellPeriod6+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight7+' / '+swellHeight7+' m | Wave/Swell Period: '+wavePeriod7+' / '+swellPeriod7+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight8+' / '+swellHeight8+' m | Wave/Swell Period: '+wavePeriod8+' / '+swellPeriod8+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight9+' / '+swellHeight9+' m | Wave/Swell Period: '+wavePeriod9+' / '+swellPeriod9+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight10+' / '+swellHeight10+' m | Wave/Swell Period: '+wavePeriod10+' / '+swellPeriod10+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight11+' / '+swellHeight11+' m | Wave/Swell Period: '+wavePeriod11+' / '+swellPeriod11+' seconds</li>' +
//             '<li>Wave/Swell Height: '+waveHeight12+' / '+swellHeight12+' m | Wave/Swell Period: '+wavePeriod12+' / '+swellPeriod12+' seconds</li>' +
//             '<br>' +
//             '<li>Swell Direction: '+swellDirection1+' | Wave Direction: '+windDirection1+' </li>' +
//             '<li>Swell Direction: '+swellDirection2+' | Wave Direction: '+windDirection2+' </li>' +
//             '<li>Swell Direction: '+swellDirection3+' | Wave Direction: '+windDirection3+' </li>' +
//             '<li>Swell Direction: '+swellDirection4+' | Wave Direction: '+windDirection4+' </li>' +
//             '<li>Swell Direction: '+swellDirection5+' | Wave Direction: '+windDirection5+' </li>' +
//             '<li>Swell Direction: '+swellDirection6+' | Wave Direction: '+windDirection6+' </li>' +
//             '<br>' +
//             // '<li>Surf Spot pointing: '+surfSpot.point+'</li>' +
//             // '<li>Swell Direction from: '+direction(swellDirection)+'</li>' +
//             // '<li>Wind Direction from: '+direction(windDirection)+'</li>' +
//             '<li>Wind: '+range+' '+check()+'</li>' +
//             '<br>' +
//             '<li>Wind Speed: '+windSpeed+' m/second</li>' +
//         '</ul>'

//         document.getElementById('data05').innerHTML = outputthree;

// // OUTPUT 4 AVERAGES

// // average from Sunrise till 11:00 | 11:00 till 14:00 | 14:00 till Sunset

//         // var morning = [5,6,7,8,9,10];
//         // var midday = [11,12,13,14];
//         // var afternoon = [15,16,17,18,19,20];

//         var outputfour = '';

//         // this should be a function that when pass an argument it will throw a array with values for that
//         // particular argument so function morning(parameter) { do sth }

//         var morning = [weather.hours[5].airTemperature[0].value,
//                         weather.hours[6].airTemperature[0].value,
//                         weather.hours[7].airTemperature[0].value,
//                         weather.hours[8].airTemperature[0].value,
//                         weather.hours[9].airTemperature[0].value,
//                         weather.hours[10].airTemperature[0].value];

//         var midday = [weather.hours[11].airTemperature[0].value,
//                         weather.hours[12].airTemperature[0].value,
//                         weather.hours[13].airTemperature[0].value,
//                         weather.hours[14].airTemperature[0].value];

//         var afternoon = [weather.hours[15].airTemperature[0].value,
//                             weather.hours[16].airTemperature[0].value,
//                             weather.hours[17].airTemperature[0].value,
//                             weather.hours[18].airTemperature[0].value,
//                             weather.hours[19].airTemperature[0].value,
//                             weather.hours[20].airTemperature[0].value];

// // OPTION 1

// var waveHeight = 'waveHeight[0].value';
// var wavePeriod = 'wavePeriod[0].value';
// var windDirection = 'windDirection[0].value';
// var windSpeed = 'windSpeed[0].value';
// var airTemperature = '.airTemperature[0].value';
// var waterTemperature = '.waterTemperature[0].value';
// var parameters = [waveHeight, wavePeriod, windDirection, windSpeed, airTemperature, waterTemperature];

// var morning = [5, 6, 7, 8, 9, 10];
// var midday = [11,12,13,14];
// var afternoon = [15, 16, 17, 18, 19, 20];
// var dayTime = [];

// var timeType = function(time, type) {
// time.forEach(function(item) {
//     dayTime.push('weather.hours['+item+']');
// });
// var mapping = dayTime.map(function (num) {
//     return num+type;
// });

// //   for (var i = 0; i < mapping.length; i++) {
// //     mapping[i] = mapping[i].replace(/"/g,'');
// //   };

// return mapping
// }

// // console.log(timeType(midday, parameters[1]));

// // console.log(timeType(afternoon, parameters[0]));


// // Part 1 - This function give us the array of data for particular day

//                     // var morning = [5, 6, 7, 8, 9, 10];
//                     // var morningAv = [];

//                     // morning.forEach(function(item) {
//                     //   morningAv.push('weather.hour['+item+']'+parameters[0]);
//                     // });

//                     // console.log(morningAv);

//                     // var midday = [11,12,13,14];
//                     // var middayAv = [];

//                     // midday.forEach(function(item) {
//                     //   middayAv.push('weather.hour['+item+']'+parameters[1]);
//                     // });

//                     // console.log(middayAv);

//                     // var afternoon = [15, 16, 17, 18, 19, 20];
//                     // var afternoonAv = [];

//                     // afternoon.forEach(function(item) {
//                     //   afternoonAv.push('weather.hour['+item+']'+airTemperature);
//                     // });

//                     // console.log(afternoonAv);

// // Part 2 = the actual calculations

//         var morningSum = (timeType(morning, parameters[0])).reduce(function (accumulator, currentValue) {
//             return accumulator + currentValue;
//           }, 0);

//         var morningAv = Math.round(morningSum / (timeType(morning, parameters[0])).length);

//         // console.log(typeof(morningAv));
//         //   console.log(morningAv);

//         //   var middaySum = midday.reduce(function (accumulator, currentValue) {
//         //     return accumulator + currentValue;
//         //   }, 0);

//         // var middayAv = Math.round(middaySum / midday.length);

//         //   console.log(middayAv);

//         //   var afternoonSum = afternoon.reduce(function (accumulator, currentValue) {
//         //     return accumulator + currentValue;
//         //   }, 0);

//         // var afternoonAv = Math.round(afternoonSum / afternoon.length);

//         //   console.log(afternoonAv);

//                             // var airTemperature = '.airTemperature[0].value';
//                             // var waterTemperature = '.waterTemperature[0].value';

//                             // var morning = 'weather.hours[5]';
//                             // var morning = [5, 7, 8, 9, 10];

//                             // var dayTime = morning.forEach(function(element) {
//                             //     return weather.hours[element];
//                             //     });

//                             // console.log(dayTime);

//                             // function averageData(parameter, dayTime) {
//                             //     dayTime.forEach(function(item) {
//                             //         return dayTime+parameter;
//                             //     })
                                

//                             // };

//                             // console.log(averageData(waterTemperature, morning));

//         //   outputfour += '<div>' +
//         //     '<h1>Day Forecast</h1>' +
//         //     '<h2>Morning</h2>' +
//         //     '<h3>Wave</h3>' +
//         //     '<p>Height: '+timeType(morning, parameter[0])+'</p>' +
//         //     '<p>Period: '+timeType(morning, parameter[1])+'</p>' +
//         //     '<h2>Midday</h2>' +
//         //     '<h3>Wave</h3>' +
//         //     '<p>Height: '+timeType(midday, parameter[0])+'</p>' +
//         //     '<p>Period: '+timeType(midday, parameter[1])+'</p>' +
//         //     '<h2>Afternoon</h2>' +
//         //     '<h3>Wave</h3>' +
//         //     '<p>Height: '+timeType(afternoon, parameter[0])+'</p>' +
//         //     '<p>Period: '+timeType(afternoon, parameter[1])+'</p>'

//         //     console.log(timeType(afternoon, parameter[0]));

//         //   document.getElementById('data06').innerHTML = outputfour;


    } else if (this.readyState == 4 && this.status == 402) {
        document.getElementById('data02').innerHTML = 'Data request exceeded! Please come back tomorrow';
    }
};

xhr.onerror = function() {
    console.log('Request error: ');
};

// xhr.send();

// ****************************************************************** Marine Institute of Ireland data

var timeFrom = '2018-12-15T00%3A00%3A00Z';
var timeTo = '2018-12-16T00%3A00%3A00Z';
var stationId = '%22Dublin_Port%22';

var xhr = new XMLHttpRequest();

xhr.open('GET', `https://erddap.marine.ie/erddap/tabledap/IMI-TidePrediction.json?time%2CstationID%2CWater_Level_ODM&time%3E=${timeFrom}&time%3C=${timeTo}&stationID%3E=${stationId}`, true);

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        // console.log(data);
        // console.log(data.table.rows[0][2] + ' + ' + data.table.rows[10][2]);

        // D3.js DATA

        var tidePrediction = data.table.rows[0][2];
        // console.log(tidePrediction);

        var tidesTime = [];
        var tidesValue = [];
        var tidesTimeValue = {};

        var delta = 10;
        // console.log(data.table.rows.length);
        // console.log(delta);

        // for (i = 0; i < data.table.rows.length; i = i + delta) {
        //     tidesTime.push(data.table.rows[i][0]);
        // }

        for (i = 0; i < 240; i = i + delta) {
            tidesTime.push(data.table.rows[i][0]);
        }

        // for (i = 0; i < data.table.rows.length; i = i + delta) {
        //     tidesValue.push(data.table.rows[i][2]);
        // }

        for (i = 0; i < 240; i = i + delta) {
            tidesValue.push(data.table.rows[i][2]);
        }

        tidesTime.forEach(function (time, i) {
            return tidesTimeValue[time] = tidesValue[i];
        });

        // console.log(tidesTime[10]);

        // UTC time to Hour and Minutes

        var time = new Date(tidesTime[10]);
        var timeHM = time.getUTCHours() + ':' + time.getUTCMinutes();

        // console.log(timeHM);
       
        // console.log(tidesValue);

        // the tidesValue index reflect the time as well since the first element (i.e index 0) equal the midnight 00:00

        // console.log(tidesTimeValue);

        var dataApi = [];

        for (i = 0; i < 240; i = i + delta) {
            dataApi.push (
                {
                    // date: data.table.rows[i][0],
                    date: (new Date(data.table.rows[i][0])).getUTCHours(),
                    value: data.table.rows[i][2]
                });
        };

        // console.log(dataApi);


// LINE CHART


		/* implementation heavily influenced by http://bl.ocks.org/1166403 */
		
		// define dimensions of graph
		var m = [10, 10, 10, 10]; // margins
		var w = 350 - m[1] - m[3]; // width
		var h = 150 - m[0] - m[2]; // height
		
		// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
        // var data = [-3, -6, -2, 0, 5, 2, 0, -3, -8, -9, -2, 5, 9, 13];
        var data = tidesValue;

		// X scale will fit all values from data[] within pixels 0-w
		var x = d3.scaleLinear().domain([0, tidesValue.length]).range([0, w]);
		// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
		var y = d3.scaleLinear().domain([d3.min(tidesValue), d3.max(tidesValue)]).range([h, 0]);
			// automatically determining max range can work something like this
			// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

		// create a line function that can convert data[] into x and y points
		var line = d3.line()
			// assign the X function to plot our line as we wish
			.x(function(d,i) { 
				// verbose logging to show what's actually being done
				// console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
				// return the X coordinate where we want to plot this datapoint
				return x(i); 
			})
			.y(function(d) { 
				// verbose logging to show what's actually being done
				// console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
				// return the Y coordinate where we want to plot this datapoint
				return y(d); 
            })
            .curve(d3.curveBasis)

			// Add an SVG element with the desired dimensions and margin.
			var graph = d3.select("#data03").append("svg:svg")
			      .attr("width", w + m[1] + m[3])
			      .attr("height", h + m[0] + m[2])
			    .append("svg:g")
			      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			// create yAxis
			var xAxis = d3.axisBottom().scale(x).ticks(4).tickSize(-h);
			// Add the x-axis.
			graph.append("svg:g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + h + ")")
			      .call(xAxis);


			// // create left yAxis
			// var yAxisLeft = d3.axisLeft().scale(y);
			// // Add the y-axis to the left
			// graph.append("svg:g")
			//       .attr("class", "y axis")
			//       .attr("transform", "translate(-10,0)")
			//       .call(yAxisLeft);
			
  			// Add the line by appending an svg:path element with the data line we created above
			// do this AFTER the axes above so that the line is above the tick-lines
  			graph.append("svg:path").attr("d", line(data));

              graph.append("line")
              //   .attr("x1",-6)
                .attr("y1",y(0))//so that the line passes through the y 0
                .attr("x2",w)
                .attr("y2",y(0))//so that the line passes through the y 0
                .style("stroke", "black")
                .style("opacity", ".5");


// BAR CHART

        // var height = 400;
        // var width = 400;
        // var barRadius = 10;
/*
        You'll want two scales to construct a bar chart.
        You need one quantitative scale (typically a linear scale) to compute the bar positions along the x-axis,
        and a second ordinal scale to compute the bar positions along the y-axis.

        For the quantitative scale, you typically need to compute the domain of your data,
        which is based on the minimum and maximum value.
        An easy way to do that is via d3.extent:
*/

        // var y = d3.scaleLinear()
        //     .domain(d3.extent(tidesValue))
        //     .range([0, width]);

/*      You might also want to nice the scale to round the extent slightly.
        As another example, sometimes you want the zero-value to be centered in the middle of the canvas,
        in which case you'll want to take the greater of the minimum and maximum value:
*/

        // var y0 = Math.max(Math.abs(d3.min(tidesValue)), Math.abs(d3.max(tidesValue)));

        // var y = d3.scaleLinear()
        //     .domain([-y0, y0])
        //     .range([height, 0])
        //     .nice();


/*      For the y-axis, you'll want to use rangeRoundBands to divide the vertical space into bands for each bar.
        This also lets you specify the amount of padding between bars.
        Often an ordinal scale is used with some identifying data—such as a name or a unique id.
        However, you can also use ordinal scales in conjunction with the data's index:
*/

        // var x = d3.scaleBand()
        //     .domain(d3.range(tidesValue.length))
        //     .rangeRound([0, width])
        //     .padding(.2);

/*      Now that you've got your two scales, you can create the rect elements to display the bars.
        The one tricky part is that in SVG, rects are positioned (the x and y attributes) based on their top-left corner.
        So we need to use the x- and y-scales to compute the position of the top-left corner,
        and that depends on whether the associated value is positive or negative: if the value is positive,
        then the data value determines the right edge of the bar, while if it's negative,
        it determines the left edge of the bar. Hence the conditionals here:
*/

        // var svg = d3.select('#data03')
        //     .append('svg')
        //     .attr('height', height)
        //     .attr('width', width);

        // svg.selectAll('rect')
        //     .data(tidesValue)
        //     .enter()
        //     .append('rect')
        //     .attr('class', 'bar')
        //     .attr('y', function(d, i) { return y(Math.max(0, d)); })
        //     .attr('x', function(d, i) { return x(i); })
        //     .attr('height', function(d, i) { return Math.abs(y(d) - y(0)); })
        //     .attr('width', x.bandwidth())
        //    .attr('rx', barRadius);

/*

// LINE CHART NO.2

var margin = [20, 20, 30, 50]; // margins
var width = 600 - margin[1] - margin[3]; // width
var height = 400 - margin[0] - margin[2]; // height

// parse data from json
// var parseDate = d3.timeParse("%B %d, %Y");

var parseDate = d3.timeFormat("%I %p")

console.log(parseDate);

// set scales
// var x = d3.scaleTime()
//     .range([0, width]);

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

// create axes

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");
// REPLACED BY:

var xAxis = d3.axisBottom(x);

// var yAxis = d3.svg.axis()
//     .scale(u) 
//     .orient("left");
// REPLACED BY:

var yAxis = d3.axisLeft(y);

// construct line using points from data

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })
    .curve(d3.curveBasis);

var svg = d3.select("#data04")
    .append("svg")
    .attr("width", width + margin[3] + margin[1])
    .attr("height", height + margin[0] + margin[2])
    .append("g")
    .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

var data = dataApi;

// establish domain for x and y

x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain(d3.extent(data, function(d) { return d.value; }));

// append grouops

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", 6)
    .style("text-anchor", "end")
    .text("Tide Heights & Lows");

svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

*/

    } else if (this.readyState == 4 && this.status == 402) {
        document.getElementById('data03').innerHTML = 'Data request exceeded! Please come back tomorrow';
    }  
};



xhr.onerror = function() {
    console.log('Request error');
};

xhr.send();




//++++++++++++++++++++++++++++++++++++++++++++++++ OPENWEATHER API

openWeatherApiData = JSON.parse(localStorage.getItem('openWeatherApi'));

console.log(openWeatherApiData.weather[0].main);


var output = '';

// Unix time to local time conversion

        function unixToLocal(t) {
            var dt = new Date(t*1000);
            var hr = dt.getHours();
            var m = '0' + dt.getMinutes();
            return hr+ ':' +m.substr(-2); 
        }

        var sunrise = openWeatherApiData.sys.sunrise;
        var sunset = openWeatherApiData.sys.sunset;

        // console.log(unixToLocal(sunrise));
        // console.log(unixToLocal(sunset));
        // console.log(openWeather.weather[0].main);
        // console.log(openWeather.main.temp);
        // console.log(openWeather.wind.speed);
        // console.log(openWeather.weather[0].description);

        output += '<div>' +
            '<ul>' +
                '<li>Surf Spot: '+surfSpot.title+'</li>' +       
                '<br>' +
                '<li>Sunrise: '+unixToLocal(sunrise)+'</li>'+
                '<li>Sunset: '+unixToLocal(sunset)+'</li>' +
                '<br>' +
                '<li>Weather: '+openWeatherApiData.weather[0].main+'</li>' +
            '</ul>'

            document.getElementById('data01').innerHTML = output;

//++++++++++++++++++++++++++++++++++++++++++++++++ STORMGLASS API

stormglassAPIData = JSON.parse(localStorage.getItem('stormglassAPI'));

var weather = stormglassAPIData;

// DATA MANIPULATION

console.log(weather); // unspliced

var weatherSpliced = (weather.hours).splice(24);

// console.log(weather); // day data

var afternoon = (weather.hours).splice(-9, 6);

var midday = (weather.hours).splice(-7, 4);

var morning = (weather.hours).splice(-9, 6);

// console.log(morning);
// console.log(midday);
// console.log(afternoon);
// console.log(morning[0].time); // 2018-12-18T05:00:00+00:00

// Function that pass time arrays and spits out the average values for all of the weather parameters in form of a object:

function timeOfDay(time) {
    var totalWaveHeight = 0;
    var totalWavePeriod = 0;
    var totalWindDirection = 0;
    var totalWindSpeed = 0;
    var totalAirTemperature = 0;
    var totalWaterTemperature = 0;

    time.forEach(function(hour) {
        totalWaveHeight += hour.waveHeight[0].value;
        totalWavePeriod += hour.wavePeriod[0].value;
        totalWindDirection += hour.windDirection[0].value;
        totalWindSpeed += hour.windSpeed[0].value;
        totalAirTemperature += hour.airTemperature[0].value;
        totalWaterTemperature += hour.waterTemperature[0].value;
        });

    var average = new Object();
    average['waveHeight'] = Math.round(totalWaveHeight / time.length);
    average['wavePeriod'] = Math.round(totalWavePeriod / time.length);
    average['windDirection'] = Math.round(totalWindDirection / time.length);
    average['windSpeed'] = Math.round(totalWindSpeed / time.length);
    average['airTemperature'] = Math.round(totalAirTemperature / time.length);
    average['waterTemperature'] = Math.round(totalWaterTemperature / time.length);
    return average;
}

var morningAverage = timeOfDay(morning);
var middayAverage = timeOfDay(midday);
var afternoonAverage = timeOfDay(afternoon);

console.log(timeOfDay(midday));
console.log(timeOfDay(morning));
console.log(timeOfDay(afternoon));

console.log(morningAverage.windDirection);

// DATA

        var output = '';

// Data break down into types and values:

        // var time = weather.hours[12].time;
        // var airTemperature = Math.round(airTemperature);
        // var waterTemperature = Math.round(weather.hours[12].waterTemperature[0].value);
        // var waveHeight = (weather.hours[12].waveHeight[0].value).toFixed(1);
        // var wavePeriod = Math.round(weather.hours[12].wavePeriod[0].value);
        // var swellDirection = (weather.hours[12].swellDirection[0].value).toFixed(1);
        // var windDirection = (weather.hours[12].windDirection[0].value).toFixed(1);
        // var windSpeed = Math.round(weather.hours[12].windSpeed[0].value);

        var timeNow = new Date();

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];

        var monthAsString = monthNames[timeNow.getMonth()];

        console.log('Todays date: ' + timeNow.getFullYear() + '.' + monthAsString + '.' + timeNow.getDate());

// Display time for tidal & temperature information

        var timeHour = ('0' + timeNow.getHours()).slice(-2);
        var timeMinutes = timeNow.getMinutes();

// Function that return degrees that fall withing range of word directions:

        function direction(value) {
            if (value >= 0 && value < 22.5 || value >=337.5) {
                return 0;
            } else if (value >= 22.5 && value < 67.5) {
                return 45;
            } else if (value >= 67.5 && value < 112.5) {
                return 90;
            } else if (value >= 112.5 && value < 157.5) {
                return 135;
            } else if (value >= 157.5 && value < 202.5) {
                return 180;
            } else if (value >= 202.5 && value < 247.5) {
                    return 225;
            } else if (value >= 247.5 && value <292.5) {
                    return 270;
            } else if (value >= 292.5 && value <337.5) {
                    return 315;
            }
        };

// Wind types that usues the wind direction and surf spots pointing direction to determin tyoe of wind for location

    function windType(data) {

        var wind = direction(data);
        var point = surfSpot.point;

        // console.log('Wind & Surf Spot wind directions: ' + wind + ' ' + point);

        var range = [wind, point];

        // console.log('An Array of wind & point direction values: ' + range);
        
        function check() {
            if ((wind - point) === 0) {
              return 'Offshore';
            } else if (
              (range[0] === 0) && (range[1] === 180) ||
              (range[0] === 180) && (range[1] === 0) ||
              (range[0] === 90) && (range[1] === 270) ||
              (range[0] === 270) && (range[1] === 90) ||
              (range[0] === 45) && (range[1] === 225) ||
              (range[0] === 225) && (range[1] === 45) ||
              (range[0] === 135) && (range[1] === 315) ||
              (range[0] === 315) && (range[1] === 135)) {
              return 'Onshore';
            } else {
              return 'Crosswind';
            }
          }

        return check();
    };
        
        console.log('Type of wind result is: ' + windType(morningAverage.windDirection));
        console.log('Type of wind result is: ' + windType(middayAverage.windDirection));
        console.log('Type of wind result is: ' + windType(afternoonAverage.windDirection));

// OUTPUT 1 - As per API requested time

        // output += '<div>' +
        //     '<ul>' +
        //         '<li>Today is: '+timeNow+'</li>'+
        //         '<li>Surf Spot: '+surfSpot.title+'</li>' +
        //         '<br>' +
        //         '<li>Air Temperature: '+airTemperature+' &#8451</li>' +
        //         '<li>Water Temperature: '+waterTemperature+' &#8451</li>' +
        //         '<br>' +
        //         '<li>Wave Height: '+waveHeight+' m</li>' +
        //         '<li>Wave Period: '+wavePeriod+' seconds</li>' +
        //         '<br>' +
        //         '<li>Surf Spot pointing: '+surfSpot.point+'</li>' +
        //         '<li>Swell Direction from: '+direction(swellDirection)+'</li>' +
        //         '<li>Wind Direction from: '+direction(windDirection)+'</li>' +
        //         '<li>Wind Direction from: '+windDirection+'</li>' +
        //         '<li>Wind: '+range+' '+check()+'</li>' +
        //         '<br>' +
        //         '<li>Wind Speed: '+windSpeed+' m/second</li>' +
        //     '</ul>'

output += '<div>' +
    '<h1>Day Forecast</h1>' +
    '<h2>Surf Spot: '+surfSpot.title+' on '+timeNow.getDate()+' '+monthAsString+'</h2>' +
    '<br>' +
    '<h2>Morning</h2>' +
    '<p>Wave Height: '+morningAverage.waveHeight+' m | Wave Period: '+morningAverage.wavePeriod+' s</p>' +
    '<p>Wind Type: '+windType(morningAverage.windDirection)+' | Wind Speed: '+morningAverage.windSpeed+' m/s</p>' +
    '<p>Air Temperature: '+morningAverage.airTemperature+' &#8451 | Water Temperature: '+morningAverage.waterTemperature+' &#8451</p>' +
    '<h2>Midday</h2>' +
    '<p>Wave Height: '+middayAverage.waveHeight+' m | Wave Period: '+middayAverage.wavePeriod+' s</p>' +
    '<p>Wind Type: '+windType(middayAverage.windDirection)+' | Wind Speed: '+middayAverage.windSpeed+' m/s</p>' +
    '<p>Air Temperature: '+middayAverage.airTemperature+' &#8451 | Water Temperature: '+middayAverage.waterTemperature+' &#8451</p>' +
    '<h2>Afternoon</h2>' +
    '<p>Wave Height: '+afternoonAverage.waveHeight+' m | Wave Period: '+afternoonAverage.wavePeriod+' s</p>' +
    '<p>Wind Type: '+windType(afternoonAverage.windDirection)+' | Wind Speed: '+afternoonAverage.windSpeed+' m/s</p>' +
    '<p>Air Temperature: '+afternoonAverage.airTemperature+' &#8451 | Water Temperature: '+afternoonAverage.waterTemperature+' &#8451</p>'

    document.getElementById('data02').innerHTML = output;
