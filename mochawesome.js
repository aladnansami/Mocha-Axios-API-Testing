const shell = require('shelljs');

const addParams = process.argv;
let file='';
if (addParams[2] === 'file' && addParams[3]) {
    file += addParams[3];
}
shell.exec(`npx mocha ${file} --timeout=30000 --retries=3 --reporter mochawesome --reporter-options reportDir=Reports,reportFilename=report.html`)