initMap();

async function initMap() {
    await ymaps3.ready;

    const { YMap, YMapDefaultSchemeLayer } = ymaps3;

    const map = new YMap(
        document.getElementById('map'),
        {
            location: {
                center: [135.1, 48.5],
                zoom: 12
            }
        }
    );

    map.addChild(new YMapDefaultSchemeLayer());

    fetch('ObjectRepository.php?action=getAllObjects')
        .then(response => response.json())
        .then(data => {
			console.log(data);
            data.forEach(object => {
                var color = (object.status === 'свободно') ? 'green' : 'red';
                var placemark = new ymaps.Placemark([object.latitude, object.longitude], {
                    iconColor: color,
                    balloonContent: 'Name: ' + object.name + '<br>Status: ' + object.status
                });

                map.geoObjects.add(placemark);
            });
        })
        .catch(error => console.error('Error:', error));
}