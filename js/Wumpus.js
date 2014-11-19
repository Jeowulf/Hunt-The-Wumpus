var Wumpus = function(tile) {
    this.tile = tile;
};

Wumpus.prototype.getTile = function() {
    return this.tile;
};

Wumpus.prototype.scare = function() {
    while(true) {
        var newLoc = this.tile.getRandomNeighbor();
        Info.log("The Wumpus is frightened!");
        return;
    }
};
