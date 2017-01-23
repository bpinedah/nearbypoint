var fs    = require('fs'),
    _     = require('underscore'),
    async = require('async');

module.exports = {
  nearby: function (request, cb) {
    try {
      var obj;
      if (request.url != undefined) {
        fs.readFile(request.url, 'utf8', function (err, data) {
          if (err) return cb(err);
          obj = JSON.parse(data);
          let routes  = obj.rows;
          let init    = request.init;
          let end     = request.end;

          async.eachSeries(routes, function (point, callback) {
            getDistanceKmPromise(point, end, 2)
            .then(function (distance) {
              point.distance = distance;
              var index = routes.indexOf(point);
              var odd_index = (index > 0) ? index - 1 : 0;
              var odd = (index > 0) ? routes[index - 1] : routes[0];
              var cur = point;

              if (odd_index != index) {
                if (odd.distance < cur.distance) {
                  point.movement = "I";
                } else if (odd.distance > cur.distance) {
                  point.movement = "D";
                }
              }
              callback();
            })
            .catch(function (error) {
              callback()
            });
          }, function (error) {
            if (error) return res.status(500).jsonp({ success: false, message: error });
            var increment = _.filter(routes, function (route) {
              return route.movement == "I";
            });
            var decrement = _.filter(routes, function (route) {
              return route.movement == "D";
            });
            var i_max = _.max(increment, function (number) { return number.distance });
            var d_min = _.min(decrement, function (number) { return number.distance });
            var index_r = routes.indexOf(d_min);
            cb(null, { nearby: d_min, index: index_r });
          });
        });
      } else if (request.array != undefined) {
        if (request.array.length > 0) {
          var data = {rows: request.array};
          obj = data;
          let routes  = obj.rows;
          let init    = request.init;
          let end     = request.end;

          async.eachSeries(routes, function (point, callback) {
            getDistanceKmPromise(point, end, 2)
            .then(function (distance) {
              console.log(distance);
              point.distance = distance;
              var index = routes.indexOf(point);
              var odd_index = (index > 0) ? index - 1 : 0;
              var odd = (index > 0) ? routes[index - 1] : routes[0];
              var cur = point;

              if (odd_index != index) {
                if (odd.distance < cur.distance) {
                  point.movement = "I";
                } else if (odd.distance > cur.distance) {
                  point.movement = "D";
                }
              }
              callback();
            })
            .catch(function (error) {
              callback()
            })
          }, function (error) {
            if (error) return res.status(500).jsonp({ success: false, message: error });
            var increment = _.filter(routes, function (route) {
              return route.movement == "I";
            });
            var decrement = _.filter(routes, function (route) {
              return route.movement == "D";
            });
            var i_max = _.max(increment, function (number) { return number.distance });
            var d_min = _.min(decrement, function (number) { return number.distance });
            var index_r = routes.indexOf(d_min);
            cb(null, { nearby: d_min, index: index_r });
          });
        }
      } else {
        cb({ error: "Debe de existir al menos un objeto para leer."});
      }
    } catch (e) {
      cb(e);
    }
  }
}

function getDistanceKm (start, end, decimals) {
  try {
    decimals = decimals || 2;
    let earthRadius = 6371; // km
    let lat1 = parseFloat(start.latitud);
    let lat2 = parseFloat(end.latitud);
    let lon1 = parseFloat(start.longitud);
    let lon2 = parseFloat(end.longitud);

    let dLat = (lat2 - lat1).toRad();
    let dLon = (lon2 - lon1).toRad();
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = earthRadius * c;
    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
  } catch (e) {
    return e;
  }
}
function getDistanceKmPromise (start, end, decimals) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        }
      }
      decimals = decimals || 2;
      let earthRadius = 6371; // km
      let lat1 = parseFloat(start.latitud);
      let lat2 = parseFloat(end.latitud);
      let lon1 = parseFloat(start.longitud);
      let lon2 = parseFloat(end.longitud);
      let dLat = (lat2 - lat1).toRad();
      let dLon = (lon2 - lon1).toRad();
      lat1 = lat1.toRad();
      lat2 = lat2.toRad();
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = earthRadius * c;
      resolve(Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals));
    } catch (e) {
      reject(e);
    }
  });
}
