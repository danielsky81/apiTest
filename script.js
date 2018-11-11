function initMap() {
    var myPos = {
        lat: 53.3459084,
        lng: -6.280918
    };

    var styles = [
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
                {color: '#45C48B'},
                {visibility: 'on'}
            ]
        },{
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
                {color: '#323741'},
                {visibility: 'on'}
            ]
        },{
            featureType: 'poi',
            elementType: 'labels.text.stroke',
            stylers: [
                {visibility: 'off'}
            ]
        },{
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [
                {color: '#323741'},
                {lightness: '50'},
                {visibility: 'on'}
            ]
        },{
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [
                {color: '#FFD039'},
                {visibility: 'on'}
            ]
        },{
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
                {color: '#09C9D4'},
                {lightness: '70'},
                {visibility: 'on'}
            ]
        },{
            featureType: 'poi.medical',
            elementType: 'geometry',
            stylers: [
                {color: '#EB3E4A'},
                {visibility: 'on'}
            ]
        },{
            featureType: 'poi.school',
            elementType: 'geometry',
            stylers: [
                {color: '#09C9D4'},
                {visibility: 'on'}
            ]
        },{
            featureType: 'poi.sports_complex',
            elementType: 'geometry',
            stylers: [
                {color: '#09C9D4'},
                {visibility: 'on'}
            ]
        }
    ]

    var map = new google.maps.Map(document.getElementById("map"), {
        center: myPos,
        zoom: 15,
        styles: styles,
        mapTypeControl: false
    });

    var marker = new google.maps.Marker({
        position: myPos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: "Yo!"
    });

    var contentString = ('<div id="infoWindow">' + marker.title + '</div>');

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });



}

