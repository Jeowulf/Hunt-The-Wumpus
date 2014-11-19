var game = new Game(16);
var username = '';
var sep = "==================================================";
$('#startGame').on("click",function(){
    username = $("#playerName").val();
    game.addPlayer(username);
    $("#hideOnStart").hide();
});

$('#forward').on("click",function(){
    Info.log(sep);
    game.movePlayerForward(username);
});

$('#left').on("click",function(){
    Info.log(sep);
    game.turnPlayerLeft(username);
});

$('#right').on("click",function(){
    Info.log(sep);
    game.turnPlayerRight(username);
});

$('#shoot').on("click",function(){
    Info.log(sep);
    game.playerShoot(username);
});
