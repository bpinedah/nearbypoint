var expect      = require('chai').expect,
    nearbypoint = require('../index'),
    nearby      = nearbypoint.nearby;

describe('#nearby', function () {

  it('Gets the nearby point', function () {
    var request = {
      "url": "./test/inputs/from_prod_6807110.json", // or use "array" key to send an object with points array.
      "init": {
          "latitud": "20.567557",
          "longitud": "-100.413889"
      },
      "end": {
          "latitud": "20.568790",
          "longitud": "-100.411465"
      }
    }
    nearby(request, function(err, data) {
      if (err) throw err;
      assert.isNull(err, 'there was no error');
      expect(data).to.not.be.null;
    });
  });
})
