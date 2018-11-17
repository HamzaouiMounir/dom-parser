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

var number=0;
var pageNumberOption = {
  uri: 'https://www.pagesjaunes.fr/recherche/region/'+location+'/mecanicien',
  transform: function (body) {
      return cheerio.load(body);
  }
};
var avocatsUrlPromis;
var pnPromise = new Promise(function (resolve, reject) {
 rp(pageNumberOption)
  .then( ($)=> {
      // Process html like you would with jQuery...
      var counter=  $('#SEL-compteur').html().split('/');
      number=counter[counter.length-1];
      return resolve(parseInt(number));
  })
  .catch(function (err) {
      // Crawling failed or Cheerio choked...
      return reject(err);

  })
});

pnPromise.then((res)=>{

    console.log(res);
    fetchUrlByPage(res);
})

function fetchUrlByPage(pageNumbers){

//console.log("PAGES NUMBER + "+pageNumbers);
  //avocatsUrlPromis = new Promise( (resolve, reject)=> {
    for(var i=1;i<=200;i++){
      console.log(i);
      var options = {
        uri: 'https://www.pagesjaunes.fr/recherche/region/'+location+'/mecanicien?page='+i,
        transform: function (body) {
            return cheerio.load(body);
        }
      }
      rp(options)
       .then( ($)=> {
           // Process html like you would with jQuery...
           $('a.denomination-links[href*="pros"]').each(function(index,item){

             var url=$(this).attr('href');
             console.log(siteUrl+url);

               fs.appendFile("urls.txt",siteUrl+url+"\n",function(err){
                 if(err){
                   console.error(err);
                 }
                  console.log("Saved ...");
                 });

               });
         }).catch((err)=>{
           console.log('Retrying, please wait ....');
         })

       }
    }
