var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');
var promise = require('promise');
var siteUrl='https://mon-avocat.fr';
var forEach = require('async-foreach').forEach;
var location='ile-de-france';
var pagesNumber=0;
var avocatsURL=[];

function getPagesNumber(){
 var number=0;
 var options = {
   uri: 'http://mon-avocat.fr/trouver/avocats/'+location,
   transform: function (body) {
       return cheerio.load(body);
   }
 };
 var promise = new Promise(function (resolve, reject) {
  rp(options)
   .then( ($)=> {
       // Process html like you would with jQuery...
       var counter=0;
       $('.pagination li').each(function(index,element) {
                 counter++;
       });
       number=$('.pagination li:nth-child('+(counter-1)+') > a').html();

       return resolve(number);
   })
   .catch(function (err) {
       // Crawling failed or Cheerio choked...
       return reject(err);

   })
 });

   promise.then((res)=>{
     console.log(res);

   }).catch(function (err) {
       // Crawling failed or Cheerio choked...
       return reject(err);

   })

   //console.log(number);

}



function loadPagesNumber(number){
  for(var i=1;i<=number;i++){
    fetchUrlByPage(i)
  }
}


function fetchUrlByPage(pageNumber){

  var options = {
    uri: 'http://mon-avocat.fr/trouver/avocats/'+location+'/?page='+pageNumber,
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  var promise = new Promise(function (resolve, reject) {
   rp(options)
    .then( ($)=> {
        // Process html like you would with jQuery...
        $('div.col-sm-8 > div.tile  a.tile-more').each(function(index,item){
            var urlAvocat=siteUrl+$(this).attr('href');
            avocatsURL.push(urlAvocat);
            //fetchDataByUrl(urlAvocat);
        });
          //return resolve(avocatsURL);

    return resolve(avocatsURL);
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
        return reject(err);

    }).finally((res)=>{
      //console.log("test");


    });
  });

    promise.then((res)=>{
      //console.log(res);
    //  console.log(avocatsURL);
      res.each(((url)=>{
        fetchDataByUrl(url);
      }))


    })


}
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
      //  console.log('name: '+profileTitle+' phone:'+phone+' URL : '+url);
        return resolve(avocat);
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
getPagesNumber();

//fetchDataByUrl('https://mon-avocat.fr/avocats/avocat-paris-75005-pierre-emmanuel-guidet-1563');
