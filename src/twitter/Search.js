"use strict";

var crypto = require( "crypto" );
var util = require( "util" );
var Twitter = require( "twitter" );
var fnIntern = require( "intern-requirements" );

var CONST = fnIntern( "oTwitterConstants" );
var TwitterError = fnIntern( "TwitterError" );

/**
 * Return hash of the query
 * @param {string} sQuery query
 * @returns {string}
 * @private
 */
function _getHash( sQuery )
{
  return crypto.createHash( "md5" )
    .update( sQuery )
    .digest( "hex" );
}

/**
 * Twitter Search
 * @param {{}} oConfig config object contains twitter api authentication
 * @constructor
 */
function Search( oConfig )
{
  this.oTwitter = new Twitter( oConfig );
  this._oIntervals = {};
  this._sLastSearchId = null;
}

/**
 * Start searching
 * @param {string} sQuery query
 * @param {Function} fnCbSuccess successful callback function
 * @param {Function} fnCbError error callback function
 * @param {number} nInterval interval in seconds
 */
Search.prototype.startSearching = function( sQuery, fnCbSuccess, fnCbError, nInterval )
{
  var sHash = _getHash( sQuery );

  if( nInterval < CONST.MIN_INTERVAL_TIME ) {
    throw new TwitterError( TwitterError.CODE.SEARCH.INTERVAL_TO_SHORT, {interval : nInterval} );
  } else {
    this._search( sQuery, fnCbSuccess, fnCbError );
    this._oIntervals[sHash] = setInterval( this._search.bind( this, sQuery, fnCbSuccess, fnCbError ),
      nInterval * 1000 );
  }

};

/**
 * Stop searching
 * @param {string} sQuery query
 */
Search.prototype.stopSearching = function( sQuery )
{
  var sHash = _getHash( sQuery );
  if( sHash in this._oIntervals ) {
    clearInterval( this._oIntervals[sHash] );
  }
};

/**
 * search
 * @param {string} sQuery query
 * @param {Function} fnCbSuccess successful callback
 * @param {Function} fnCbError error callback
 * @private
 */
Search.prototype._search = function( sQuery, fnCbSuccess, fnCbError )
{

  this.oTwitter.search( sQuery, function( oData )
  {
    if( oData.statusCode ) {
      fnCbError( util.inspect( oData.data ) );
    } else {

      if( oData.statuses.length > 0 ) {

        if( this._sLastSearchId !== null ) {
          var aResult = oData.statuses.filter( function( oStatus )
          {
            return oStatus.id > this._sLastSearchId;
          }.bind( this ) );

          if( aResult.length > 0 ) {
            fnCbSuccess( aResult );
          }
        }

        this._sLastSearchId = oData.statuses[0].id;
      }
    }
  }.bind( this ) );


};

/**
 * Search
 * @type {Search}
 */
module.exports = Search;