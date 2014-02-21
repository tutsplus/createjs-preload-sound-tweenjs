
$(document).ready(function() {
	createjs.Sound.registerPlugins([ createjs.HTMLAudioPlugin]); //Set plugin to use HTMLAudio 
	createjs.Sound.alternateExtensions = ["ogg"]; //If it cannot load .mp3 it will try to load .ogg instead
	var theMP3;
    var currentSong =0;
    var tracks = ["IntoxicatedRat","ForkedDeer","Hawaii"];
	var artists = ["John Doe", "Jane Doe", "Frank Doe"];
	var songIsPaused = false;
	var update;
	var vol = 1;
	var songIsPlaying = false;
	
	function setup(){
	$jScroller.add("#scroller_container","#scroller","left",2);
    $jScroller.cache.init = true; // Turn off default Event
    $jScroller.config.refresh = 100;
	 $( "#progressbar" ).progressbar({
			value: 0
		});
	playSound();
	}
   function playSound(){

		if(currentSong>=tracks.length){
			currentSong=0;
		}
		if(currentSong<0){
			currentSong = tracks.length-1;
		}
		    if(!songIsPlaying){
			theMP3 = createjs.Sound.play("./sounds/"+tracks[currentSong]+".mp3");
			theMP3.setVolume(vol);
			updateArtist();
			theMP3.on("complete",songFinishedPlaying,null,false);
		    update = setInterval(function(){updateUI()},20);
			songIsPlaying = true;
			}

		}
	
	function updateUI(){
		var duration = theMP3.getDuration();
        var pos = theMP3.getPosition();
        var songPosition = (pos/duration)*100;
	    $( "#progressbar" ).progressbar( "option", "value", songPosition);
		
		var time = pos/1000;
		var min = Math.floor(time/60);
		var minDisplay = (min<10) ? "0"+min : min;
		var sec = Math.floor(time%60);
		var secDisplay = (sec<10) ? "0"+sec : sec;
		var amountPlayed = minDisplay+":"+secDisplay;
						
						
		var timeduration = duration/1000;
		var minduration = Math.floor(timeduration/60);
		var minDisplay = (minduration<10) ? "0"+minduration : minduration;
		var secduration = Math.floor(timeduration%60);
		var secDisplay = (secduration<10) ? "0"+secduration : secduration;
		var totalDuration = minDisplay+":"+secDisplay; 
						
	 $("#time").text(amountPlayed + " / " + totalDuration);
	}
	
	function songFinishedPlaying(){
	    clearInterval(update);
		currentSong++;
		playSound();
		updateArtist();
	}
	
	
	
	function updateArtist(){
	$jScroller.stop();
	$("#scroller p").text(artists[currentSong] + " - " + tracks[currentSong] );
	$jScroller.reset();
	$jScroller.add("#scroller_container","#scroller","left",2);
	var t=setTimeout(startScroller,2000);
   }
	function startScroller(){
	   $jScroller.start();
    }
	
	
	$("#play_btn").click(function(){
		var thebutton = $(this);
		if(thebutton.attr("src")=="images/play_button.png"){
			thebutton.attr("src","images/play_selected.png");
		    }
			if(songIsPaused){
			  theMP3.resume();
			  songIsPaused = false;
			}else{
			  playSound();
			}
			startScroller();
		}).mouseover(function(){
			$(this).css("cursor","pointer");
	   });
	   
	$("#stop_btn").click(function(){
			theMP3.stop();
			$jScroller.stop();
			$("#play_btn").attr("src","images/play_button.png");
			$(this).attr("src","images/stop_selected.png");
			songIsPlaying = false;
		}).mouseover(function(){
		$(this).css("cursor","pointer");
		});
		
	$("#pause_btn").click(function(){
			$("#play_btn").attr("src","images/play_button.png");
			$(this).attr("src","images/pause_selected.png");
			if(songIsPlaying){
			theMP3.pause();
			songIsPaused = true;
			$jScroller.stop();
			}
		}).mouseover(function(){
		$(this).css("cursor","pointer");
		});
		
    $("#fwd_btn").click(function(){
			if(theMP3 !=undefined){
			theMP3.stop();
			currentSong++;
			songIsPlaying = false;
			playSound();
			updateArtist();
		   }
		}).mouseover(function(){
		$(this).css("cursor","pointer");
		});
		$("#back_btn").click(function(){
		   if(theMP3 != undefined){
			theMP3.stop();
			songIsPlaying = false;
			currentSong--;
			playSound();
			updateArtist();
			}
		}).mouseover(function(){
			$(this).css("cursor","pointer");
		});
		
		$("#volumebar").mousemove(function(e){
			
			var parentOffset = $(this).parent().offset();
			var relX = Math.floor(e.pageX - parentOffset.left);	  
			vol = Math.ceil( (relX-7)/10)-4;
			vol = vol/10;
			if(vol >=0.1&& vol <=1){
			$(this).attr("src","images/vb"+vol*10+".png");
				if(theMP3 != undefined){
				theMP3.setVolume(vol)
				}
			}
		}).mouseover(function(){
			$(this).css("cursor","pointer");
		});
});