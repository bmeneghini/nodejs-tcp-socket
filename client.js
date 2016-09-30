/* Autores:
Bernardo Meneghini Muschioni
Victor Lio Rocha Campelo D'Ávila
Guilherme Tadeu Borges
*/

var net = require('net'); // Bliblioteca para socket TCP
var fs = require('fs'); // Bliblioteca para manipulação de Arquivos
var getmac = require('getmac'); // Bliblioteca para obtenção do MAC Address
var FILEPATH = __dirname + '/' + 'teste.txt'; // Diretório do arquivo a ser enviado

var HOST = '127.0.0.1'; // Endereço do servidor
var PORT = 6969; // Número da porta

// Criando um novo socket 
var client = new net.Socket();
// Abrindo uma nova conexão TCP com o servidor
client.connect(PORT, HOST, function() {

    // Imprimi no console os dados da conexão
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

    // Enviando o endereço MAC para o servidor
    getmac.getMac(function(err,macAddress){
        if (err)  throw err

        // Armazena na variável data o contúdo do arquivo teste.txt
        var data = fs.readFileSync(FILEPATH);

        // var binaryData = '';
        // for(var i = 0; i < data.length; i++){
        //     binaryData = binaryData + Dec2Bin(data[i]);
        // }

        // Abre um novo arquivo para escrita
        var fd = fs.openSync(FILEPATH, 'w+');
        // Cria um novo buffer com o endereço MAC
        var buffer = new Buffer(macAddress);
        // Escreve o endereço MAC
        fs.writeSync(fd, buffer, 0, buffer.length);
        // Escreve os dados antigos
        fs.writeSync(fd, data, 0, data.length); 
        // Fecha o arquivo
        fs.close(fd);

        // Enviando o arquivo para o servidor
        var fileStream = fs.createReadStream(FILEPATH);
        fileStream.on('error', function(err){
            console.log(err);
        })

        // Função para receber com as respostas do servidor
        fileStream.on('open', function() {
            fileStream.pipe(client);
        });
    });

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {

    console.log('DATA: ' + data);
    // Close the client socket completely
    //Sclient.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});

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