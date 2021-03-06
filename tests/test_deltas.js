var expect = require('expect.js'),
fs = require('fs'),
glimrBuild = require(__dirname + '/../glimr/glimr_build.js')();
var nitLogs = {};
nitLogs.content = fs.readFileSync(__dirname + "/data/nitlogs.txt").toString();
nitLogs.logObjects = glimrBuild.toLogObjectsArray(nitLogs.content);
nitLogs.deltaLogObjects = glimrBuild.deltas.addDeltaInfo(nitLogs.logObjects);

describe('Deltas', function(){

    it('should find delta ms between logs',function(){
        expect(nitLogs.deltaLogObjects[0].deltas.msSinceLast).to.equal(92000);
        var index = (nitLogs.deltaLogObjects.length-1);
        expect(nitLogs.deltaLogObjects[index].deltas.msSinceLast).to.equal(0);
    });

    it('should find the average ms delta between logs',function(){
        var average = 20331709945;
        expect(Math.round(1000*nitLogs.deltaLogObjects[0].deltas.rollingAverageMs)).to.equal(average);
    });

    it('should find the stDev ms delta between logs',function(){
        var expectedStDev = 117392641.38229;
        var actualStDev = nitLogs.deltaLogObjects[0].deltas.rollingStDevMs;
        var off = (actualStDev - expectedStDev);
        var percentOff = Math.abs(100 * (off/expectedStDev));
        if(percentOff > 0.3){
            console.log("Rolling stdev calc: ABS percentOff = %" + percentOff);
        }
        expect(percentOff < 0.3).to.equal(true);
    });
});