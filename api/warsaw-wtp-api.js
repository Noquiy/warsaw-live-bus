const axios = require('axios');

class ZtmVehicle {
    constructor(location, line, vehicleNumber, time, brigade, type) {
        this.location = location;
        this.line = line;
        this.vehicleNumber = vehicleNumber;
        this.time = time;
        this.brigade = brigade;
        this.type = type;
    }
}

class Location {
    constructor(longitude , latitude) {
        this.longitude  = longitude; 
        this.latitude = latitude;
    }
}

class ZtmSchedule {
    constructor(line, busStopId, busStopNr, rides) {
        this.line = line;
        this.busStopId = busStopId;
        this.busStopNr = busStopNr;
        this.rides = rides;
    }
}

class ZtmRide {
    constructor(brygada, kierunek, trasa, czas) {
      this.brygada = brygada;
      this.kierunek = kierunek;
      this.trasa = trasa;
      this.czas = czas;
    }
}

class ZtmSession {
    constructor(apikey = null) {
    this.apikey = apikey;
    this.locationEndpoint = 
        'https://api.um.warszawa.pl/api/action/busestrams_get/';
    this.scheduleEndpoint = 
        'https://api.um.warszawa.pl/api/action/dbtimetable_get';
    }

    __parseVehicleLocationData(record, vehicleType) {
        return new ZtmVehicle(
            new Location(parseFloat(record['Lon']), parseFloat(record['Lat'])),
            record['Lines'],
            record['VehicleNumber'],
            new Date(record['Time']),
            record['Brigade'],
            vehicleType
        )
    }

    __parseMultipleVehicleLocationData(records, vehicleType) {
        const vehicles = [];
        for (const record of records) {
            vehicles.push(
                this.__parseVehicleLocationData(record, vehicleType)
            );
        }
        return vehicles;
    }

    async __getDataFromZtm(url, queryParameters) {
        try {
            const response = await axios.get(url, {params: queryParameters });
            if (response.status === 200) {
                const responseData = response.data;
                if (responseData.error) {
                    throw new Error(responseData.error);
                }
                return responseData.result;
            } else {
                throw new Error(
                    `Error fetching data from ${url}, status: ${response.status}`
                );
            }
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async __getVehicleLocation(vehicleType, line = null) {
        const queryParameters = {
            resource_id: 'f2e5503e927d-4ad3-9500-4ab9e55deb59',
            type: vehicleType,
            apikey: this.apikey,
            line: line,
        };

        const response = await this.__getDataFromZtm(
            this.locationEndpoint,
            queryParameters
        );
        return this.__parseMultipleVehicleLocationData(response, vehicleType);
    }

    async getBusesLocation(line = null) {
        return this.__getVehicleLocation(1, line);
    }

    async getTramsLocation(line = null) {
        return this.__getVehicleLocation(2, line);
    }

    __parseScheduleData(schedule) {
        return new ZtmRide(
            parseInt(schedule['brygada']),
            schedule['kierunek'],
            schedule['trasa'],
            schedule['czas']
        );
    }

    __parseMultipleScheduleData(schedules) {
        const rides = [];
        for (const record of schedules) {
            const cleanRecord = this.__convertListToDict(record['values']);
            rides.push(this.__parseScheduleData(cleanRecord));
        }
        return rides;
    }

    async getBusStopScheduleById(busStopId, busStopNr, line) {
        const queryParameters = {
            id: 'e923fa0e-d96c-43f9-ae6e-60518c9f3238',
            apikey: this.apikey,
            busStopId: busStopId,
            busStopNr: busStopNr,
            line: line
        };
        const response = await this.__getDataFromZtm(
            this.scheduleEndpoint,
            queryParameters
        );
        const rides = this.__parseMultipleScheduleData(response);
        return new ZtmSchedule(line, parseInt(busStopId), busStopNr, rides);
    }

    async getBusStopScheduleByName(busStopName, busStopNr, line) {
        const queryParameters = {
            id: 'b27f4c17-5c50-4a5b-89dd-236b282bc499',
            apikey: this.apikey,
            name: busStopName
        };
        const response = await this.__getDataFromZtm(
            this.scheduleEndpoint,
            queryParameters
        );
        const cleanResponse = this.__convertListToDict(
            response[0]['values']
        );
        return this.getBusStopScheduleById(cleanResponse['zespol'], busStopNr, line);
    }

    __convertListToDict(inputList){
        const outputDict = {};
        for (const x of inputList) {
            outputDict[x['key']] = x['value'];
        }
        return outputDict;
    }
}

module.exports = {
    ZtmVehicle,
    Location,
    ZtmSchedule,
    ZtmRide,
    ZtmSession
}
