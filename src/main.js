"use strict";

var fnIntern = require( "intern-requirements" );
var oSettings = fnIntern( "oSettings" );
var TwitterSearch = fnIntern( "TwitterSearch" );

var DEFAULT_QUERY = "@hackinghealthDE";

function _runArduinoProgram( aStatuses )
{
  console.log( aStatuses.length );
}

var oTwitterSearch = new TwitterSearch( oSettings.twitter );

oTwitterSearch.startSearching( process.argv[2] || DEFAULT_QUERY, function( oStatuses )
{
  if( oStatuses.length > 0 ) {
    _runArduinoProgram( oStatuses.length );
  }
}, function( oErr )
{
  console.log( "ERROR:", oErr );
}, 60 );