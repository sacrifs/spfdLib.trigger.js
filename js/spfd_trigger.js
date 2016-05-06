/**
 * spiffieldLib:Trigger
 * @author sacrifs / labs.spiffield.net
 * @version v0.0.1
 */
var spfdLib = spfdLib || {};
spfdLib.trigger = (function(){
	var _isInitTimer = false,
	_isInitResize = false,
	_fps = 30,
	_tickTime = 1000 / _fps,
	_resizeDelay = 100,
	_canUseAddEventListener = (window.addEventListener) ? true : false,
	_now = window.performance && (
	    performance.now		||
	    performance.mozNow	||
	    performance.msNow	||
	    performance.oNow	||
	    performance.webkitNow),
	_startTime = 0,
	_beforeTime = 0,
	_isTimerPlay = true,

	_timerObjList = [],
	_resizeObjList = [],

//public methods

	/**
	 * addTimer
	 * @param data : Object / data.func
	 * @param data.func : function [*require]
	 * @param data.fps : int framerate
	 * @param data.frame : int frameLength
	 */
	addTimer = function(data){
		if(!_isInitTimer){initTimer();}
		if(typeof data == "function"){
			data = {func:data};
		}
		_timerObjList.push(data);
	},

	/**
	 * addResize
	 * @param func : function
	 */
	addResize = function(func){
		if(!_isInitResize){initResize();}
		_resizeObjList.push(func);
		execResize();
	},

	/**
	 * setTimerOption
	 */
	setTimerOption = function(options){
		_fps = options.fps;
		_tickTime = 1000/_fps;
	},
	/**
	 * setResizeOption
	 */
	setResizeOption = function(options){
		_resizeDelay = options.delay;
		removeListener(window, "resize", debounce(resizeFunc));
		addListener(window, "resize", debounce(resizeFunc));
	},

	/**
	 * timerPause
	 */
	timerPause = function(){
		_isTimerPlay = false;
	},
	/**
	 * timerPlay
	 */
	timerPlay = function(){
		_isTimerPlay = true;
	},
	/**
	 * isTimerPause
	 */
	isTimerPause = function(){
		return _isTimerPlay;
	},


//private methods


	/**
	 * initTimer
	 */
	initTimer = function(){
		_startTime = getCurrentTime();
		timerTick();
	},
	/**
	 * initResize
	 */
	initResize = function(){
		addListener(window, "resize", debounce(execResize));
	},



	/**
	 * addListener
	 * addEventListener / attachEvent polyfill
	 */
	addListener = function(target, type, func){
		(_canUseAddEventListener) ? target.addEventListener(type, func, false) : target.attachEvent(type, func);
	},
	/**
	 * removeListener
	 * removeEventListener / detachEvent polyfill
	 */
	removeListener = function(target, type, func){
		(_canUseAddEventListener) ? target.removeEventListener(type, func, false) : target.detachEvent(type, func);
	},

	/**
	 * timerTick
	 */
	timerTick = function(){
		rafTick(timerTick);
		if(!_isTimerPlay){return;}

	    var lastTime = getCurrentTime();
		if(lastTime - _beforeTime < _tickTime){return;}

		execTimer(lastTime - _startTime);

		_beforeTime = lastTime;
	},
	/**
	 * execTimer
	 */
	execTimer = function(elapsedTime){
		for(var i = 0, len = _timerObjList.length; i < len; i++){
			var obj = _timerObjList[i];
			if(!obj.frame){
				obj.func();
			}
			else{
				var frame = obj.frame;
				var fps = obj.fps || _fps;
				var fnum = (elapsedTime / (1000 / fps) % frame) | 0;
				obj.func(fnum);
			}
		}

	},
	/**
	 * execResize
	 */
	execResize = function(){
		for(var i = 0, len = _resizeObjList.length; i < len; i++){
			var func = _resizeObjList[i];
			func();
		}
	},

	/**
	 * debounce
	 */
	debounce = function(func){
		var timer = null;
		return function(){
			clearTimeout(timer);
			timer = setTimeout(func, _resizeDelay);
		}

	},
	/**
	 * getCurrentTime
	 */
	getCurrentTime = function() {
		return (_now && _now.call(performance)) || (new Date().getTime());
	},
	/**
	 * rafTick
	 * requestAnimationFrame polyfill
	 * @param timerFunc : Function
	 */
	rafTick = function(tickFunc){
		var raf =	window.requestAnimationFrame		||
					window.webkitRequestAnimationFrame	||
					window.mozRequestAnimationFrame		||
					window.oRequestAnimationFrame		||
					window.msRequestAnimationFrame		||
					function(callback){window.setTimeout(callback, 1000 / 30);};
		return raf(tickFunc);
	};

	return {
		addTimer : addTimer,
		addResize : addResize,
		setTimerOption : setTimerOption,
		setResizeOption : setResizeOption,
		timerPlay:timerPlay,
		timerPause:timerPause
	};
})();
