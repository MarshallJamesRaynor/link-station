"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * Class use to calculate the suitable link station for a device at given point [x,y]
 * @class
 * @classdesc Class used to find the best link station for a device at given point in n-dimensional space
 */
var LinkPowerCalculator = /** @class */ (function () {
    /**
     * @constructor
     */
    function LinkPowerCalculator() {
        this.stations = [];
        this.devices = [];
        this.costumFormula = null;
    }
    /**
     * function use to set station
     * @function setStation
     * @throws {ValidationError}  If the dataset is not a array
     * @param {[]}  stations  array of values
     */
    LinkPowerCalculator.prototype.setStation = function (stations) {
        var _this = this;
        if (stations && Array.isArray(stations)) {
            stations.forEach(function (stationData, index) {
                _this.stations[index] = new Station(stationData);
            });
        }
        else {
            throw new ValidationError('the stations dataset must be an array');
        }
    };
    /**
     * function use to get station
     * @function getStation
     * @return {Station[]}  -  return all stations
     */
    LinkPowerCalculator.prototype.getStation = function () {
        return this.stations;
    };
    /**
     * function use to set device
     * @function setDevice
     * @throws {ValidationError}  If the dataset is not a array
     * @param {[]}  devices  array of values
     */
    LinkPowerCalculator.prototype.setDevice = function (devices) {
        var _this = this;
        if (devices && Array.isArray(devices)) {
            devices.forEach(function (deviceData, index) {
                _this.devices[index] = new Device(deviceData);
            });
        }
        else {
            throw new ValidationError('the devices dataset must be an array');
        }
    };
    /**
     * function use to get station
     * @function getDevice
     * @return {Device[]}  -  return all devices
     */
    LinkPowerCalculator.prototype.getDevice = function () {
        return this.devices;
    };
    /**
     * function use to set custom formula a link station
     * @function setCustomFormula
     * @throws {ValidationError}  If the input is not a function
     * @return {function}costumFormula  -  new formula
     */
    LinkPowerCalculator.prototype.setCustomFormula = function (costumFormula) {
        if (this.checkCostumFormula(costumFormula)) {
            this.costumFormula = costumFormula;
        }
        return true;
    };
    /**
     * function use to reset the formula
     * @function resetFormula
     * @return {boolean}  true value for the correct execution
     */
    LinkPowerCalculator.prototype.resetFormula = function () {
        this.costumFormula = null;
        return true;
    };
    /**
     * main function called for calculate the link station
     * @function bestLinkStation
     */
    LinkPowerCalculator.prototype.bestLinkStation = function () {
        var _this = this;
        if (this.stations.length == 0 || this.devices.length == 0) {
            console.log('dataset incomplete check device/station');
        }
        else {
            if (this.costumFormula === null) {
                this.devices.forEach(function (device) {
                    _this.defaultFormula(device);
                });
            }
            else {
                this.costumFormula(this);
            }
        }
    };
    /**
     * function used for calculate the link station
     * @function defaultFormula
     * @param {Device}  device   device object
     */
    LinkPowerCalculator.prototype.defaultFormula = function (device) {
        var stationDistance = this.calculateBestStationDistance(device);
        if (stationDistance == null || stationDistance.distance >= this.stations[stationDistance.id].reach) {
            console.log('No link station within reach for point');
        }
        else {
            var power = this.calculatePower(this.stations[stationDistance.id].reach, stationDistance.distance);
            console.log("Best link station for point (" + Object.values(device) + ") is " + "(" + Object.values(this.stations[stationDistance.id]) + ") with power =" + power);
        }
    };
    /**
     * function used for calculate the best distance for the selected device
     * @function defaultFormula
     * @param {Device}  device   device object
     * @return {object| null}
     */
    LinkPowerCalculator.prototype.calculateBestStationDistance = function (device) {
        var _this = this;
        var distance = [];
        var stationId;
        var euclideanDistance;
        this.stations.forEach(function (station, index) {
            if (station.reach !== 0) {
                distance[index] = _this.squaredEuclideanDistance(station, device);
            }
        });
        if (distance.length == 0) {
            return null;
        }
        else {
            stationId = this.stationWithLessDistance(distance);
            euclideanDistance = this.euclideanDistance(distance[stationId]);
        }
        return { 'id': stationId, 'distance': euclideanDistance };
    };
    /**
     * function used for calculate the best distance for the selected device
     * @function calculatePower
     * @param {number}  reach     value of station's reach
     * @param {number}  euclideanDistance   value of euclidean distance
     * @return {string}   A string representing the power number using fixed-point notation.
     */
    LinkPowerCalculator.prototype.calculatePower = function (reach, euclideanDistance) {
        var power = reach - euclideanDistance;
        return (power * power).toFixed(4);
    };
    /**
     * function used to find the station with the less distance
     * @function stationWithLessDistance
     * @param {[]}  distance     value of station's reach
     * @return {number}   station index
     */
    LinkPowerCalculator.prototype.stationWithLessDistance = function (distance) {
        var stationId = null;
        distance.forEach(function (value, index) {
            if (typeof value !== 'undefined') {
                if (stationId == null) {
                    stationId = index;
                }
                else if (value < distance[stationId]) {
                    stationId = index;
                }
            }
        });
        return stationId;
    };
    /**
     * function used to calculate the euclidean Distance
     * @function euclideanDistance
     * @param {[]}  squaredEuclideanDistance     squared euclidean distance
     * @return {number}   euclidean Distance
     */
    LinkPowerCalculator.prototype.euclideanDistance = function (squaredEuclideanDistance) {
        return Math.sqrt(squaredEuclideanDistance);
    };
    /**
     * function used to calculate the euclidean Distance
     * @function euclideanDistance
     * @param {Station}  station     station value
     * @param {Device}  device      device value
     * @return {number}   squared euclidean distance
     */
    LinkPowerCalculator.prototype.squaredEuclideanDistance = function (station, device) {
        // if the two dataset have a different dimension the sistem choose the minimum value
        var dimension = Math.min(station.dimension, device.dimension);
        var distance = 0;
        for (var coordinate = 0; coordinate < dimension; coordinate++) {
            var diff = station[coordinate] - device[coordinate];
            //  avoid Math.Pow() function call to decrease computing time and improve performance
            distance += (diff * diff);
        }
        return distance;
    };
    /**
     * function use to check if the callback function is a function
     * @function subscriptionFunction
     * @param {function} callback  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the function is not a function data type.
     */
    LinkPowerCalculator.prototype.checkCostumFormula = function (callback) {
        if (callback && typeof callback !== 'function') {
            throw new ValidationError("custom formula is not a function");
        }
        return true;
    };
    return LinkPowerCalculator;
}());
exports["default"] = LinkPowerCalculator;
/**
 * Class use to display a message error
 * @class
 * @classdesc Class use to validate the error that extends a Error class.
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.name = "Validation  Error";
        return _this;
    }
    return ValidationError;
}(Error));
/**
 * Class use save the point [x,y,z...ecc ]
 * @class
 * @classdesc Class use store points
 */
var DataSet = /** @class */ (function () {
    function DataSet() {
    }
    /**
     * function use to check if the input value is an array of number
     * @function checkInputIsArray
     * @param {[]} input  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the input is not an array of number.
     */
    DataSet.prototype.checkInputIsArray = function (input) {
        if (!Array.isArray(input)) {
            throw new ValidationError('the dataset must be an array');
        }
        var notNumber = input.filter(function (item) { return typeof item !== 'number'; });
        if (notNumber.length !== 0) {
            throw new ValidationError('the dataset data must be an array of number');
        }
        return true;
    };
    return DataSet;
}());
/**
 * Class use save the station
 * @class
 * @classdesc Class use store station's points
 * @implements DataSet
 */
var Station = /** @class */ (function (_super) {
    __extends(Station, _super);
    function Station(stationData) {
        var _this = _super.call(this) || this;
        if (_this.checkInputIsArray(stationData) && _this.checkIsStation(stationData)) {
            _this.dimension = stationData.length - 1;
            stationData.forEach(function (value, index) {
                if (_this.dimension == index) {
                    _this.reach = value;
                }
                else {
                    _this[index] = value;
                }
            });
        }
        _this.reachability();
        return _this;
    }
    /**
     * function use to check if the input value is an array of number
     * @function checkInputIsArray
     * @param {[]} input  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the input is not an array of number.
     */
    Station.prototype.checkIsStation = function (input) {
        if (input.length < 2) {
            throw new ValidationError('the array must contain at least level 2 values (coordinate,reach)');
        }
        return true;
    };
    /**
     * function use to verify the reachability of the station
     * @function reachability
     * @throws {ValidationError}  If the value of reach is zero
     */
    Station.prototype.reachability = function () {
        if (this.reach == 0) {
            throw new ValidationError('this station is not reachable because the value is = 0');
        }
    };
    return Station;
}(DataSet));
/**
 * Class use save the device
 * @class
 * @classdesc Class use store device's points
 * @implements DataSet
 */
var Device = /** @class */ (function (_super) {
    __extends(Device, _super);
    function Device(deviceData) {
        var _this = _super.call(this) || this;
        if (_this.checkInputIsArray(deviceData)) {
            _this.dimension = deviceData.length;
            deviceData.forEach(function (value, index) {
                _this[index] = value;
            });
        }
        return _this;
    }
    return Device;
}(DataSet));
