angular.module('angularfireSlackApp')
  .controller('ChannelsCtrl', function($state, Auth, Users, profile, channels){
    var channelsCtrl = this;
    var locationtoggle = 0;
    channelsCtrl.profile = profile;
    channelsCtrl.channels = channels;
    channelsCtrl.users = Users.all;
    channelsCtrl.getDisplayName = Users.getDisplayName;
    channelsCtrl.getGravatar = Users.getGravatar;
    Users.setOnline(profile.$id);

    //logout function
    channelsCtrl.logout = function(){
      channelsCtrl.profile.online = null;
      channelsCtrl.profile.$save().then(function(){
        Auth.$unauth();
        $state.go('home');
      });
    };

    //location function
    channelsCtrl.setLocation = function(){

      if (!locationtoggle){
        Users.setLocation(profile.$id);
        locationtoggle = 1;
      }
      else {
        Users.unsetLocation(profile.$id);
        locationtoggle = 0;
      }
    };

    channelsCtrl.newChannel = {
      name: ''
    };
    channelsCtrl.createChannel = function(){
      channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(ref){
        $state.go('channels.messages', {channelId: ref.key()});
      });
    };

  });
