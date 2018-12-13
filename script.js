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

console.log(surfSpots[19]);

// ****************************************************************** OpenWeatherMap API

var apiOpenWeather = '74ecf887ea2ee80ab6586f67dfe5ee24';

var xhr = new XMLHttpRequest();

xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${apiOpenWeather}`, true);

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var openWeather = JSON.parse(this.responseText);
        console.log(openWeather);

        var output = '';

        function unixToLocal(t) {
            var dt = new Date(t*1000);
            var hr = dt.getHours();
            var m = '0' + dt.getMinutes();
            return hr+ ':' +m.substr(-2); 
        }

        var sunrise = openWeather.sys.sunrise;
        var sunset = openWeather.sys.sunset;

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
                '<li>Weather: '+openWeather.weather[0].main+'</li>' +
            '</ul>'

            document.getElementById('data01').innerHTML = output;

    } else if (this.readyState == 4 && this.status == 402) {
        document.getElementById('data01').innerHTML = 'Data request exceeded! Please come back tomorrow';
    }  
};

xhr.onerror = function() {
    console.log('Request error');
};

xhr.send();

// ****************************************************************** Stormglass API

const params = 'airTemperature,waterTemperature,waveHeight,wavePeriod,swellDirection,windDirection,windSpeed';

var xhr = new XMLHttpRequest();
xhr.open('GET', `https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}`, true);

xhr.setRequestHeader('Authorization', 'b891271c-e610-11e8-83ef-0242ac130004-b891282a-e610-11e8-83ef-0242ac130004');

xhr.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
        var weather = JSON.parse(this.responseText);
        console.log(weather);

        // DATA

        var output = '';

        // getting an average values for data values with several sources
            // maybe stick to the first source i.e. SG as it is the most frequent and first in all data

        var total = 0;
        var length = 0;

        for (var v in weather.hours[12].airTemperature) {
            total += weather.hours[12].airTemperature[v].value;
            length++;
        };

        var averageAirTemp = total / length;

        console.log(averageAirTemp);

        var time = weather.hours[12].time;
        var airTemperature = Math.round(averageAirTemp);
        var waterTemperature = Math.round(weather.hours[12].waterTemperature[0].value);
        var waveHeight = (weather.hours[12].waveHeight[0].value).toFixed(1);
        var wavePeriod = Math.round(weather.hours[12].wavePeriod[0].value);
        var swellDirection = (weather.hours[12].swellDirection[0].value).toFixed(1);
        var windDirection = (weather.hours[12].windDirection[0].value).toFixed(1);
        var windSpeed = Math.round(weather.hours[12].windSpeed[0].value);

        var timeNow = new Date();

        console.log(timeNow.getFullYear() + '.' + timeNow.getMonth() + '.' + timeNow.getDate());

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
                '<li>Surf Spot: '+surfSpot.title+'</li>' +
                '<br>' +
                '<li>Date & Time of the Forecast: '+time+'</li>' +
                '<br>' +
                '<li>Air Temperature: '+airTemperature+' &#8451</li>' +
                '<li>Water Temperature: '+waterTemperature+' &#8451</li>' +
                '<br>' +
                '<li>Wave Height: '+waveHeight+' m</li>' +
                '<li>Wave Period: '+wavePeriod+' seconds</li>' +
                '<br>' +
                '<li>Surf Spot pointing: '+surfSpot.point+'</li>' +
                '<li>Swell Direction from: '+direction(swellDirection)+'</li>' +
                '<li>Wind Direction from: '+direction(windDirection)+'</li>' +
                '<br>' +
                '<li>Wind Speed: '+windSpeed+' m/second</li>' +
            '</ul>'

            document.getElementById('data02').innerHTML = output;


    } else if (this.readyState == 4 && this.status == 402) {
        document.getElementById('data02').innerHTML = 'Data request exceeded! Please come back tomorrow';
    }
};

xhr.onerror = function() {
    console.log('Request error: ');
};

xhr.send();

// ****************************************************************** Marine Institute of Ireland data

var timeFrom = '2018-12-10T00%3A00%3A00Z';
var timeTo = '2018-12-11T00%3A00%3A00Z';
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

        console.log(tidesTime[10]);

        // UTC time to Hour and Minutes

        var time = new Date(tidesTime[10]);
        var timeHM = time.getUTCHours() + ':' + time.getUTCMinutes();

        console.log(timeHM);
       
        console.log(tidesValue);

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

        console.log(dataApi);


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
