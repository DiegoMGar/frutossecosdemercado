// MOCK ENV ONLY USED IN TEST ENVIRONMENT -- ENV.STAGE === TEST
const packageJson = require('./package.json');
const env = require('./environment.mock.json');
process.env = { ...process.env, ...env.default };
process.env.version = packageJson.version;
console.log('Loading stage: ', process.env.stage);
console.log('Version: ', process.env.version);
const app = require('./dist/main');
app.default.listen(3000, function() {
  console.log('Server is working: http://localhost:3000');
});
