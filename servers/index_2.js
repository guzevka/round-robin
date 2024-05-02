const http = require('http')
const port = 8082;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("hello 8082")
})

server.listen(port, () => {
    console.log('server listening on: http://localhost:%s', port)
})