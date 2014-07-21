// how many sums in a row must be equal
// before results are considered "stable"
var STABLE_CONSTANT_NUM = 30;

// how many sum averages in a row must be equal
// before results are considered "stable"
var STABLE_AVG_NUM = 50;

// how many runs stabilizer will process before giving up on checking for 'constant' stability
// and instead looking for a consistent moving average window
var MAX_CONSTANT_RUNS = 1000;

// max number of runs before assuming the graph will never stabilize
var MAX_RUNS = 2000;

// how many elements to take as a moving average window for checking stability
var AVG_WINDOW = 5;

function checkAverageWindow(results, index, avgWindow) {
  console.log('checkAverageWindow', index, avgWindow);
  var sum = 0;
  for (var i = index - avgWindow + 1; i <= index; i++) {
    if (i >= 0) {
      sum += results[i];
      console.log('   sum: ', sum);
    }
  }

  return sum/avgWindow;
}

module.exports = {
  init: function(opts){
    opts = opts || {};

    this.results = [];
    this.stable = false;
    this.stableConstantNum = opts.stableConstantNum || STABLE_CONSTANT_NUM;
    this.stableAvgNum = opts.stableAvgNum || STABLE_AVG_NUM;
    this.maxConstantRuns = opts.maxConstantRuns || MAX_CONSTANT_RUNS;
    this.maxRuns = opts.maxRuns || MAX_RUNS;
    this.avgWindow = opts.avgWindow || AVG_WINDOW;
  },

  render: function(grid){
    var sum = 0;

    grid.forEach(function(row){
      row.forEach(function(cell){
        sum += cell;
      });
    });

//    console.log(sum);
    this.results.push(sum);

    var stabilizedResult = this._isStabilized();
    if (stabilizedResult !== false) {
      this.stable = stabilizedResult;
    }
  },

  stop: function(){
    return this.stable;
  },

  getData: function(){
    return {
      stabilized: this.stable,
      runs: this.results.length,
      is_average: (this.results.length > this.maxConstantRuns),
      results: this.results
    }
  },

  _isStabilized: function(){
    if (this.results.length < this.maxConstantRuns) {
      return this._isConstantStabilized();
    } else if (this.results.length < this.maxRuns) {
      return this._isAvgStabilized();
    } else {
      return 'exceeded max run limit';
    }
  },

  _isConstantStabilized: function(){
    var startIndex = this.results.length - this.stableConstantNum;

    // we need at least 'stableNum' trials before we can consider results "stable"
    if (startIndex < 0) {
      return false;
    }

    var startNum = this.results[startIndex];

    for (var i = startIndex + 1; i < this.results.length; i++) {
      if (this.results[i] != startNum) {
        return false;
      }
    }

    // return the stabilized constant result
    return startNum;
  },

  _isAvgStabilized: function(){
    var startIndex = this.results.length - this.stableAvgNum;

    // we need at least 'stableNum' trials before we can consider results "stable"
    if (startIndex < 0) {
      return false;
    }

    var startAvg = checkAverageWindow(this.results, startIndex, this.avgWindow);
    console.log('   startAvg', startAvg);

    for (var i = startIndex + 1; i < this.results.length; i++) {
      var thisAvg = checkAverageWindow(this.results, i, this.avgWindow);
      console.log('thisAvg', thisAvg);
      if (thisAvg != startAvg) {
        return false;
      }
    }

    // return the stabilized average result
    return startAvg;
  }

}