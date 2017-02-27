# vodapp
Video on demand app in angular.js

js/main.js : controller
js/services.js : for ajax calls
partials/ : contains templates
lib/ : contains libraries


Library used for horizontal carousel : sly.js
Library used for Video Player : video.js

Other dependencies : bootstrap, jquery

UserId Logic : when app is loaded in browser, the app assigns current timestamp as userId and is stored in html localstorage.

Description : App shows the list of videos from https://demo2697834.mockable.io/movies

You can view the video in full screen. The app will also show the history of watched videos

Keyboard shortcuts :

playPauseKey : Space key
rewindKey : Left arrow
forwardKey: Right arrow
volumeUpKey : Up arrow
volumeDownKey : Down arrow
muteKey : M
fullscreenKey : F