import  linkPowerCalculator  from '../src/linkstation';

let linkstations = new linkPowerCalculator();
linkstations.setStation([[0, 0, 10], [20, 20, 5], [10, 0, 12]]);
linkstations.setDevice([[0,0], [100, 100], [15,10],[18, 18]]);
linkstations.bestLinkStation();

