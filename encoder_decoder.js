
var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
var base = 58;

function encode(num){
    var encoded = '';
    while (num){
        var remainder = num % base;
        num = Math.floor(num / base);
        encoded = alphabet[remainder].toString() + encoded;
    }
    return encoded;
}

function decode(newstr)
{
    var str = newstr.toString();
    var decoded = 0;
    console.log('Attempting to Decode ', str);
    while(str)
    {
        //console.log('Decoded ', decoded);
        var index = alphabet.indexOf(str[0]);
        var power = str.length - 1;
        decoded += index*(Math.pow(base, power));
        str = str.substr(1);
    }
    console.log('Decoded ', decoded);
    return decoded;
}

module.exports.encode = encode;
module.exports.decode = decode;