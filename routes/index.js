var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config');
var base58 = require('../encoder_decoder.js');
var URL = require('../url.js').URL;
var counter = require('../url.js').counter;
//var hasher = require('./encoder_decoder.js');

/* GET home page. */

router.get('/retrieve', function (req, res)
{
    res.send('Wahahaha!');
});

router.post('/retrieve', function (req, res)
{
    var shortURL = req.body.shortUrl;
    console.log('Attempt to retrieve longform of ', shortURL.toString(), '__');
    var id = base58.decode(shortURL.toString());
    URL.findOne({_id: id}, function (err, doc)
    {
        console.log('Decrypting the URL : ', shortURL);
        if(doc)
        {
            console.log('Found Entry ! ');
            var longurl = doc.longUrl.toString();
            if(longurl.indexOf('http') !== -1)
                res.send(doc.longUrl.toString());
            else
                res.send('http://'+doc.longUrl.toString());
        }
        else
        {
            console.log('Error : ', err);
            res.send(err);
        }
    })
});

router.post('/send', function (req, res)
{
    console.log('Got HTTP POST Request!');
    var longURL = req.body.longUrl;
    var shortURL = '';
    //res.send('Bancaa');
    console.log('Long URL is : ' + longURL);
    URL.findOne({longUrl: longURL}, function (err, doc)
    {
        console.log('Looking in DB');
        if(doc)
        {
            shortURL = config.webhost + base58.encode(doc._id);
            console.log(shortURL);
            res.send(shortURL.toString());
            // return old entry
        }
        else
        {
            // create new entry
            var count;
            counter.findOne({_id: 'url_count'}, function(err, doc)
            {
                console.log('Count bla');
                if(doc)
                {
                    count = Number(doc.seq);
                    console.log('Count ', count);
                    var newUrlEntry = new URL(
                        {
                            _id: count,
                            longUrl: longURL,
                            created_at: new Date()
                        }
                    );

                    newUrlEntry.save(function(err, newUrlEntry)
                    {
                        if(err)
                        {
                            console.log('Error @2 !! : ', err);
                            res.send(err.toString());
                        }

                        shortURL = config.webhost + base58.encode(newUrlEntry._id);
                        res.send(shortURL.toString());

                    });
                }
                else
                {
                    res.send(err.toString());
                }
            });
            //console.log('Count : ', count);

        }
    });
});

module.exports = router;
