import { createReadStream, createWriteStream, fstat } from 'fs';
import * as readline from 'node:readline';

const rs = createReadStream('./access_tmp.log');
const wsFirst = createWriteStream('./89.123.1.41_requests.log');
const wsSecond = createWriteStream('./34.48.240.111_requests.log');

const rl = readline.createInterface({ input: rs });

const regexpIpFirst = /^(89.123.1.41)/;
const regexpIpSecond = /^(34.48.240.111)/;

rl.on('line', (input) => {
    if (input.match(regexpIpFirst)){
        wsFirst.write(`${input} \n`);
    }
    else if(input.match(regexpIpSecond)){
        wsSecond.write(`${input} \n`);
    }
});