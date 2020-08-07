const express = require('express');
const app = express();
const port = 3000;
const cron = require('node-cron');
const vn = require('./getdata');
const fs = require('fs');

app.get('/', (req, res) => {
    res.send('Connected!');
});

app.get('/covid19/vietnam',async (req, res) => {
    var ress = fs.readFileSync('data.json', {encoding: 'utf-8'});
    res.json(JSON.parse(ress));
})

app.get('*', (req, res) => {
    res.send('Cannot Connect!');
});

cron.schedule('* 6 * * *', async () => {
    var data = await vn.processVietNam();
    fs.writeFileSync("data.json", JSON.stringify(data), {encoding: "utf-8"});
});

app.listen(port, () => {
    console.log('App is running on port ' + port);
});