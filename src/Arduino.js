"use strict";

var five = require( "johnny-five" );
var songs = require( "j5-songs" );

var SERVO_MAX = 160;
var SERVO_MIN = 20;
var PIN_SERVO = 11;
var SERVO_CENTER = 72;
var INTERVAL_SERVO = 4500;
var PIN_LED = 6;
var PIN_PIEZO = 3;
var SONG = "never-gonna-give-you-up";

/**
 * Arduino
 * @constructor
 */
function Arduino()
{
  this._oBoard = null;
  this._oServo = null;
  this._oLed = null;
  this._oPiezo = null;
  this._bIsReady = null;
  this._oSong = null;

  this._initBoard();
}

/**
 * Initializes the Arduiono board, servo, led and piezo.
 * @private
 */
Arduino.prototype._initBoard = function()
{
  this._oBoard = five.Board();

  this._oBoard.on( "ready", function()
  {

    console.log( "ready" );

    this._oServo = new five.Servo( {
      pin   : PIN_SERVO,
      range : [SERVO_MIN, SERVO_MAX]
    } ).stop();

    this._oServo.to( SERVO_CENTER );

    this._oLed = new five.Led( { pin : PIN_LED } );

    this._oPiezo = new five.Piezo( PIN_PIEZO );

    this._oSong = songs.load( SONG );

    this._bIsReady = true;
  }.bind( this ) );
};

/**
 * Turns the led on, moves the servo and plays the song if the board is initialized.
 */
Arduino.prototype.runNotification = function()
{
  if( this._bIsReady ) {
    this._oLed.on();
    this._oServo.max();
    this._oPiezo.play(
      this._oSong
    );
    this._oBoard.wait( INTERVAL_SERVO, function()
    {
      this._oLed.off();
      this._oServo.to( SERVO_CENTER );
    }.bind( this ) );
  }
  else {
    console.log( "Arduino: not yet ready" );
  }
};

module.exports = Arduino;
