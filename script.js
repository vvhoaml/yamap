var myMap;

ymaps.ready(init);

function init () {
    myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    objectManager.objects.options.set('preset', 'islands#redDotIcon');
    objectManager.clusters.options.set('preset', 'islands#redClusterIcons');
    myMap.geoObjects.add(objectManager);
	myMap.controls.remove('searchControl');
	myMap.controls.remove('trafficControl');
	myMap.controls.remove('fullscreenControl');

    $.ajax({
        url: "objects.json"
    }).done(function(data) {
        objectManager.add(data);
    });

}

function changeStatus(id) {
    var currentStatus = document.getElementById('status_' + id).innerText.trim();

    var newState = currentStatus === 'свободно' ? 'занято' : 'свободно';
    
    $.ajax({
        type: 'POST',
        url: 'updateStatus.php',
        data: {
            id: id,
            newState: newState
        },
        success: function(response) {
            if (response.success) {
                document.getElementById('status_' + id).innerText = newState;

                var feature = myMap.geoObjects.getById(id);
                feature.properties.set('status', newState);

                var newFeature = new ymaps.GeoObject(feature.geometry, {
                    properties: feature.properties,
                    options: feature.options
                });

                myMap.geoObjects.remove(feature);
                myMap.geoObjects.add(newFeature);
            }
        },
    });
}