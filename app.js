const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
// const cron = require('node-cron');
const vn = require('./getdata');
// const fs = require('fs');

app.get('/', (req, res) => {
    res.send('Connected!');
});

app.get('/covid19/vietnam',async (req, res) => {
    // var ress = fs.readFileSync('data.json', {encoding: 'utf-8'});
    var ress = await vn.processVietNam();
    res.json(ress);
})

app.get('*', (req, res) => {
    res.send('Cannot Connect!');
});

// cron.schedule('* 6 * * *', async () => {
//     var data = await vn.processVietNam();
//     fs.writeFileSync("data.json", JSON.stringify(data), {encoding: "utf-8"});
// });

app.listen(port, () => {
    console.log('App is running on port ' + port);
});