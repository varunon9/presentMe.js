/**
    * presentMe.js
    * version 1.0
    * Description: Web-based presentation plugin combining the power of GSAP, jQuery, CSS3 and HTML5
    * Dependencies: Greensock(Gsap), jQuery, HTML5
    * Author: Varun Kumar
    *     B.Tech., Information Technology, NIT Kurukshetra (2013-2017)
    * Contact: varunon9@gmail.com
    * Github: https://github.com/varunon9
    * Feedbacks are welcomed
    * inspired from reveal.js(https://github.com/hakimel/reveal.js/) and
        impress.js(https://github.com/impress/impress.js/)
    *
**/
( function ( d, w, $, tweenMax, timelineMax ) {
    /**
        Hey hi!
        Did you land here after visiting index.html? If no then visit that file first to get started
        options object to customize. Alter these valuse as per your requirements
    **/
    var options = {
        //time taken in incoming or outgoing of slides in ms
        "inOutDuration" : 1000,
        //duration of slide (ms) in case of automatic execution
        "duration" : 4000,
        //set this true if you want slide show
        //note that in this case there will be automatic slideshow and you will not be able to control 
        //next as well as previous slide
        //however you can pause/play slides using space bar
        "automaticExecution" : false
    };
	var documentObject = $( d ),
	    windowObject = $( w ),
	    windowWidth = windowObject.width(),
	    windowHeight = windowObject.height(),
	    //if all the slides/frames have been executed
	    executionOver = false,
	    //play-pause option in case of automatic execution
	    pause = false,
	    arrayOfFrames = [],
	    //setInterval function responsible for automatic execution
	    slideShowOn,
	    //zero-based indexing. Here it means first slide
	    currentSlideNumber = 0,
	    totalSlides,
	    //keyboard keys control slides. If keyPressControlFlag is 1 then keyboard keys will work
	    //this is necessary because executeIn and executeOut of slides take some time (options.inOutDuration)
	    //so to avoid presenting two slides simultaneously
	    keyPressControlFlag = 1,
	    //frameClass is css class ".frame"
	    frameClass = $( "div .frame" ),
	    //div id="main"
	    mainDiv = $( "#main" ),
	    indicatorDiv = $( "#indicator" ),
        control = $( "#control" ),
        leftControl = $( "#leftControl" ),
        rightControl = $( "#rightControl" ),
        pauseDiv = $( "#pause" ),
	    indicatorClass,
	    currentIndicatorClassNumber = 0;
	    //this is class Frame
	    Frame = function ( from, to, number, styleIn, styleOut ) {
            this.from = from;
            this.to = to;
            //zero based indexing for number
            this.number = number;
            this.styleIn = styleIn;
            this.styleOut = styleOut;
	    };
	//method for incoming of slide/frame
    Frame.prototype.executeIn = function () {
    	var nthFrame = $( "div .frame:nth-child(" + ( this.number + 1 ) + ")" );
    	nthFrame.css( "display", "block" );
        //console.log( "executionIn of " + this.number + " frame" );
        var top, left, topAndLeft, time, ease;
        //converting options.inOutDuration from ms to s
        time = ( options.inOutDuration / 1000 );
        ease = "Power2.easeOut"; //Elastic.easeIn.config(2, 1)
        if( this.from == "rotateLeft" || this.from == "rotateRight" ) {
            var x;
            if( this.from == "rotateLeft" ) {
                x = "-100%";
            }
            else {
                x = "100%";
            }
            tweenMax.fromTo( nthFrame, ( time / 2 ), {
                x : x,
                y : "0%",
                top : "5%",
                left : "2.5%",
                ease : ease,
                rotationX : "0deg",
                rotationY : "60deg"
            }, {
                x : "0%",
                rotationY : "60deg",
                ease : ease,
                onComplete : function () {
                    tweenMax.to( nthFrame, ( time / 2 ), {
                        rotationY : "0deg"
                    });
                }
            });
        }
        if( this.from == "rotateUp" || this.from == "rotateDown" ) {
            var y;
            if( this.from == "rotateUp" ) {
                y = "-100%";
            }
            else {
                y = "100%";
            }
            tweenMax.fromTo( nthFrame, ( time / 2 ), {
                y : y,
                x : "0%",
                top : "5%",
                left : "2.5%",
                ease : ease,
                rotationY : "0deg",
                rotationX : "60deg"
            }, {
                y : "0%",
                rotationX : "60deg",
                ease : ease,
                onComplete : function () {
                    tweenMax.to( nthFrame, ( time / 2 ), {
                        rotationX : "0deg"
                    });
                }
            });
        }
        else if( this.from == "beneath" || this.from == "above" ) {
            var z;
            if( this.from == "beneath" ) {
                z = "-1500px";
            }
            else {
                z = "1500px";
            }
            tweenMax.fromTo( nthFrame, ( time ), {
                top : "5%",
                left : "2.5%",
                z : z,
                opacity : .9,
                ease : ease
            }, {
                z : "0px",
                opacity : 1,
                ease : ease
            });
        }
        else {
            topAndLeft = functions.calculateTopAndLeft( this.from );
            top = topAndLeft.top;
            left = topAndLeft.left;
            //checking if top and left has been set or not
            if( top != -1 && left != -1 ) { 
                //checking if data-styleIn attribute has been set or not
                if( this.styleIn == "zoomOut" ) {
                    tweenMax.fromTo( nthFrame, ( time / 2 ) , {
                        top : top,
                        left : left,
                        scale : .5,
                        opacity : .9,
                        ease : "Power2.easeOut"
                    }, {
                        top : "5%",
                        left : "2.5%",
                        opacity : 1,
                        ease : ease,
                        onComplete : function () {
                            tweenMax.to( nthFrame, ( time / 2), {
                                scale : 1,
                                ease : ease
                            });
                        }
                    });
                }
                else {
                    tweenMax.fromTo( nthFrame, time , {
                        top : top,
                        left : left,
                        opacity : .9,
                        ease : "Power2.easeOut"
                    }, {
                        top : "5%",
                        left : "2.5%",
                        opacity : 1,
                        ease : ease
                    });
                }
            }
            //data-from attribute has been set to either zoomOut or zoomIn
            else {
                var scale;
                if( this.from == "zoomOut" ) {
                    scale = 0.1;
                }
                else if( this.from == "zoomIn" ) {
                    scale = 2;
                }
                tweenMax.fromTo( nthFrame, time, {
                    top : "5%",
                    left : "2.5%",
                    scale : scale,
                    ease : ease
                }, {
                    scale : 1
                });
            }
        }

    };
    //method for outgoing of slide/frame
    Frame.prototype.executeOut = function () {
        var nthFrame = $( "div .frame:nth-child(" + ( this.number + 1 ) + ")" );
        var top, left, topAndLeft, time, ease;
        //converting options.inOutDuration from ms to s 
        time = ( options.inOutDuration / 1000 );
        ease = "Power2.easeOut";
        if( this.to == "rotateRight" || this.to == "rotateLeft" ) {
            var x;
            if( this.to == "rotateRight" ) {
                x = "100%";
            }
            else {
                x = "-100%";
            }
            tweenMax.to( nthFrame, ( time / 2 ), {
                rotationY : "60deg",
                ease : ease,
                onComplete : function () {
                    tweenMax.to( nthFrame, ( time / 2 ), {
                        x : x,
                        ease : ease,
                        onComplete : function () {
                           nthFrame.css( "display", "none" ); 
                        }
                    });
                }
            });
        }
        else if( this.to == "rotateUp" || this.to == "rotateDown" ) {
            var y;
            if( this.to == "rotateUp" ) {
                y = "-100%";
            }
            else {
                y = "100%";
            }
            tweenMax.to( nthFrame, ( time / 2 ), {
                rotationX : "60deg",
                ease : ease,
                onComplete : function () {
                    tweenMax.to( nthFrame, ( time / 2 ), {
                        y : y,
                        ease : ease,
                        onComplete : function () {
                           nthFrame.css( "display", "none" ); 
                        }
                    });
                }
            });
        }
        else if( this.to == "beneath" || this.to == "above" ) {
            var z;
            if( this.to == "beneath" ) {
                z = "-1500px";
            }
            else {
                z = "1500px";
            }
            tweenMax.to( nthFrame, ( time ), {
                z : z,
                ease : ease,
                onComplete : function () {
                    tweenMax.set( nthFrame, {
                        z : 0
                    });
                    nthFrame.css( "display", "none" ); 
                }
            });
        }
        else {
            topAndLeft = functions.calculateTopAndLeft( this.to );
            top = topAndLeft.top;
            left = topAndLeft.left;
            //checking if top and left has been set or not
            if( top != -1 && left != -1 ) {
                //checking if data-styleOut attribute has been set or not
                if( this.styleOut == "zoomOut" ) {
                    tweenMax.to( nthFrame, ( time / 2 ), {
                        scale : .5,
                        ease : ease,
                        onComplete : function () {
                            tweenMax.to( nthFrame, ( time / 2 ), {
                                top : top,
                                left : left,
                                ease : ease,
                                onComplete : function () {
                                    //setting scale back to normal i.e. 1
                                    tweenMax.set( nthFrame, {
                                        scale : 1
                                    });
                                    nthFrame.css( "display", "none" );
                                }
                            });
                        }
                    });
                }
                else {
                    tweenMax.to( nthFrame, time , {
                        top : top,
                        left : left,
                        ease : ease,
                        onComplete : function () {
                            nthFrame.css( "display", "none" );
                        }
                    });
                }
            }
            //data-from attribute has been set to either zoomOut or zoomIn
            else {
                var scale;
                if( this.to == "zoomOut" ) {
                    scale = 0.1;
                }
                else if( this.to == "zoomIn" ) {
                    scale = 2;
                }
                tweenMax.to( nthFrame, time, {
                    scale : scale,
                    ease : ease,
                    onComplete : function () {
                        //setting scale back to normal i.e. 1
                        tweenMax.set( nthFrame, {
                            scale : 1
                        });
                        nthFrame.css({
                            "display" : "none"
                        });
                    }
                });
            }
        }
    };
	var functions = {
        init : function () {
        	functions.setCSS();
        	functions.fillArrayOfFrames();
        	functions.setBackground();
            functions.setControl();
            leftControl.css( "opacity", "0.5" );
            //hiding controls when automatic execution is enabled
            //since in that case there is no use of keyboard arrow keys
            if( options.automaticExecution == true ) {
                leftControl.css( "display", "none" );
                rightControl.css( "display", "none" );
                pauseDiv.css( "display", "none" );
            }
            else {
                pauseDiv.css( "display", "none" );
            }
        },
        setCSS : function () {
            $("html").css("height", "100%");
            $("body").css({
            	"height" : "100%",
            	"width" : "100%",
            	"margin" : 0,
            	"padding" : 0,
            	"overflow" : "hidden"
            });
            mainDiv.css({
            	"position" : "absolute",
            	"top" : 0,
            	"left" : 0,
            	"height" : "100%",
            	"width" : "100%",
            	"margin" : 0,
            	"padding" : "0",
            	"perspective" : "1000px",
            	"overflow" : "hidden",
            	"zIndex" : 2
            });
        	//styleing frame class
            frameClass.css({
                "position" : "absolute",
                "width" : "95%",
                "height" : "90%",
                "padding" : "0%",
                "color" : "#EEE",
                "overflow" : "hidden"/*,
                "boxShadow" : "0px 6px 8px rgba(0, 0, 0, 0.3)",
                "borderRadius" : ".4%"*/
            });
        },
        fillArrayOfFrames : function () {
            totalSlides = frameClass.length;
            for( var i = 0; i < totalSlides; i++ ) {
            	//selecting nt-child of frame and storing into array
            	var nthFrame = $( "div .frame:nth-child(" + ( i + 1 ) + ")" ),
            	    from = nthFrame.attr( "data-from" ) || "left",
            	    to = nthFrame.attr( "data-to" ) || "right",
                    styleIn = nthFrame.attr( "data-styleIn" ) || "normal",
                    styleOut = nthFrame.attr( "data-styleOut" ) || "normal",
            	    frame = new Frame( from, to, i, styleIn, styleOut );
            	arrayOfFrames.push( frame );
            	//hiding all the frames except first one
            	if( i > 0 ) {
            		nthFrame.css( "display", "none" );
            	}
            }
            functions.setIndicator();
            functions.start();
        },
        start : function () {
        	//execution of first slide
        	functions.executeNextSlide();
            if( options.automaticExecution == true ) {
            	slideShowOn = setInterval( function () {
            		if( pause == false ) {
            			//check if all the slides have been executed or not
            			if( executionOver == false ) {
            				functions.executeNextSlide();
            			}
            			else {
            				clearInterval(slideShowOn);
            			}
            		}
            	}, options.duration );
            }
        },
        executeNextSlide : function () {
            if( executionOver == false ) {
            	var frame;
            	if( currentSlideNumber != 0 ) {
            	    frame = arrayOfFrames[ currentSlideNumber - 1 ];
            	    frame.executeOut();
            	    frame = arrayOfFrames[ currentSlideNumber ];
            	    setTimeout( function () {
            	        frame.executeIn();
            	    }, options.inOutDuration );
            	}
            	//special case for first slide
            	else {
            		frame = arrayOfFrames[ currentSlideNumber ];
            		frame.executeIn();
            	}
            	currentSlideNumber ++;
            	if( currentSlideNumber == totalSlides ) {
            		executionOver = true;
            		console.log( "All slides executed" );
            	}
            	functions.setIndicatorForward();
                console.log( "Next" );
                keyPressControlFlag = 0;
                leftControl.css( "opacity", "0.5" );
                rightControl.css( "opacity", "0.5" );
                functions.activateKeyPressControlFlag();
            }
        },
        executePreviousSlide : function () {
        	var frame;
            if( currentSlideNumber > 1 ) {
            	frame = arrayOfFrames[ currentSlideNumber - 1 ];
            	frame.executeOut();
            	currentSlideNumber -= 2;
            	frame = arrayOfFrames[ currentSlideNumber ];
            	setTimeout( function () {
            	    frame.executeIn();
            	}, options.inOutDuration );
            	currentSlideNumber ++;
            	if( currentSlideNumber < totalSlides ) {
            		executionOver = false;
            	}
            	functions.setIndicatorBackward();
                console.log( "previous" );
                keyPressControlFlag = 0;
                leftControl.css( "opacity", "0.5" );
                rightControl.css( "opacity", "0.5" );
                functions.activateKeyPressControlFlag();
            }
        },
        activateKeyPressControlFlag : function () {
        	setTimeout( function () {
        		keyPressControlFlag = 1;
                if( currentSlideNumber > 1 ) {
                    leftControl.css( "opacity", "1" );
                }
                if( currentSlideNumber < totalSlides ) {
                    rightControl.css( "opacity", "1" );
                }
        	}, options.inOutDuration );
        },
        setBackground : function () {
        	//check if background div is present and proceed accordingly
        	var backgroundDiv = $( "#backgroundDiv" );
        	if( backgroundDiv.length == 1 ) {
        		console.log( "backgroundDiv is present" );
        		var bgColor = backgroundDiv.attr( "data-bgColor" );
        		backgroundDiv.css({
        			"position" : "absolute",
        			"top" : 0,
        			"left" : 0,
        			"height" : "100%",
        			"width" : "100%",
        			"margin" : 0,
        			"padding" : ".5%",
        			"perspective" : "500px",
        			"overflow" : "hidden",
        			"zIndex" : 1,
        			//"backgroundColor" : bgColor
        			"background" : "radial-gradient(circle farthest-corner at center center , #555A5F 0%," + bgColor + " 100%)"
        		});
        	}
        },
        setIndicator : function () {
        	indicatorDiv.css({
        		"position" : "absolute",
        		"top" : "99.4%",
        		"left" : 0,
        		"height" : ".6%",
        		"width" : "100%",
        		"margin" : 0,
        		"overflow" : "hidden",
        		"zIndex" : 3
        	});
        	//appending indicatorClass in indicatorDiv
        	for ( var i = 0; i < totalSlides; i++ ) {
        		indicatorDiv.append( "<div class='indicatorClass'></div>" )
        	}
        	indicatorClass = $( "#indicator .indicatorClass" );
        	//console.log( indicatorClass.length );
        	indicatorClass.css({
        		"position" : "absolute",
        		"top" : "0px",
        		"height" : "100%"
        	});
        	var widthOfIndicatorClass = 100 / totalSlides,
        	    nthIndicatorClass,
        	    leftOfIndicatorClass = 0;
        	for ( var i = 0; i < totalSlides; i++ ) {
        		nthIndicatorClass = $( "#indicator .indicatorClass:nth-child(" + ( i + 1 ) + ")" );
        		nthIndicatorClass.css({
        			"width" : widthOfIndicatorClass + "%",
        			"left" : leftOfIndicatorClass + "%",
        			"backgroundColor" : "silver"
        		});
        		leftOfIndicatorClass += widthOfIndicatorClass;
        	}
        },
        setIndicatorForward : function () {
        	currentIndicatorClassNumber ++ ;
            var nthIndicatorClass = 
                $( "#indicator .indicatorClass:nth-child(" + ( currentIndicatorClassNumber ) + ")" );
            nthIndicatorClass.css( "backgroundColor", "rgb(15, 111, 173)");
            //console.log(currentIndicatorClassNumber);
        },
        setIndicatorBackward : function () {
        	var nthIndicatorClass = 
        	    $( "#indicator .indicatorClass:nth-child(" + ( currentIndicatorClassNumber ) + ")" );
        	nthIndicatorClass.css( "backgroundColor", "silver");
        	currentIndicatorClassNumber --;
        	console.log(currentIndicatorClassNumber);
        },
        calculateTopAndLeft : function ( fromOrTo ) {
        	var topAndLeft = {
        		"top" : "",
        		"left" : ""
        	};
        	var top = -1, left = -1;
        	switch ( fromOrTo ) {
        		case "left" : 
        		    left = "-100%";
        		    top = "0%";
        		    break;
        		case "down" : 
        		    left = "0%";
        		    top = "100%";
        		    break;
        		case "right" : 
        		    left = "100%";
        		    top = "0%";
        		    break;
        		case "up" : 
        		    left = "0%";
        		    top = "-100%";
        		    break;
        		case "leftUp" : 
        		    left = "-100%";
        		    top = "-100%";
        		    break;
        		case "leftDown" : 
        		    left = "-100%";
        		    top = "100%";
        		    break;
        		case "rightDown" : 
        		    left = "100%";
        		    top = "100%";
        		    break;
        		case "rightUp" : 
        		    left = "100%";
        		    top = "-100%";
        		    break;
        		default : 
        		    ;
        	}
        	topAndLeft.top = top;
        	topAndLeft.left = left;
        	return topAndLeft;
        },
        setControl : function () {
            control.css({
                "position" : "fixed",
                "zIndex" : "10",
                "right" : "2%",
                "bottom" : "1%",
                "width" : "80px",
                "height" : "15%"
            });
            leftControl.css({
                "position" : "absolute",
                "left" : 0,
                "top" : "30%",
                "width" : 0,
                "height" : 0, 
                "border-width" : "12px 24px 12px 0px",
                "border-style" : "solid",               
                "border-color" : "transparent silver transparent transparent",
                "cursor" : "pointer"
            });
            rightControl.css({
                "position" : "absolute",
                "right" : 0,
                "top" : "30%",
                "width" : 0,
                "height" : 0,
                "border-width" : "12px 0px 12px 24px",
                "border-style" : "solid",
                "border-color" : "transparent transparent transparent silver",
                "cursor" : "pointer"
            });
            pauseDiv.css({
                "position" : "absolute",
                "left" : 0,
                "top" : "30%",
                "font-size" : "2em",
                "font-weight" : "bold"
            });
        }
    };
	/*windowObject.on( 'load', function () {
	});*/
	documentObject.on( 'ready', function () {
		functions.init();
        $( documentObject ).keydown( function (e) {
            if( e.keyCode == 32 ) {
                if( options.automaticExecution == true ) {
                    if( pause == false ) {
                        console.log( "pause" );
                        pauseDiv.css( "display", "block" );
                        pause = true;
                    }
                    else {
                        console.log( "play" );
                        pauseDiv.css( "display", "none" );
                        pause = false;
                    }
                }
            	e.preventDefault();
            }
            else if( e.keyCode == 37 && ( keyPressControlFlag == 1 ) ) {
                if( options.automaticExecution == false ) {
                    functions.executePreviousSlide();
                }
            	e.preventDefault();
            }
            else if( e.keyCode == 39 && ( keyPressControlFlag == 1 ) ) {
                if( options.automaticExecution == false ) {
                    functions.executeNextSlide();
                }
            	e.preventDefault();
            }
            //to prevent awkward behaviour on pressing up and down key
            else if( e.keyCode == 38 || e.keyCode == 40 ) {
            	e.preventDefault();
            } 
            
        });
        leftControl.click( function () {
            if( ( keyPressControlFlag == 1 ) && ( options.automaticExecution == false ) ) {
                functions.executePreviousSlide();
            }
        });
        rightControl.click( function () {
            if( ( keyPressControlFlag == 1 ) && ( options.automaticExecution == false ) ) {
                functions.executeNextSlide();
            }
        });
	});
} ( document, window, jQuery, TweenMax, TimelineMax ));