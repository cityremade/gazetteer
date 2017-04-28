var mapZoom = 3,
    map = L.map('map', {
        renderer: L.svg(),
        scrollWheelZoom: true,
        zoomControl: false,
        minZoom: 2,
        maxZoom: 17
    }).setView([51.50, -0.1], mapZoom);

map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

var btnZoomIn = document.getElementById('btnZoomIn'),
    btnZoomOut = document.getElementById('btnZoomOut');

function chkZoomBtn(){
    mapZoom < 17 ? btnZoomIn.disabled = false : btnZoomIn.disabled = true;
    mapZoom > 2 ? btnZoomOut.disabled = false : btnZoomOut.disabled = true;
}

btnZoomIn.addEventListener('click', function () {
    if (this.disabled) return;
    mapZoom++;
    map.setZoom(mapZoom);
    chkZoomBtn();
});

btnZoomOut.addEventListener('click', function(){
    if (this.disabled) return;
    mapZoom--;
    map.setZoom(mapZoom);
    chkZoomBtn();
});

map.on('moveend', function () {
    mapZoom = map.getZoom();
    chkZoomBtn();
});

map.on('zoomend', function () {
    mapZoom = map.getZoom();
    chkZoomBtn();
});

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

var inputGazetteer = $('#inputGazetteer');

inputGazetteer.keydown(function (e) {
    var key = e.keyCode || e.charCode;
    if (key == 13) {
        $.ajax({
            url: '/googleAddressQuery',
            dataType: 'json',
            data: {
                q: inputGazetteer.val()
            },
            success: function (data) {

                //createLatLonFeature([data.geometry.location.lng, data.geometry.location.lat]);
                console.log(data)
                drawAgasBox(data)

            }
        })
    }
});

function createLatLonFeature(lnglat){

    var f = {
        "geometry": {
            "type": "Point",
            "coordinates": lnglat
        },
        "properties": {},
        "type": "Feature"
    };

    var layerGaz = new L.geoJson(f, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng,
                {
                    icon: L.icon({
                        iconUrl: '/public/marker/marker.svg',
                        iconSize: [100,100]
                    }),
                    interactive: false
                }
            );
        }
    }).addTo(map);
    map.fitBounds(layerGaz.getBounds());

}

function drawAgasBox(data){
    sw_lat = data.geometry.bounds.southwest.lat;
    sw_lng = data.geometry.bounds.southwest.lng;
    
    sw = [sw_lat, sw_lng];
    
    ne_lat = data.geometry.bounds.northeast.lat;
    ne_lng = data.geometry.bounds.northeast.lng;
    
    ne = [ne_lat, ne_lng];
    
    bounds = [sw, ne];
    
    L.rectangle(bounds).addTo(map);
    map.fitBounds(bounds);
}