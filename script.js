var myMap;
var objectManager;

ymaps.ready(init);

function init () {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });

    objectManager = new ymaps.ObjectManager({
        clusterize: true,
        gridSize: 32,
        clusterDisableClickZoom: true
    });

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
    var feature = objectManager.objects.getById(id);
    if (feature) {
        if (feature.properties.status === "свободно") {
            feature.properties.status = "занято";
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    		objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
        } else {
            feature.properties.status = "свободно";
            objectManager.objects.options.set('preset', 'islands#redDotIcon');
    		objectManager.clusters.options.set('preset', 'islands#redClusterIcons');
        }
        objectManager.objects.balloon.open(id);
        objectManager.objects.balloon.setData(feature.properties);
		newStatus = feature.properties.status;
        
        objectManager.objects.setObjectOptions(id, feature);
        
        objectManager.objects.balloon.close();
        objectManager.objects.balloon.open(id);
        objectManager.objects.balloon.setData(feature.properties);

        $.ajax({
			url: "updateStatus.php",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				id: id,
				status: newStatus
			}),
			success: function(response) {
				console.log("Данные сохранены");
			},
			error: function(xhr, status, error) {
				console.error("Ошибка при сохранении данных");
			}
		});
    }
}