var Game = function(size) {
    this.players = [];
    this.map = new Map(size);
    this.wumpus = new Wumpus(this.map.randomTile());
    Info.log("The game is afoot");
};

Game.prototype.addPlayer = function(id) {
    this.players.push(new Player(id, this.map.randomTile(), this));
    Info.log("Welcome to the hunt, "+id);
    this.announcePlayerStatus(id);
    return true;
};

Game.prototype.removePlayer = function(id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id === id) {
            this.players.splice(i,1);
            Info.log(id+" has left the hunt");
            return true;
        }
    }
    return false;
};

Game.prototype.getPlayer = function(id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id === id) {
            return this.players[i];
        }
    }
    return false;
};


//Player controls listed below
//===============================================
Game.prototype.movePlayerForward = function(id) {
    if (this.getPlayer(id).status > 0) {
        var newTile = this.getPlayer(id).tile.getNeighbor(this.getPlayer(id).getDirection());
        if (newTile) {
            Info.log(id+" moved forward");
            this.getPlayer(id).tile = newTile;
        } else {
            Info.log("Bump! "+id+" hit a wall");
        }
        if (this.wumpus.getTile() == this.getPlayer(id).getTile()) {
            Info.log(id+" was eaten by the Wumpus!");
            this.getPlayer(id).status = 0;
        }
    }
    this.announcePlayerStatus(id);
};

Game.prototype.turnPlayerLeft = function(id) {
    if (this.getPlayer(id).status > 0) {
        this.getPlayer(id).direction--;
        if (this.getPlayer(id).direction < 0)
            this.getPlayer(id).direction = 3;
        Info.log(id+" turned left");
    }
    this.announcePlayerStatus(id);
};

Game.prototype.turnPlayerRight = function(id) {
    if (this.getPlayer(id).status > 0) {
        this.getPlayer(id).direction++;
        if (this.getPlayer(id).direction > 3)
            this.getPlayer(id).direction = 0;
        Info.log(id+" turned right");
    }
    this.announcePlayerStatus(id);
};

Game.prototype.playerShoot = function(id) {
    if (this.getPlayer(id).status > 0) {
        Info.log('not implemented');
    }
    this.announcePlayerStatus(id);
};

Game.prototype.announcePlayerStatus = function(id) {
    if (this.getPlayer(id).status > 0) {
        Info.log(id+" is facing "+this.getPlayer(id).getDirectionWord());
        //stench
        for (var i = 0; i < this.getPlayer(id).getTile().getNeighbors().length; i++) {
            if (this.getPlayer(id).getTile().getNeighbors()[i] == this.wumpus.getTile()) {
                Info.log(id+" smells the stench of the Wumpus");
            }
        }
    } else {
        Info.log(id+" is dead");
    }
};
