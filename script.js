function initMap() {
    var myPos = {
        lat: 53.3459084,
        lng: -6.280918
    };

    var map = new google.maps.Map(document.getElementById("map"), {
        center: myPos,
        zoom: 15
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

