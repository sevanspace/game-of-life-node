var _ = require('lodash');

module.exports = {
	createGame: function(initialGrid, renderer){
		return new Game(initialGrid, renderer);
	}
}

// takes an array of arrays of 0's and 1's
// and a renderer to output a representation or data
function Game(grid, renderer){
	this.grid = grid;

	renderer.init = renderer.init || function(){};
	renderer.render = renderer.render || function(){};
	renderer.stop = renderer.stop || function(){return false;};
	renderer.getData = renderer.getData || function(){};

	renderer.init();

	renderer.render(grid);
	
	this.cycle = function(){
		var dying = [], born = []
		grid.forEach(function(row, rowIndex) {
			row.forEach(function(cell, cellIndex) {
				var neighbors = getNeighbors(rowIndex, cellIndex)
				var sum = neighbors.reduce(function(sum,coord){
					return getCell(coord) + sum
				}, 0)
				if (sum < 2 || sum > 3) {
					dying.push([rowIndex,cellIndex])
				} else if(sum == 3 && cell ==0){
					born.push([rowIndex, cellIndex])
				}

			});
		});
		dying.forEach(function(coord) {
			grid[coord[0]][coord[1]] = 0;
		})
		born.forEach(function(coord){
			grid[coord[0]][coord[1]] = 1
		})
		renderer.render(grid);
	}

	this.stop = function() {
		return renderer.stop();
	}

	this.data = function() {
		return renderer.getData();
	}

	function getCell(coord){
		var cell
		if (grid[coord[0]]) {
			cell = grid[coord[0]][coord[1]];
		}
		return cell ? cell : 0
	}

	function getNeighbors(rowIndex, cellIndex) {
		return [
				[rowIndex-1,cellIndex-1], 
				[rowIndex-1,cellIndex], 
				[rowIndex-1,cellIndex+1],
				[rowIndex,cellIndex-1], 
				[rowIndex, cellIndex+1],
				[rowIndex+1, cellIndex-1],
				[rowIndex+1, cellIndex],
				[rowIndex+1, cellIndex+1],
		   ]
	}
}