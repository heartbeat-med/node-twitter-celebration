"use strict";

var fnIntern = require( "intern-requirements" );
var oSettings = fnIntern( "oSettings" );
var TwitterSearch = fnIntern( "TwitterSearch" );
var Arduino = fnIntern( "Arduino" );

var DEFAULT_QUERY = "@hackinghealthDE";
var INTERVAL = 6;

var oArduino = new Arduino();


function _runArduinoProgram( aStatuses )
{
  oArduino.runNotification();
}

var oTwitterSearch = new TwitterSearch( oSettings.twitter );

oTwitterSearch.startSearching( process.argv[2] || DEFAULT_QUERY, function( aStatuses )
{
  if( aStatuses.length > 0 ) {
    _runArduinoProgram( aStatuses );
  }
}, function( oErr )
{
  console.log( "ERROR:", oErr );
}, INTERVAL );