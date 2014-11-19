var Info = {
    storedLog: [],
    log: function(msg) {
        document.getElementById('status').innerHTML = msg+"<br>"+document.getElementById('status').innerHTML;
        this.storedLog.push(msg);
    },
    getLog: function() {
        return this.storedLog;
    }
};
