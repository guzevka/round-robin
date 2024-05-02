const http = require('http');

let currentServer = 0;
const ports = [8081, 8082, 8083];

function makeRequest(port) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ port: port, data: data });
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.end();
    });
}

async function fetchFromServers() {
    const results = [];
    for (const port of ports) {
        try {
            const result = await makeRequest(port);
            results.push(result);
        } catch (error) {
            console.error('Error fetching from port ' + port + ': ' + error.message);
        }
    }
    return results;
}

fetchFromServers()
    .then(results => {
        console.log('Fetch results:', results);
    })
    .catch(error => {
        console.error('Error fetching from servers:', error);
    });

function roundRobin() {
    const port = ports[currentServer];
    currentServer = (currentServer + 1) % ports.length;
    return port;
}

// Балансировщик нагрузки
http.createServer((req, res) => {
    const selectedPort = roundRobin();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Request is being handled by port: ' + selectedPort);
}).listen(8000, 'localhost');
console.log('Load balancer is running on: http://localhost:8000/');