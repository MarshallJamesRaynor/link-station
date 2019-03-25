import  LinkPowerCalculator  from '../src/linkstation';


describe('link', () => {


    let spyFunction;
    var linkstations;

    function expectErrorThrownOnInvalidArgument(fn) {
        [
            [1],
            [[1]],
            [[1,'a']],
            {foo: 'bar',},
            true,
            false,
            spyFunction,
            1234567890,
            null,
            undefined,
        ].forEach((invalidEvent) => {
            expect(() => {
                fn(invalidEvent);
            }).toThrowError();
        });
    }

    function generateRandomArrayValue(numberOfValue,numberOfDimension){
        var spots = [];
        var limit = numberOfValue + 1;
        for (let i = 0; i < numberOfValue; i++) {
            var coordinate = [];
            for (let j = 0; j < numberOfDimension; j++) {
                coordinate.push(Math.floor(Math.random()*limit)+1);
            }
            spots.push(coordinate);
        }
        return spots;
    }
    beforeEach(function(){
        linkstations = new LinkPowerCalculator();
        spyOn(linkstations, 'setStation').and.callThrough();
        spyOn(linkstations, 'setDevice').and.callThrough();
        spyOn(linkstations, 'defaultFormula').and.callThrough();
    });
    describe('#power', () => {


        it('create random value with same dimension', () => {
            let station = generateRandomArrayValue(3,2);
            let device = generateRandomArrayValue(3,2);
            linkstations.setStation(station);
            linkstations.setDevice(device);
            linkstations.bestLinkStation();
            expect(linkstations.defaultFormula.calls.count()).toEqual(3);

        });
        it('create random value with different dimension', () => {
            let station = generateRandomArrayValue(3,6);
            let device = generateRandomArrayValue(6,2);
            linkstations.setStation(station);
            linkstations.setDevice(device);
            linkstations.bestLinkStation();
            expect(linkstations.defaultFormula.calls.count()).toEqual(6);

        });
        it('power with out input data', () => {
            linkstations.bestLinkStation();
            expect(linkstations.defaultFormula.calls.count()).toEqual(0);
        });


    });
    describe('#formula', () => {
        it('set not function formula', () => {
            let station = generateRandomArrayValue(3,2);
            let device = generateRandomArrayValue(3,2);
            linkstations.setStation(station);
            linkstations.setDevice(device);
            expect(() => {linkstations.setCustomFormula('pippo')}).toThrowError();
        });

    });
    describe('#station ', () => {
        it('should throw an error if a non-array data type is passed as the first argument', () => {
            expectErrorThrownOnInvalidArgument(linkstations.setStation);
        });
        it('should  check number of station collect', () => {
            let values = generateRandomArrayValue(3,5);
            linkstations.setStation(values);
            linkstations.setStation(values);
            expect(linkstations.getStation().length).toEqual(3);
        });

        it('check if reach is zero' ,() => {
            expect(() => {linkstations.setStation([[0, 0, 0]])   } ).toThrowError();
        });
    });

    describe('#device', () => {
        it('should throw an error if a non-array data type is passed as the first argument', () => {
            expectErrorThrownOnInvalidArgument(linkstations.setDevice);
        });

        it('should  check number of device collect', () => {
            let values = generateRandomArrayValue(3,5);
            linkstations.setDevice(values);
            linkstations.setDevice(values);
            expect(linkstations.getDevice().length).toEqual(3);
        });

    });

});