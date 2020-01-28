const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Koa = require('koa');
const session = require('koa-session');
const serve = require('koa-static');

const app = new Koa();
const PORT = process.env.PORT | 8000;

app.use(session(app));
app.use(serve(__dirname + '/view/public'));
app.use(serve(__dirname + '/game'));

const server = app.listen(PORT, () => { console.log('Server listening on port 8000') });

module.exports = server;