const fs = require('fs');
const path = require('path');

let getFiles = (dir) => {
    return new Promise((res, rej) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                rej(err);
            } else {
                res(files);
            }
        });
    });
};

let readFilePromise = (file) => {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                rej(err);
            } else {
                res(data ? JSON.parse(data) : data);
            }
        });
    });
};

let isJsonFile = (pathString) => {
    return new Promise((res, rej) => {
        fs.lstat(pathString, (err, stats) => {
            if (err) {
                rej(err);
            } else {
                res(stats.isFile() && path.extname(pathString) === '.json');
            }
        });
    });
};

let getUrls = async (dir) => {
    let urls = [];
    let files = await getFiles(dir);

    if (files.length === 0) throw new Error(`no files found at "${dir}"`);

    for (file of files) {
        let filePath = `${dir}/${file}`;
        let isFile = await isJsonFile(filePath);
        if (!isFile) { continue };
        let extractedUrls = await readFilePromise(`${dir}/${file}`);
        if (extractedUrls) {
            urls.push({
                store: file.replace('.json', ''),
                urls: extractedUrls
            });
            backupFiles(dir, file);
        }
    }
    if (urls.length === 0) throw new Error(`no urls found at "${dir}"`);
    return urls;
};

let backupFiles = (dir, file) => {
    let backupFolder = `${dir}/backup`;
    if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder);
    }
    return new Promise((res, rej) => {
        fs.rename(`${dir}/${file}`, `${backupFolder}/${(new Date).getTime()}_${file}`, (err) => {
            err ? rej(err) : res(true);
        });
    });
};

module.exports.getUrls = getUrls;
