var Player = function(id, tile, gameObject) {
    this.game = parent;
    this.id = id;
    this.tile = tile;
    this.direction = 0;
    this.status = 1; //1 is alive, 0 is dead
};

Player.prototype.getTile = function() {
    return this.tile;
};

Player.prototype.getDirection = function() {
    return this.direction;
};

Player.prototype.getDirectionWord = function() {
    switch(this.getDirection()) {
        case 0: return "North";
        case 1: return "East";
        case 2: return "South";
        case 3: return "West";
    }
    return "";
};