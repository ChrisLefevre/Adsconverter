#Data converter - Mini App

## Installation de cette app

###Installer Node JS et NPM si pas déjà présent sur la machine

> Voir https://www.npmjs.com/get-npm



###Installer Nodemon 

L'application doit recharger automatiquement en cade de mide à jour du fichier *lotameIds.json* 

```bash
$ npm install -g nodemon
```



###Installer Express generator

```bash
$ npm install -g express-generator@4
```



###Créer l'app nodejs express

```bash
$ express dataconvecter
$ cd dataconvecter
$ npm install
```

Maintenant, la base de l'app est créé, il suffit de modifier le fichier app.js à la racine

```javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var lotameIds = require('./lotameIds.json');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var userCount = [];
app.get('/log', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Log des appels au script \n');
  for (i = 0; i < 15; i++) { 
    var d = new Date();
    d.setDate(d.getDate() - i);
      var year   = d.getFullYear();
      var month  = d.getMonth() + 1;
      var day    = d.getDate();
      if(typeof userCount[day+"/"+month+"/"+year] !== "undefined") {
        res.write(day+"/"+month+"/"+year+' => '+ userCount[day+"/"+month+"/"+year] + ' appels du script\n');
      }
    }
  res.end();
});

app.get('/retag/:tagIds', function(req, res) {
  var now = new Date();
  var year   = now.getFullYear();
  var month  = now.getMonth() + 1;
  var day    = now.getDate();
  if(typeof userCount[day+"/"+month+"/"+year]  === "undefined") {
    userCount[day+"/"+month+"/"+year] = 0;
  }
  userCount[day+"/"+month+"/"+year] ++;
  var taglist = req.params.tagIds.split(',');
  var stringTags = '';
  taglist.forEach(function(tagEl){
    lotameIds.forEach(function(lotamEl){
      if(lotamEl.TargetingCode!=='') {
        if( lotamEl.ID==tagEl) {
          stringTags = stringTags+lotamEl.TargetingCode+',';
        }
      }
    });
  });
  let newUrl = 'https://be-rtl.videoplaza.tv/proxy/pixel/v2?LotameParam='+stringTags;
  res.redirect(newUrl);
});

app.get('/', function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<body><h1>IP Belgium / Data converter</h1></body>');
  res.end();
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in s
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
```



### Copier le fichier lotameIds.json à la racine

Le fichier suivant est une table de correspondance. Il doit pouvoir être mis à jour via Ftp. 
L'utilisation de **nodemon**  est recommandé pour ne pas devoir relancer manuellement l'app à chaque modif.

> ./lotameIds.json



##Démarrage de l'application

Démarrer avec Nodemon

```bash
$ nodemon ./bin/www
```


Exemple de démarrage avec forever (pour info)

```bash
$ forever start --minUptime 1000 --spinSleepTime 1000 ./bin/www
```



## Fonctionnement du script :

``` 
https://ad.crwdcntrl.net/5/c=9779/pe=y?http://votreserveur:3000/retag/${aud_ids}
```

Doit rediriger vers un lien de ce type : 

```
https://be-rtl.videoplaza.tv/proxy/pixel/v2?LotameParam=sd_female_age=6,sd_female_age=4,int_lifestyle=3,aff_actuality=4,aff_lifestyle=6,aff_lifestyle=5,sd_female_age=8,aff_lifestyle=1,sd_gen=1,sd_age=11,sd_gen_pra=2,aff_lifestyle=8,sd_female_age=5,aff_other=5,aff_family=2,sd_male_age=5,sd_age=5,sd_age=2,aff_other=3,aff_other=1,aff_sport=3,all,int_other=3,aff_actuality=1,sd_age=4,sd_female_age=7,sd_age_pra=1,sd_male_age=9,sd_fam=1,aff_bati=2,aff_other=11,sd_gen_pra=1,aff_sport=1,sd_male_age=2,sd_stat=3,sd_gen=2,sd_female_age=9,sd_fam=2,aff_other=9,sd_age=10,sd_female_age=2,sd_age=13,sd_male_age=3,aff_other=4,aff_other=8,aff_lifestyle=7,aff_bati=3,sd_stat=2,aff_other=2,aff_family=1,sd_age=13,sd_age=10,sd_age=3,sd_age=8,int_geek=1,sd_male_age=8,sd_gen=1,aff_sport=2,sd_male_age=7,all_traffic,int_other=1,aff_other=10,sd_female_age=1,aff_food=3,sd_male_age=1,sd_age=7,aff_other=12,sd_female_age=3,sd_male_age=4,int_family=1,sd_male_age=6,sd_age=6,sd_age=13,cim_soc_stat=2,sd_pra=1,sd_stat=1,aff_lifestyle=3,cim_soc_stat=1,aff_bati=1,int_other=8,sd_gen_age_pra=2,sd_age=10,aff_lifestyle=2,sd_gen_age_pra=1,aff_food=2,sd_gen=2,int_sport=1,aff_actuality=2,sd_age=9,aff_actuality=3,sd_age=12,int_other=4,
```



##Démonstration 

> Cette url est une démonstration 
>
> https://ad.crwdcntrl.net/5/c=9779/pe=y?https://ads.swork.io/retag/${aud_ids}