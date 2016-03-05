angular.module('angularfireSlackApp')
  .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl){
    var usersRef = new Firebase(FirebaseUrl+'users');
    var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
    var users = $firebaseArray(usersRef);

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
        console.log(usersRef.child(uid));
        var location = $firebaseArray(usersRef.child(uid+'/location'));
        var coordinates = {
          lat : "32.1233",
          lng : "12.23213"
        };
        console.log(coordinates);
        connected.$watch(function (){
          if(connected.$value === true){
            location.$add(coordinates).then(function(connectedRef){
              connectedRef.onDisconnect().remove();
              var locationKey = connectedRef.key();
              console.log(locationKey); // returns location in the array
            });
          }
        });
      },
      unsetLocation: function(uid){
        var user= new Firebase(FirebaseUrl+'users/'+uid);
        user.child('location').remove(function(error){
            if (error) {
            console.log("Error:", error);
          } else {
            console.log("Removed successfully!");
          }
        });
      }
    };

    return Users;
  });
