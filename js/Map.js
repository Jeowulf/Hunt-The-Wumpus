var Map = function(numberOfRooms) {
    this.rooms = [];
    this.rooms.push(new Tile(0));
    this.increaseRoomCount(numberOfRooms - 1);
    //this.generateDisplay();
}

Map.prototype.increaseRoomCount = function(size) {
    for (var i = 0; i < size; i++) {
        this.incrementRoomCount();
    }
};

Map.prototype.incrementRoomCount = function() {
    var newTile = new Tile(this.rooms.length);
    if (
        this.randomTileWeighted(0.75).addNeighbor(
            this.randomDirection(),
            newTile
        )
    ) {
        this.rooms.push(newTile);
    } else {
        this.incrementRoomCount();
    }
}

Map.prototype.randomTile = function() {
    return this.rooms[Math.floor(Math.random()*this.rooms.length)];
};

Map.prototype.randomTileWeighted = function(weight) {
    var currweight = 1.0;
    var totalweight = 0;
    var range = [];
    var i;
    for (i = 0; i < this.rooms.length; i++) {
        totalweight += currweight;
        currweight *= weight;
        range.push({room: this.rooms[i], top: totalweight})
    }
    var rand = Math.random() * totalweight;
    for (i = 0; i < range.length; i++) {
        if (rand < range[i].top) {
            return range[i].room;
        }
    }
};

Map.prototype.randomDirection = function() {
    return Math.floor(Math.random()*4.0);
};


Map.prototype.generateDisplay = function() {
    var nodes = [];
    var edges = [];
    for (var i = 0; i < this.rooms.length; i++) {
        nodes.push({
            id: this.rooms[i].id,
            label: "Node "+this.rooms[i].id
        });
        var neighbors = this.rooms[i].getNeighbors();
        for (var j = 0; j < neighbors.length; j++) {
            var f = this.rooms[i].id;
            var t = neighbors[j].tile.id;
            var l = "Dir: "+neighbors[j].direction;
            
            var doit = true;
            for (var z = 0; z < edges.length; z++) {
                if (edges[z].from == t && edges[z].to == f) {
                    doit = false
                }
            }
            if (!doit) {
                continue;
            }
            
            edges.push({
                from: f,
                to: t,
                label: l,
                style: 'arrow'
            });
        }
    }
    this.visjs(nodes, edges);
};

Map.prototype.visjs = function(nodes, edges) {
    var container = document.getElementById('graph');
    var data= {
        nodes: nodes,
        edges: edges,
    };
    var options = {
        width: '1000px',
        height: '800px'
    };
    var graph = new vis.Network(container, data, options);
};
