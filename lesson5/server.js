import fs from 'fs';
import path, { dirname, join, resolve } from 'path';
import http from 'http';
import url from 'url';
import fsp from 'fs/promises';
import { runInNewContext } from 'vm';

const host = 'localhost';
const port = 3000;
const __dirname = process.cwd();


async function getDataFromDir(pathToFile){
    let indir = await fsp.readdir(path.join(pathToFile));
        const list = [];

        for (const item of indir) {
            const src = await fsp.stat(path.join(pathToFile, item));
            list.push(item);
        }
    
        if(pathToFile !== `${__dirname}/`){
            list.unshift('..');
        }
         return list;
}

function isFile(filepath) {
	return fs.lstatSync(filepath).isFile();
};

function showFileContent(file){
    return fs.readFileSync(file, 'utf8');
}

function prepareLinks(list){
    const links = list.map((file) => `<li><a href="${file}">${file}</a></li>`).join('');
    return links;
}

function changeContent(links){
    const html = fs
        .readFileSync(join(__dirname, 'index.html'), 'utf8')
        .replace(/{{ content }}/gi, links);

        return html;
}

const server = http.createServer(async (req, res) => {
    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        return res.end();
    }

    const parseUrl = url.parse(req.url, true);
    const queryParams = parseUrl.query;
	const pathToDir = queryParams.path ?? process.cwd();
    const fileName = parseUrl.pathname;
    const pathToFile = path.join(pathToDir,fileName);

    if(isFile(pathToFile)){
        const content = showFileContent(pathToFile);

        res.writeHead(200, {
            'Content-Type': 'text/html',
        });

        res.end(content);
    } else {
        getDataFromDir(pathToFile).then(async (list) => {
            const links = prepareLinks(list);
            const html = changeContent(links);
                
            res.writeHead(200, {
                'Content-Type': 'text/html',
            });

            res.end(html);
        });
    }
});

server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));