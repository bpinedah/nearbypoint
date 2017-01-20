# nearbypoint
Get the nearby point to one location (lat, lon) in a route

### Install
```
npm install nearbypoint
```
### Usage
```javascript
var nearbypoint = require('nearbypoint');

nearbypoint.nearby(json, function (err, data) {
  if (err) throw err;
  // Do stuffs with data.
});
```
### Example
```javascript
var nearbypoint = require('nearbypoint');

var request = {
  "url": "./inputs/from_prod_6807110.json", // or use "array" key to send an array inside json object instead
	"init": {
		"latitud": "20.567557",
		"longitud": "-100.413889"
	},
	"end": {
		"latitud": "20.568790",
		"longitud": "-100.411465"
	}
};

nearbypoint.nearby(request, function (err, data) {
  if (err) throw err;
  // Do stuffs with data.
});
```
### Response OK
```json
{
  "success": true,
  "message": {
    "nearby": {
      "pkubicacion": 67060862,
      "imei": "868585022636865",
      "latitud": "20.568817",
      "longitud": "-100.411487",
      "exactitud": "0",
      "bateria": "0",
      "estampa": "2017-01-18 20:47:50.498+00",
      "vel": "0",
      "edogps": 5,
      "dist": 0,
      "tiempo": 0,
      "distancia": 0,
      "estado": 0,
      "distance": 0,
      "movement": "D"
    },
    "index": 5443
  }
}
```
### Response error
```json
{
  "error": "Debe de existir al menos un objeto para leer."
}
```
