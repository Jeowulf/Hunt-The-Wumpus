var Tile = function(id) {
    this.neighbors = [];
    this.id = id
};

Tile.prototype.getNeighbor = function(dir) {
    for (var i = 0; i < this.neighbors.length; i++) {
        if (this.neighbors[i].direction === dir) {
            return this.neighbors[i].tile;
        }
    }
    return false;
};

Tile.prototype.getNeighbors = function() {
    return this.neighbors;
};

Tile.prototype.addNeighbor = function(dir, tile) {
    if (this.getNeighbor(dir)) {
        return false;
    }
    this.neighbors.push(
        {
            direction: dir,
            tile: tile
        }
    );
    tile.neighbors.push(
        {
            direction: this.getInverseDirection(dir),
            tile: this
        }
    );
    return tile;
};

Tile.prototype.getRandomNeighbor = function() {
    if (this.neighbors.length < 1) return false;
    return this.neighbors[
        Math.floor(
            Math.random()*this.neighbors.length
        )
    ].tile;
};

Tile.prototype.getInverseDirection = function(dir) {
    if (dir == 0) return 2;
    if (dir == 1) return 3;
    if (dir == 2) return 0;
    if (dir == 3) return 1;
};