/* Autores:
Bernardo Meneghini Muschioni
Victor Lio Rocha Campelo D'Ávila
Guilherme Tadeu Borges
*/

var net = require('net'); // Bliblioteca para socket TCP
var fs = require('fs'); // Bliblioteca para manipulação de Arquivos
var buffer = require('buffer'); // Bliblioteca para manipulação de buffers

var HOST = '127.0.0.1'; // Endereço do servidor
var PORT = 6969; // Número da porta

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {

        // Imprimi no console os dados da conexão
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Enviando uma resposta ao cliente dos dados recebidos
        sock.write('Voce enviou "' + data + '"');
        // Especificando o caminho para o novo arquivo
        var path = 'reciviedFile.txt';
        // Definindo o buffer como os dados recebidos da conexão
        buffer = new Buffer(data);
        // Abrindo o arquivo para escrita
        fs.open(path, 'w', function(err, fd) {
            if (err) {
                throw 'Erro ao abrir o arquivo: ' + err;
            }
            // Escrevendo no arquivo
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'Erro ao escrever no arquivo: ' + err;
            });
        });

    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

// //Useful Functions
// function checkBin(n){return/^[01]{1,64}$/.test(n)}
// function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
// function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
// function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
// function unpad(s){s=""+s;return s.replace(/^0+/,'')}

// //Decimal operations
// function Dec2Bin(n){if(!checkDec(n)||n<0)return 0;return n.toString(2)}
// function Dec2Hex(n){if(!checkDec(n)||n<0)return 0;return n.toString(16)}

// //Binary Operations
// function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
// function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

// //Hexadecimal Operations
// function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
// function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}