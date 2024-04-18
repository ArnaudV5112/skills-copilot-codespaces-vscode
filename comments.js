// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = "html/";
var comments = require('./comments');
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    fs.readFile(ROOT_DIR + urlObj.pathname, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});
server.listen(8080);
console.log("Server is running at http://localhost:8080/");
// Create a WebSocket server
var WebSocketServer = require('ws').Server;
var wsServer = new WebSocketServer({ server: server });
wsServer.on('connection', function (ws) {
    ws.on('message', function (message) {
        var msgObj = JSON.parse(message);
        if (msgObj.type === 'comment') {
            comments.addComment(msgObj.comment, function (err, comment) {
                if (err) {
                    ws.send(JSON.stringify({ error: err }));
                }
                else {
                    ws.send(JSON.stringify({ type: 'comment', comment: comment }));
                }
            });
        }
        else {
            ws.send(JSON.stringify({ error: 'Unknown message type' }));
        }
    });
});
console.log("WebSocket server is running at ws://localhost:8080");
// Path: comments.js
// Manage comments
var comments = [];
var addComment = function (comment, callback) {
    if (comment) {
        comments.push(comment);
        callback(null, comment);
    }
    else {
        callback("No comment provided");
    }
};
module.exports = {
    addComment: addComment
};
