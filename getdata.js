const cheerio = require('cheerio');
const axios = require('axios');

async function processVietNam() {
    var url = "https://vi.wikipedia.org/wiki/%C4%90%E1%BA%A1i_d%E1%BB%8Bch_COVID-19_t%E1%BA%A1i_Vi%E1%BB%87t_Nam";
    var raw = await getDataFromWeb(url);
    var data = cheerio.load(raw);
    var tong = await getTong(data);
    var image = await getImage(data);
    var chiTiet = await getChiTiet(data);
    return {"tongCa": tong, "imageData": image, "chiTiet": chiTiet};
}

async function getChiTiet(data) {
    var arr = [];
    var raw = data('#mw-content-text > div.mw-parser-output > table.wikitable.sortable.mw-collapsible > tbody > tr');
    raw.each(function(i, el) {
        if(i < 2) return true;
        var tds = data(this).find('td');
        var tinh =  data(tds[0]).text().replace('\n', '');
        var cn =  data(tds[1]).text().replace('\n', '');
        var ddt =  data(tds[2]).text().replace('\n', '');
        var hp =  data(tds[3]).text().replace('\n', '');
        var tv =  data(tds[4]).text().replace('\n', '');
        var res = {"tinh": tinh, "cn": cn, "ddt": ddt, "hp": hp, "tv": tv};
        arr.push(res);
    });
    arr.pop();
    return arr;
}

async function getTong(data) {
    var rawTotal = data('#mw-content-text > div.mw-parser-output > table.wikitable.sortable.mw-collapsible > tbody > tr:nth-child(2)');
    var cn = rawTotal.find('th:nth-child(2)').text().trim();
    var ddt = rawTotal.find('th:nth-child(3)').text().trim();
    var hp = rawTotal.find('th:nth-child(4)').text().trim();
    var tv = rawTotal.find('th:nth-child(5)').text().trim();
    var res = {"cn": cn, "ddt": ddt, "hp": hp, "tv": tv};
    return res;
}

async function getImage(data) {
    var arr = [];
    var image = data('#mw-content-text > div.mw-parser-output > table.infobox > tbody > tr:nth-child(2) > td > a > img').attr('src').replace('\/\/', '');
    var rawImage = data('#mw-content-text > div.mw-parser-output > table.infobox > tbody > tr:nth-child(2) > td > div');
    rawImage.find('.legend').each(function(i, el){
        var txt = data(this).text().trim();
        var color = data(this).find('.legend-color').css('background-color');
        arr.push({"txt" : txt, "color": color});
    });
    var res = {"image": image, "data": arr};
    return res;
}

async function getDataFromWeb(url) {
    var rawHTML = await axios.get(
        url,
        {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
            }
        }
    );
    return rawHTML.data;
}

module.exports.processVietNam = processVietNam;