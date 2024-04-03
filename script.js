var myMap;

ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ["geolocationControl", "zoomControl", "typeSelector"]
        }, {
            searchControlProvider: 'yandex#search'
        });

    objectManager = new ymaps.ObjectManager({
        clusterize: true,
        gridSize: 64,
        clusterIconLayout: "default#pieChart"
    });

    myMap.geoObjects.add(objectManager);

    var listBoxItems = ['Свободно', 'Занято'].map(function (title) {
        return new ymaps.control.ListBoxItem({
            data: {
                content: title
            },
            state: {
                selected: true
            }
        });
    });

    var listBoxControl = new ymaps.control.ListBox({
        data: {
            content: 'Фильтр',
            title: 'Фильтр'
        },
        items: listBoxItems,
        state: {
            expanded: true,
            filters: listBoxItems.reduce(function (filters, filter) {
                filters[filter.data.get('content')] = filter.isSelected();
                return filters;
            }, {})
        }
    });

    myMap.controls.add(listBoxControl);

    listBoxControl.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl.state.set('filters', filters);
    });

    var filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', function (filters) {
        objectManager.setFilter(getFilterFunction(filters));
    });

    function getFilterFunction(categories) {
        return function (obj) {
            var content = obj.properties.balloonContentHeader;
            return categories[content];
        };
    }

    $.ajax({
		url: "objects.json"
	}).done(function (data) {
		objectManager.add(data);
	});
}

function changeStatus(id) {
    var object = objectManager.objects.getById(id);
    var newStatus;
	var newColor;

	if (object.properties.balloonContentHeader === "Занято") {
		newStatus = "Свободно";
	} else {
		newStatus = "Занято";
	}
	
	if (newStatus === "Занято") {
		newColor = "islands#redCircleDotIconWithCaption";
	} else {
		newColor = "islands#greenCircleDotIconWithCaption";
	}

    objectManager.objects.setObjectProperties(id, { 
        balloonContentHeader: newStatus,
        clusterCaption: newStatus,
        iconCaption: newStatus
    });
	objectManager.objects.setObjectOptions(id, {preset: newColor});
	myMap.balloon.close();

    $.ajax({
        url: "updateStatus.php", 
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            id: id,
            status: newStatus
        })
    });
}