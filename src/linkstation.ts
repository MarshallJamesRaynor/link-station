/**
 * Class use to calculate the suitable link station for a device at given point [x,y]
 * @class
 * @classdesc Class used to find the best link station for a device at given point in n-dimensional space
 */
export default class LinkPowerCalculator {

    /**
     * private variabile use to store the station
     * @private
     * @type {Object}
     */
     private stations: Station[];
    /**
     * private variabile use to store the device
     * @private
     * @type {Object}
     */
     private devices: Device[];
    /**
     * private variabile use to store the costum formula
     * @private
     * @type {function}
     */
     private costumFormula:any;

    /**
     * @constructor
     */
    constructor(){
        this.stations  = [];
        this.devices  = [];
        this.costumFormula = null;
    }

    /**
     * function use to set station
     * @function setStation
     * @throws {ValidationError}  If the dataset is not a array
     * @param {[]}  stations  array of values
     */
    setStation(stations:[]){
        if(stations && Array.isArray(stations)){
            stations.forEach((stationData, index)=>{
                this.stations[index] = new Station(stationData);
            });
        }else{
            throw new ValidationError('the stations dataset must be an array');
        }
    }

    /**
     * function use to get station
     * @function getStation
     * @return {Station[]}  -  return all stations
     */
    getStation(){
        return this.stations;
    }
    /**
     * function use to set device
     * @function setDevice
     * @throws {ValidationError}  If the dataset is not a array
     * @param {[]}  devices  array of values
     */
    setDevice(devices) {
        if (devices && Array.isArray(devices)) {
            devices.forEach((deviceData, index)=>{
                this.devices[index] = new Device(deviceData);
            });
        }else{
            throw new ValidationError('the devices dataset must be an array');
        }
    }
    /**
     * function use to get station
     * @function getDevice
     * @return {Device[]}  -  return all devices
     */
    getDevice(){
        return this.devices;
    }

    /**
     * function use to set custom formula a link station
     * @function setCustomFormula
     * @throws {ValidationError}  If the input is not a function
     * @return {function}costumFormula  -  new formula
     */
    setCustomFormula(costumFormula){
        if(this.checkCostumFormula(costumFormula)) {
            this.costumFormula = costumFormula;
        }
        return true;
    }
    /**
     * function use to reset the formula
     * @function resetFormula
     * @return {boolean}  true value for the correct execution
     */
    resetFormula(){
        this.costumFormula = null;
        return true;
    }

    /**
     * main function called for calculate the link station
     * @function bestLinkStation
     */
    bestLinkStation(){
        if(this.stations.length == 0 || this.devices.length == 0){
            console.log('dataset incomplete check device/station');
        }else{
            if(this.costumFormula===null) {
                this.devices.forEach((device) =>{
                    this.defaultFormula(device);
                });
            }else{
                this.costumFormula(this);
            }
        }
    }
    /**
     * function used for calculate the link station
     * @function defaultFormula
     * @param {Device}  device   device object
     */
    defaultFormula(device) {
        let stationDistance  = this.calculateBestStationDistance(device);
        if (stationDistance == null || stationDistance.distance >= this.stations[stationDistance.id].reach) {
            console.log('No link station within reach for point');
        } else {
            let power = this.calculatePower(this.stations[stationDistance.id].reach, stationDistance.distance );
            console.log("Best link station for point (" + (<any>Object).values(device) + ") is " + "(" + (<any>Object).values(this.stations[stationDistance.id]) + ") with power =" + power);
        }
    }
    /**
     * function used for calculate the best distance for the selected device
     * @function defaultFormula
     * @param {Device}  device   device object
     * @return {object| null}
     */
    calculateBestStationDistance(device){
        var distance = [];
        var stationId;
        var euclideanDistance;

        this.stations.forEach((station, index) => {
            if(station.reach !== 0) {
                distance[index] = this.squaredEuclideanDistance(station, device);
            }
        });
        if(distance.length == 0){
            return null;
        }else{
             stationId = this.stationWithLessDistance(distance);
             euclideanDistance = this.euclideanDistance(distance[stationId]);
        }
        return {'id':stationId,'distance':euclideanDistance};
    }


    /**
     * function used for calculate the best distance for the selected device
     * @function calculatePower
     * @param {number}  reach     value of station's reach
     * @param {number}  euclideanDistance   value of euclidean distance
     * @return {string}   A string representing the power number using fixed-point notation.
     */
    calculatePower(reach,euclideanDistance ){
        let power = reach - euclideanDistance;
        return (power*power).toFixed(4);
    }

    /**
     * function used to find the station with the less distance
     * @function stationWithLessDistance
     * @param {[]}  distance     value of station's reach
     * @return {number}   station index
     */
    stationWithLessDistance(distance) {
        var stationId = null;
        distance.forEach((value, index) => {
            if(typeof value !== 'undefined' ){
                if(stationId == null ){
                    stationId = index;
                }else if (value < distance[stationId]  ) {
                    stationId = index;
                }
            }

        });
        return stationId;
    }
    /**
     * function used to calculate the euclidean Distance
     * @function euclideanDistance
     * @param {[]}  squaredEuclideanDistance     squared euclidean distance
     * @return {number}   euclidean Distance
     */
    euclideanDistance(squaredEuclideanDistance){
        return Math.sqrt(squaredEuclideanDistance);
    }

    /**
     * function used to calculate the euclidean Distance
     * @function euclideanDistance
     * @param {Station}  station     station value
     * @param {Device}  device      device value
     * @return {number}   squared euclidean distance
     */
    squaredEuclideanDistance(station:Station,device:Device){
        // if the two dataset have a different dimension the sistem choose the minimum value
        let dimension = Math.min(station.dimension, device.dimension);
        var distance = 0;
        for (let coordinate = 0; coordinate < dimension; coordinate++) {
            let diff = station[coordinate] - device[coordinate];
            //  avoid Math.Pow() function call to decrease computing time and improve performance
            distance += (diff * diff);
        }
        return distance;
    }

    /**
     * function use to check if the callback function is a function
     * @function subscriptionFunction
     * @param {function} callback  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the function is not a function data type.
     */
    checkCostumFormula(callback?:any) {
        if (callback && typeof callback !== 'function'){
            throw new ValidationError("custom formula is not a function");
        }
        return true;
    }

}

/**
 * Class use to display a message error
 * @class
 * @classdesc Class use to validate the error that extends a Error class.
 */
class ValidationError extends Error {
    name:string;
    constructor(public message: string) {
        super(message);
        this.name = "Validation  Error";
    }
}

/**
 * Class use save the point [x,y,z...ecc ]
 * @class
 * @classdesc Class use store points
 */
class DataSet{
    /**
     * value use to store the dimension of a mathematical space
     * @type {number}
     */
    dimension:number;

    /**
     * function use to check if the input value is an array of number
     * @function checkInputIsArray
     * @param {[]} input  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the input is not an array of number.
     */
    checkInputIsArray(input){
        if(!Array.isArray(input)) {
            throw new ValidationError('the dataset must be an array');
        }
        let notNumber = input.filter(item => typeof item !== 'number');
        if(notNumber.length!==0){
            throw new ValidationError('the dataset data must be an array of number');
        }
        return true;
    }

}

/**
 * Class use save the station
 * @class
 * @classdesc Class use store station's points
 * @implements DataSet
 */
class Station extends DataSet{
    /**
     * value of the station's reach
     * @type {number}
     */
    reach:number;

    constructor(stationData :[]){
        super();
        if(this.checkInputIsArray(stationData)&&this.checkIsStation(stationData)){
            this.dimension = stationData.length-1;
            stationData.forEach((value, index) => {
                    if(this.dimension == index ){
                        this.reach = value;
                    }else{
                        this[index] = value;
                    }
              });
        }
        this.reachability();
    }

    /**
     * function use to check if the input value is an array of number
     * @function checkInputIsArray
     * @param {[]} input  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the input is not an array of number.
     */
    checkIsStation(input){
        if(input.length<2) {
            throw new ValidationError('the array must contain at least level 2 values (coordinate,reach)');
        }
        return true;
    }
    /**
     * function use to verify the reachability of the station
     * @function reachability
     * @throws {ValidationError}  If the value of reach is zero
     */
    reachability(){
        if(this.reach == 0){
            throw new ValidationError('this station is not reachable because the value is = 0');
        }
    }
}

/**
 * Class use save the device
 * @class
 * @classdesc Class use store device's points
 * @implements DataSet
 */
class Device extends  DataSet{
    constructor(deviceData :[]){
        super();
        if(this.checkInputIsArray(deviceData)){
            this.dimension = deviceData.length;
            deviceData.forEach((value, index) => {
                this[index] = value;
            });
        }
    }
}

