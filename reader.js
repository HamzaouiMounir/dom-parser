var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');
var promise = require('promise');
var siteUrl='https://www.pagesjaunes.fr';
var forEach = require('async-foreach').forEach;
var location='ile-de-france';
var pagesNumber=0;
var avocatsURL=[];
var jsonfile = require('jsonfile');
var fs = require('fs');




function fetchDataByUrl(url){
  var options = {
    uri: url,
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  var promise = new Promise(function (resolve, reject) {
   rp(options)
    .then( ($)=> {
        // Process html like you would with jQuery...
        var profileTitle=$('.m-profile-title').text();
        var phone=$('#lawyer_contact_phone .highlight').text();
        var avocat ={
          profileTitle:profileTitle,
          phone:phone
        }
        console.log('name: '+profileTitle+' phone:'+phone+' URL : '+url);
        //return resolve(avocat);
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
        return reject(err);

    });
  });

    promise.then((res)=>{
      console.log(res)
    })
}
