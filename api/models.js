class Location {
    constructor(longitude, latitude) {
      if (longitude >= -180 && longitude <= 180) {
        this.longitude = longitude;
      } else {
        throw new Error(`LongitudeOutsideBoundaryException: ${longitude}`);
      }
  
      if (latitude >= -90 && latitude <= 90) {
        this.latitude = latitude;
      } else {
        throw new Error(`LatitudeOutsideBoundaryException: ${latitude}`);
      }
    }
  }
  
  class ZtmVehicle {
    constructor(location, line, vehicleNumber, time, brigade, type) {
      this.location = location;
      this.line = line;
      this.vehicleNumber = vehicleNumber;
      this.time = time;
      this.brigade = brigade;
      this.type = type;
    }
  
    toString() {
      return `ZtmVehicle(line=${this.line}, type=${this.type}, lat=${this.location.latitude}, lon=${this.location.longitude})`;
    }
  
    isEqual(other) {
      if (!(other instanceof ZtmVehicle)) {
        throw new Error('NotImplementedError');
      }
      return JSON.stringify(this) === JSON.stringify(other);
    }
  }
  
  class ZtmRide {
    constructor(brigade, direction, route, time) {
      this.brigade = brigade;
      this.direction = direction;
      this.route = route;
      this.time = time;
    }
  }
  
  class ZtmSchedule {
    constructor(line, busStopId, busStopNr, rides) {
      this.line = line;
      this.busStopId = busStopId;
      this.busStopNr = busStopNr;
      this.rides = rides;
    }
  
    isEqual(other) {
      if (!(other instanceof ZtmSchedule)) {
        throw new Error('NotImplementedError');
      }
      return JSON.stringify(this) === JSON.stringify(other);
    }
  }
  