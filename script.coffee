# Description:
#   Hunt The Wumpus for Hubot
#
# Dependencies:
#   None
#
# Commands:
#   hunt start new
#   hunt join
#   hunt forward
#   hunt left
#   hunt right
#   hunt shoot
#
# Author:
#   smwa <michael.smith.ok@gmail.com>
 
module.exports = (robot) ->
  game = new Game 16
  Info.getLog()
  robot.respond /(hunt start new)/i, (msg) ->
    game = new Game 16
    msg.send Info.getLog()

  robot.respond /(hunt join)/i, (msg) ->
    game.addPlayer msg.message.user.name
    msg.send Info.getLog()
    msg.send "done"

  robot.respond /(hunt forward)/i, (msg) ->
    game.movePlayerForward msg.message.user.name
    msg.send Info.getLog()

  robot.respond /(hunt left)/i, (msg) ->
    game.turnPlayerLeft msg.message.user.name
    msg.send Info.getLog()

  robot.respond /(hunt right)/i, (msg) ->
    game.turnPlayerRight msg.message.user.name
    msg.send Info.getLog()

  robot.respond /(hunt shoot)/i, (msg) ->
    game.playerShoot msg.message.user.name
    msg.send Info.getLog()


#======================================
#======================================
#Class Definitions
#======================================
#======================================

#======================================
#Info Object
#======================================
Info =
  storedLog: ""
  log: (msg) ->
    @storedLog += "\n" + msg
    return

  getLog: ->
    t = @storedLog
    @storedLog = ""
    t

#======================================
#Game Object
#======================================
Game = (size) ->
  @players = []
  @map = new Map(size)
  @wumpus = new Wumpus(@map.randomTile())
  Info.log "The game is afoot"
  return

Game::addPlayer = (id) ->
  tmp = new Player(id, @map.randomTile())
  @players.push tmp
  Info.log "Welcome to the hunt, #{ id }"
  @announcePlayerStatus id

Game::removePlayer = (id) ->
  i = 0

  while i < @players.length
    if @players[i].id is id
      @players.splice i, 1
      Info.log id + " has left the hunt"
      return true
    i++
  false

Game::getPlayer = (id) ->
  i = 0

  while i < @players.length
    return @players[i]  if @players[i].id is id
    i++
  false


#Player controls listed below
#===============================================
Game::movePlayerForward = (id) ->
  if @getPlayer(id).status > 0
    newTile = @getPlayer(id).tile.getNeighbor(@getPlayer(id).getDirection())
    if newTile
      Info.log id + " moved forward"
      @getPlayer(id).tile = newTile
    else
      Info.log "Bump! " + id + " hit a wall"
    if @wumpus.getTile() is @getPlayer(id).getTile()
      Info.log id + " was eaten by the Wumpus!"
      @getPlayer(id).status = 0
  @announcePlayerStatus id
  return

Game::turnPlayerLeft = (id) ->
  if @getPlayer(id).status > 0
    @getPlayer(id).direction--
    @getPlayer(id).direction = 3  if @getPlayer(id).direction < 0
    Info.log id + " turned left"
  @announcePlayerStatus id
  return

Game::turnPlayerRight = (id) ->
  if @getPlayer(id).status > 0
    @getPlayer(id).direction++
    @getPlayer(id).direction = 0  if @getPlayer(id).direction > 3
    Info.log id + " turned right"
  @announcePlayerStatus id
  return

Game::playerShoot = (id) ->
  Info.log "not implemented"  if @getPlayer(id).status > 0
  @announcePlayerStatus id
  return

Game::announcePlayerStatus = (id) ->
  if @getPlayer(id).status > 0
    Info.log id + " is facing " + @getPlayer(id).getDirectionWord()
    
    #stench
    i = 0

    while i < @getPlayer(id).getTile().getNeighbors().length
      if @getPlayer(id).getTile().getNeighbors()[i] is @wumpus.getTile()
        Info.log id + " smells the stench of the Wumpus"
      i++
  else
    Info.log id + " is dead"
  return

#======================================
#Map Object
#======================================

Map = (numberOfRooms) ->
  @rooms = []
  @rooms.push new Tile(0)
  @increaseRoomCount numberOfRooms - 1
  return

Map::increaseRoomCount = (size) ->
  i = 0

  while i < size
    @incrementRoomCount()
    i++
  return

Map::incrementRoomCount = ->
  newTile = new Tile(@rooms.length)
  if @randomTileWeighted(0.75).addNeighbor(@randomDirection(), newTile)
    @rooms.push newTile
  else
    @incrementRoomCount()
  return

Map::randomTile = ->
  @rooms[Math.floor(Math.random() * @rooms.length)]

Map::randomTileWeighted = (weight) ->
  currweight = 1.0
  totalweight = 0
  range = []
  i = undefined
  i = 0
  while i < @rooms.length
    totalweight += currweight
    currweight *= weight
    range.push
      room: @rooms[i]
      top: totalweight

    i++
  rand = Math.random() * totalweight
  i = 0
  while i < range.length
    return range[i].room  if rand < range[i].top
    i++
  return

Map::randomDirection = ->
  Math.floor Math.random() * 4.0


#======================================
#Tile Object
#======================================
Tile = (id) ->
  @neighbors = []
  @id = id
  return

Tile::getNeighbor = (dir) ->
  i = 0

  while i < @neighbors.length
    return @neighbors[i].tile  if @neighbors[i].direction is dir
    i++
  false

Tile::getNeighbors = ->
  @neighbors

Tile::addNeighbor = (dir, tile) ->
  return false  if @getNeighbor(dir)
  @neighbors.push
    direction: dir
    tile: tile

  tile.neighbors.push
    direction: @getInverseDirection(dir)
    tile: this

  tile

Tile::getRandomNeighbor = ->
  return false  if @neighbors.length < 1
  @neighbors[Math.floor(Math.random() * @neighbors.length)].tile

Tile::getInverseDirection = (dir) ->
  return 2  if dir is 0
  return 3  if dir is 1
  return 0  if dir is 2
  1  if dir is 3

#======================================
#Player Object
#======================================
Player = (id, tile) ->
  @id = id
  @tile = tile
  @direction = 0
  @status = 1 #1 is alive, 0 is dead
  return

Player::getTile = ->
  @tile

Player::getDirection = ->
  @direction

Player::getDirectionWord = ->
  switch @getDirection()
    when 0
      "North"
    when 1
      "East"
    when 2
      "South"
    when 3
      "West"

#======================================
#Wumpus Object
#======================================
Wumpus = (tile) ->
  @tile = tile
  return

Wumpus::getTile = ->
  @tile

Wumpus::scare = ->
  @tile = @tile.getRandomNeighbor()
  Info.log "The Wumpus is frightened!"
  return
