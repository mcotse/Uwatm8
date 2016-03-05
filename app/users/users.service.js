var position;
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
    var users = $firebaseArray(usersRef);
    var locationKey;

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
          data = snapshot.val();  // Alerts "San Francisco"
        });
        // var locationArray = [];
        var locationArray = $.map(data, function(value, index) {
            return [value];
        });
        //
        // locationArray[0]['lat']= location[0].lat;
        // locationArray[0]['lng']= location[1].lng;
        // locationArray[0]= location.$getRecord("lat");
        // locationArray[1]= location.$getRecord("lng");

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
      // getlocation: function(uid){
      //   var location = $firebaseArray(usersRef.child(uid+'/location/'+locationKey));
      //   console.log(usersRef.child(uid+'/location/'+locationKey));
      //   var locationArray = [];
      //
      //   locationArray[0]['lat']= location[i].lat;
      //   locationArray[1]['lng']= location[i].lng;
      //   console.log(locationArray);
      // }
    };

    return Users;
  });
