const fs = require('fs');
const path = require('path');

const envDirectory = path.join(__dirname, 'src', 'environments');
const targetPath = path.join(envDirectory, 'environment.ts');

if (!fs.existsSync(envDirectory)) {
  fs.mkdirSync(envDirectory, { recursive: true });
}

const envConfigFile = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.apiKey || ""}',
    authDomain: '${process.env.authDomain || ""}',
    projectId: '${process.env.projectId || ""}',
    storageBucket: '${process.env.storageBucket || ""}',
    messagingSenderId: '${process.env.messagingSenderId || ""}',
    appId: '${process.env.appId || ""}',
    measurementId: '${process.env.measurementId || ""}'
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile, 'utf8');
