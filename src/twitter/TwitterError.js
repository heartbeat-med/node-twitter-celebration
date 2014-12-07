"use strict";

var util = require("util");

/**
 * TwitterError
 * @param {string} message message
 * @param {*} [data] optional data
 * @constructor
 */
function TwitterError( message, data )
{
  this.message = message;
  this.data = data;
  this.stack = (new Error()).stack;
}

/**
 * TwitterError codes
 * @type {}
 */
TwitterError.CODE = {
  SEARCH : {
    INTERVAL_TO_SHORT : "interval is to short"
  }
};


TwitterError.prototype = Object.create( Error.prototype );
TwitterError.prototype.name = "TwitterError";

/**
 * toString
 * @returns {string}
 */
TwitterError.prototype.toString = function()
{
  var sOut = Error.prototype.toString.call( this );
  if( this.data ) {
    sOut += " " + util.inspect( this.data );
  }
  return sOut;
};

/**
 * Return optional data
 * @returns {null|*}
 */
TwitterError.prototype.getData = function()
{
  return this.data;
};


/**
 *
 * @type {TwitterError}
 */
module.exports =  TwitterError;
