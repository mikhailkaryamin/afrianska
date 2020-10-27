ymaps.ready(init);

function init () {
  var myMap = new ymaps.Map('map', {
    center: [45.421099, -75.683988],
    zoom: 14
  }),

  myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
    hintContent: "Санди-Хилл"
  }, {
    preset: 'islands#darkGreenIcon',
  });

  myMap.geoObjects
  .add(myPlacemark)
}