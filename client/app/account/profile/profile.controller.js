'use strict';

angular.module('theSignUp2App')
  .controller('ProfileCtrl', function ($scope, $window, $http, $cookieStore, Auth, Profile, Upload) {
    $scope.errors = {};
    $scope.users = {};
    $scope.categories = ['Transportation', 'Food', 'Arts & Leisure']
    $scope.currentUser = Auth.getCurrentUser();
    $scope.job = {byUserId: $scope.currentUser._id};
    $scope.createJobPressed = false;
    $scope.jobPosted = false;

    $scope.isPressed = false;
    $scope.currentUser.profileInfo.about = $scope.currentUser.profileInfo.about || 'About me';
    $scope.updateSuccess = false;
    $scope.file = '';
    $scope.myJobs = [];


    $scope.showUserInfo = function(){
      if (!$scope.isPressed){
        $scope.isPressed = true
      } else {
        $scope.isPressed = false
      }
      // console.log($scope.currentUser)
      // console.log($scope.isPressed)
    };

    $scope.profilePicUpload = function(files){
      console.log('profilePicUpload', arguments)
      if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
              var file = files[i];
              console.log(file)
              Upload.upload({
                  url: 'api/users/profilepic',
                  fields: {'userId': $scope.currentUser._id},
                  file: file
              }).progress(function (evt) {
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
              }).success(function (data, status, headers, config) {
                  console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                  $window.location.reload();
              });
          }
      }
    }
    $scope.showJobsCreated = function(){
      Profile.getMyJobs()
        .then( function(data) {
          console.log('myJobs: ', data)
          $scope.myJobs = data;
        })
        .catch( function(err) {
          console.log('myJobs Error:', err)
          $scope.errors.other = err.message;
        });
    }
    $scope.showCreateJobs = function(){
      if (!$scope.createJobPressed){
        $scope.createJobPressed = true
      } else {
        $scope.createJobPressed = false
      }
      
    }
    
    $scope.createJob = function() {
      console.log('profile.controller.js: createJob', $scope.job)
      $scope.myJobs.push($scope.job)
      Profile.createJob($scope.job)
        .then( function(data) {
          $scope.jobPosted = data;
          $scope.createJobPressed = false;
          $scope.job = {}
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        }); 
    }

    $scope.updateProfileInfo = function(){
      $scope.taken = false;   //#DD: Added functionality to prevent repeat skills
                              //#DD: Todo later: Add a Materialize toast to alert user
      if( $scope.currentUser.profileInfo.newSkill && event.keyCode == 13 ) {
        if($scope.currentUser.profileInfo.skills.indexOf($scope.currentUser.profileInfo.newSkill) !== -1){
          $scope.taken=true;
          return;
        }
        $scope.currentUser.profileInfo.skills.push($scope.currentUser.profileInfo.newSkill);
        $scope.currentUser.profileInfo.newSkill = '';
        console.log($scope.currentUser.profileInfo.skills);
      }
      Profile.updateProfileInfo($scope.currentUser.profileInfo)
        .then( function(data) {
          $scope.updateSuccess = true;
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });        
    };

    // $scope.updateProfileSkills = function(){
    //   Profile.updateProfileSkills($scope.currentUser.profileInfo)
    //     .then( function(data) {
    //       $scope.updateSuccess = true;
    //     })
    //     .catch( function(err) {
    //       $scope.errors.other = err.message;
    //     });        
    // };

    console.log($scope.currentUser)
  });
