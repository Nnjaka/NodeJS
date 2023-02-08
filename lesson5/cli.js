#!/usr/bin/env node

import inquirer from "inquirer";
import fsp from 'fs/promises';
import path from 'path';
import fs from 'fs';
import * as readline from 'node:readline';

const __dirname = process.cwd();
const __dirnameForRecord = '/Users/irinavinter/Desktop/NodeJS/lesson4'

function writeIpInFile(fileName, ip){
    const rs = fs.createReadStream(fileName, 'utf-8');

    const ws = fs.createWriteStream(path.join(__dirnameForRecord, `${ip}_requests.log`));
    ws.write(`Выборка для ip - ${ip} из файла - ${fileName} \n`);

    const rl = readline.createInterface({ input: rs });
    
    rl.on('line', (input) => {
        if (input.includes(ip)){
            console.log(`содержимое строки - ${input}`);
            ws.write(`${input} \n`);
        }
    });
    rl.on('error', (error) => console.log(error.message));
}

function getDataFromDir(fileName, ip){
    fsp
        .readdir(path.join(fileName))
        .then(async (indir) => {
            const list = []
            for (const item of indir) {
                const src = await fsp.stat(path.join(fileName, item))
                list.push(item)
            }
            return list
        })
        .then((choices) => {
            return inquirer
                .prompt([
                    {
                        name: "fileName",
                        type: 'list',
                        message: "Choose file",
                        choices
                    }
                ])
                .then( async (answers)  => {
                    const newSrc = await fsp.stat(path.join(fileName, answers.fileName));
                    const fullPath = path.join(fileName, answers.fileName);
                   
                    if (newSrc.isFile()) {
                        writeIpInFile(fullPath, ip) 
                    }
                    else {
                        getDataFromDir(fullPath, ip);
                    }
                })
        } 
    )
}

inquirer
        .prompt([
            {
                name: "ip",
                message: "Enter ip",
            },
            {
                name: "choiseQuestion",
                type: 'list',
                message: "Choose file or enter full path to the file",
                default: 'Choose file',
                choices: ['Choose file', 'Enter path']
            }
        ])
        .then((answers) => {
            if(answers.choiseQuestion === 'Enter path'){
                return inquirer
                .prompt([
                    {
                        name: "pathToFile",
                        type: 'input',
                        message: "Enter full path to the file",
                    }
                ])
                .then(({ pathToFile }) => {
                    writeIpInFile(pathToFile, answers.ip)
                })
            }
            else if(answers.choiseQuestion === 'Choose file'){
                getDataFromDir(__dirname, answers.ip);
            }
        })