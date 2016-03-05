var position;
//made up class
var fakeclass = "CS250";

var allUsers = [];

$(function(){
    var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    position = pos.coords;


  };

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
});
angular.module('angularfireSlackApp')
  .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl){
    var usersRef = new Firebase(FirebaseUrl+'users');
    var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
    var infoRef = new Firebase(FirebaseUrl+'onlineusers');
    var users = $firebaseArray(usersRef);
    var locationKey;
    var infoKey;

    var Users = {
      getProfile: function(uid){
        return $firebaseObject(usersRef.child(uid));
      },
      getDisplayName: function(uid){
        return users.$getRecord(uid).displayName;
      },
      all: users,

      getGravatar: function(uid){
        return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
      },
      setOnline: function(uid){
        var connected = $firebaseObject(connectedRef);
        var online = $firebaseArray(usersRef.child(uid+'/online'));

        connected.$watch(function (){
          if(connected.$value === true){
            online.$add(true).then(function(connectedRef){
              connectedRef.onDisconnect().remove();
            });
          }
        });
      },
      setLocation: function(uid){

        var connected = $firebaseObject(connectedRef);
        var location = $firebaseArray(usersRef.child(uid+'/location'));
        var coordinates = {
          lat : position.latitude,
          lng : position.longitude
        };
        console.log(coordinates);
        connected.$watch(function (){
          if(connected.$value === true){
            location.$add(coordinates).then(function(connectedRef){
              connectedRef.onDisconnect().remove();
              locationKey = connectedRef.key();

              console.log(FirebaseUrl+'users/'+uid+'/location/'+locationKey);
            });
          }
        });
      },
      unsetLocation: function(uid){
        var location = new Firebase(FirebaseUrl+'users/'+uid+'/location/'+locationKey);
        var data;

        location.on("value", function(snapshot) {
        });
        var locationArray = $.map(data, function(value, index) {
            return [value];
        });

        console.log(locationArray);

        var user= new Firebase(FirebaseUrl+'users/'+uid);
        user.child('location').remove(function(error){
            if (error) {
            console.log("Error:", error);
          } else {
            console.log("Removed successfully!");
          }
        });
      },
      setClass: function(uid){
        var classes = new Firebase(FirebaseUrl+'users/'+uid+'/class/');
        var info = new Firebase(FirebaseUrl+'onlineusers/');
        classes.set('gayyyyy101');
      },
      setinfo: function(uid){
        var info = $firebaseArray(infoRef);
        // var info = new Firebase(FirebaseUrl+'onlineusers/');
        //push updated info into firebase, then push the unique id into the array(alluser) to keep track
        info.$add({
          Name: users.$getRecord(uid).displayName,
          lat:position.latitude,
          lng:position.longitude,
          class: fakeclass
        }).then(function(connectedRef){
          connectedRef.onDisconnect().remove();
          infoKey = connectedRef.key();

          allUsers.push(infoKey);
          console.log(allUsers);
        });

        //
        // var uniqueinfoKey = pushinfo.key;
        // console.log(uniqueinfoKey);
        // allUsers = allUsers.concat(uniqueinfoKey);
        // console.log(allUsers);
      },
      getinfo: function(uid){
        var info = new Firebase(FirebaseUrl+'onlineusers/');


      },
    };

    return Users;
  });
