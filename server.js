var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mailer = require('express-mailer');

var port = process.env.PORT || 5000;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var async = require('async'),
    CronJob = require('cron').CronJob,
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    FeedParser = require('feedparser'),
    request = require('request');
var feedSchema = new Schema({
    _id: String,
    title: String,
    description: String,
    approved_description: String,
    approved_title: String,
    link: String,
    image: String,
    date: Date,
    category: String,
    approved_title: String,
    approved_description: String,
    approved_image: String,
    video: String,
    action: String,
    countFavorites: Number,
    favorites: [{ type : String }]
},{ strict: false });

var feedSchema2 = new Schema({
    approved_title: String
});

var Feed = mongoose.model('vegannews',feedSchema);
var Feed2 = mongoose.model('Examplefeed',feedSchema2);
var User = require('./models/user');

var routes = require('./routes/index');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } });

var app = express();

app.set('feedschema', Feed);
app.set('appvariable', app);

mailer.extend(app, {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'amitabh@ampdigitalnet.com',
        pass: 'ads4growth2014'
    }
});;



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true, cookie: { maxAge: 2592000000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', routes);

app.get('/uniqueEmails', function(req, res, next) {
    User.find({}, function(err, user) {
        if (err)
            res.json(err);
        if (user) {
            var emailIds = [];
            var usernames = {};
            for(var i = 0; i < user.length; i++) {
                if (user[i].facebook.id != null) {
                    name = user[i].facebook.name;
                }
                if (user[i].google.id != null) {
                    name = user[i].google.name;
                }

                if (user[i].linkedin.id != null) {
                    name = user[i].linkedin.name;
                }
                if (emailIds.indexOf(user[i]['email']) == -1) {
                    emailIds.push(user[i]['email']);
                    usernames[user[i]['email']] = name;
                }
            }
            var d = new Date();
            d.setDate(d.getDate() - 7);
            var awsSesMail = require('aws-ses-mail');

            var sesMail = new awsSesMail();
            var sesConfig = {
                accessKeyId: 'AKIAJ6VNWKUYHJ2X4H5Q',
                secretAccessKey: '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',
                region: 'us-west-2'
            };
            sesMail.setConfig(sesConfig);

            Feed.find({"date":{$gte: d}, "action":"approved", "favorites": {$exists: true, $not: {$size: 0}}}, null, {sort: {countFavorites: -1}}, function (err, docs) {
                for(var j = 0; j < emailIds.length; j++){
                    function timeSince(date) {

                        var seconds = Math.floor((new Date() - date) / 1000);

                        var interval = Math.floor(seconds / 31536000);

                        if (interval > 1) {
                            return interval + " years";
                        }
                        interval = Math.floor(seconds / 2592000);
                        if (interval > 1) {
                            return interval + " months";
                        }
                        interval = Math.floor(seconds / 86400);
                        if (interval > 1) {
                            return interval + " days";
                        }
                        interval = Math.floor(seconds / 3600);
                        if (interval > 1) {
                            return interval + " hours";
                        }
                        interval = Math.floor(seconds / 60);
                        if (interval > 1) {
                            return interval + " minutes";
                        }
                        return Math.floor(seconds) + " seconds";
                    }

                    var sampleHtml = '';
                    for(var i =0; i<docs.length; i++){
                        var url = docs[i]['link'];
                        var urlParts = url.split('url=');
                        function getHostName(url) {
                            var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
                            if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                                return match[2];
                            }
                            else {
                                return null;
                            }
                        }
                        if(typeof docs[i]['approved_image'] !=='undefined' && docs[i]['approved_image']!==null){
                            sampleHtml = sampleHtml+ '<div class="content"><table bgcolor="">' +
                                '<tr>' +
                                '<td data-email="'+emailIds[j]+'" class="small emaildata" width="20%" style="vertical-align: top; padding-right:10px;"><img height="80" src="'+docs[i]['approved_image']+'" /></td>' +
                            '<td>' +
                            '<a style="color: black;" href="'+docs[i]['link']+'"><h5>'+docs[i]['approved_title']+'</h5></a>' +
                            '<i style="color: black;">'+getHostName(urlParts[1])+'&nbsp; '+ timeSince(new Date(docs[i]['date']))+'&nbsp; ago</i>' +
                            '<p>'+docs[i]['approved_description']+'</p>' +'</td>' +'</tr>' +
                            '</table>' +
                            '</div><!-- /content -->' +
                            '<hr>';
                        }
                        else{
                            sampleHtml = sampleHtml+ '<div class="content">' +
                            '<table bgcolor="">' +
                            '<tr>' +
                            '<td>' +
                            '<a style="color: black;" href="'+docs[i]['link']+'"><h5>'+docs[i]['approved_title']+'</h5></a>' +
                            '<i style="color: black;">'+getHostName(urlParts[1])+' &nbsp;'+ timeSince(new Date(docs[i]['date']))+'&nbsp; ago</i>' +
                            '<p>'+docs[i]['approved_description']+'</p>' +
                            '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div><!-- /content -->' +
                            '<hr>';
                        }}
                    var username = usernames[emailIds[j]];
                    console.log('ubsciniebeb___');
                    console.log('<a target="_blank" href="http://newsapp.io/unsubscribe?emailid="'+emailIds[j]+'>' +
                        '<unsubscribe>Unsubscribe</unsubscribe>' +
                        '</a>');
                    var unsubscribeLink = new Buffer(emailIds[j]).toString('base64');
                    var options = {
                        from: 'NewsApp.io <amitabh@ads4growth.com>',
                        to: emailIds[j],
                        subject: 'Weekly Top Stories',
                        template: 'views/email.ejs',
                        templateArgs: {
                            username: username,
                            sampleHtml: sampleHtml,
                            to: emailIds[j],
                            unsubscribelink: '<a target="_blank" href="http://newsapp.io/unsubscribe?emailid="'+unsubscribeLink+'>' +
                            '<unsubscribe>Unsubscribe</unsubscribe>' +
                            '</a>'
                        }
                    };

                    sesMail.sendEmailByHtml(options, function(data) {
                    });
                }
                res.json(docs);
            });
            //res.json(emailIds);
        } else {
            res.json('aegaeg');
        }
    });
});


app.post('/users', function (req, res, next) {
    app.mailer.send('email', {
        to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'NewsApp.io: This week top stories', // REQUIRED.
        contact_name: req.body.name, // All additional properties are also passed to the template as local variables.
        contact_email: req.body.email, // All additional properties are also passed to the template as local variables.
        contact_phone: req.body.phone, // All additional properties are also passed to the template as local variables.
        contact_message: req.body.message // All additional properties are also passed to the template as local variables.
    }, function (err) {
        if (err) {
            // handle error
            console.log(err);
            res.send('There was an error sending the email');
            return;
        }
        res.send('Email Sent');
    });
});

var parser = require('rss-parser');

var job = new CronJob({
    cronTime: '0 */10 * * * *',

    onTick: function() {
        parser.parseURL('http://www.rssmix.com/u/8248916/rss.xml', function(err, parsed) {
            parsed.feed.entries.forEach(function(item) {
                /*if(item.guid == 'tag:google.com,2013:googlealerts/feed:9049310398211864269'){
                 console.log(item.title + ':' + item.link);
                 }*/
                item._id = item.guid;
                if(typeof item['content:encoded'] !== 'undefined' && item['content:encoded'] !== null){
                    item.description = item['content:encoded'];
                }
                else if(typeof item['description'] !== 'undefined' && item['description'] !== null){
                    item.description = item['description'];
                }
                else{
                    item.description = 'Please check rss feed and update cron';
                }
                delete item.guid;
                Feed.update({ _id: item._id} ,{ "$set": item }, { upsert: true }, function (err, response) {
                    //console.log(response);
                    if(err){
                    }
                    if(response){
                    }
                });

            })
        });

    },
    start: true
});

var job2 = new CronJob({
    cronTime: '0 */20 * * * *',

    onTick: function() {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        Feed.remove({ "date": { $lte: d}, "action": {$ne: 'approved'}}, function (err, docs) {
            //console.log(docs);
        });


    },
    start: true
});

mongoose.connection.on('open',function(err,db) {
    job.start();
    job2.start();
});


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.listen(port);

module.exports = app;
