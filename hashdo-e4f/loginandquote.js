var async = require('async');

module.exports = {
  name: 'LoginandQuote',
  description: 'E4F Login and Test Script',
  icon: 'http://cdn.hashdo.com/icons/html.png',
  clientStateSupport: true,

  inputs: {
   
  },
  
  

  getCardData: function (inputs, state, callback) {
    
    async.waterfall([
      
      
      
      
    ], function (err,result) {
      
    });
       
    var soap = require('soap');
    var url = 'http://labatt.exchange4free.com:8080/v4/userLogIn.wsdl';
    var args = {
      apiPartnerId: '19',
      apiPartnerUsername: 'AlanWalker',
      apiPartnerPassword: 'Al@ne4FAP1',
      username: 'MRG71508816',
      password: 'sH.2013Aud'    
    };
    
    var LoggedInUserID=0;
    
    soap.createClient(url,function(err,client) {
    
    client.UserLogIn(args,function(err,result) {
        console.log(result);
        if (result.statusCode==200) {
            var userID = (result.returnData.userId);
            
            callback(null, {html: userID});
            //callback(result.returnData);
            //console.log(userID);
        }
    });
    });
    
    
  }
};

