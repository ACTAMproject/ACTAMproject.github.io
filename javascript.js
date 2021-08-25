var firebaseConfig = {
    apiKey: "AIzaSyAZMRSwtlcoSg5m5ChsdxfIaRB-8XK7VAU",
    authDomain: "vst---actam.firebaseapp.com",
    projectId: "vst---actam",
    storageBucket: "vst---actam.appspot.com",
    messagingSenderId: "618119157352",
    appId: "1:618119157352:web:64ff203054a220c23ecddd",
    measurementId: "G-WPR7FQSS9G"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore()


//initial alert
alert('press one knob to resume audio context');

//Inizializing all the synths from Tone.js

const synth = new Tone.Synth();
const harmSynth1 = new Tone.Synth();
const harmSynth2 = new Tone.Synth();

const PolySynth = new Tone.PolySynth(Tone.AMSynth);
const harmPolySynth1 = new Tone.PolySynth(Tone.AMSynth);
const harmPolySynth2 = new Tone.PolySynth(Tone.AMSynth);

const FMsynth = new Tone.FMSynth();
const harmFMsynth1 = new Tone.FMSynth();
const harmFMsynth2 = new Tone.FMSynth();

var audioContext= new AudioContext();
var oscillator_2;
var min=document.getElementById("oscillator_1").min;
var max=document.getElementById("oscillator_1").max;



/*Effect blocks used in previous version that are no longer used


/*const chorus = new Tone.Chorus(4, 2.5, 0.5);*/

/*const dist = new Tone.Distortion(0.4);

const tremolo = new Tone.Tremolo(9, 0.75);*/
/*console.log(PolySynth.maxPolyphony)*/

/*const Reverb = new Tone.Reverb(decay=17,wet=0.5); /*connect(pingPong);*/
/*Reverb.wet = 0.9*/

/*const pingPong = new Tone.PingPongDelay("8n", 0.3); /*.connect(filter);*/


const Mono = new Tone.Mono (); /*stereo audio to mono*/
const merge = new Tone.Merge(); 

const filter = new Tone.Filter(920, "lowpass").toDestination();
/*var split = new Tone.Split();
stereoSignal.connect(split);*/

synth.connect(merge, 0, 0);
synth.volume.value = -7;
harmSynth1.connect(merge, 0, 0);
harmSynth1.volume.value = -12;
harmSynth2.connect(merge, 0, 0);
harmSynth2.volume.value = -25;

PolySynth.connect(merge, 0, 1);
PolySynth.volume.value = -7;
harmPolySynth1.connect(merge, 0, 1);
harmPolySynth1.volume.value = -12;
harmPolySynth2.connect(merge, 0, 1);
harmPolySynth2.volume.value = -20;

FMsynth.connect(merge, 0, 1);
FMsynth.volume.value = -7;
harmFMsynth1.connect(merge, 0, 1);
harmFMsynth1.volume.value = -12;
harmFMsynth2.connect(merge, 0, 1);
harmFMsynth2.volume.value = -25;

merge.connect(Mono)
/*merge.chain(Mono, chorus, Reverb, pingPong), Not used in this implementation*/

synth.triggerAttackRelease("C4", "32n");
PolySynth.triggerAttackRelease("C4", "32n");
FMsynth.triggerAttackRelease("C4", "32n");





const whitekeys = Array.from(document.getElementsByClassName("WK"));
const blackkeys = Array.from(document.getElementsByClassName("BK"));
const arr_right = document.getElementById("button_right");
const arr_left = document.getElementById("button_left");

model = Array(16).fill(false)
pads = document.querySelectorAll(".pad");
const dial = Array.from(document.getElementsByClassName("knob"));
let bpm = 120;


function playing(event) {
    //console.log(event.target);
    //console.log(event.type);

    if(event.type == "mousedown") {
        event.target.classList.add("playing");
        instr[instr_index].triggerAttack(event.target.id,Tone.now());
    }
    else {
        whitekeys.forEach( function(key) {
            key.classList.remove("playing");
        });
        blackkeys.forEach( function(key) {
            key.classList.remove("playing");
        });
        /*if it is not the polyphonic one*/
        if (instr_index !== 1) {
            instr[instr_index].triggerRelease(Tone.now());
        }
        /*if it is*/
        else {instr[instr_index].triggerRelease(event.target.id,Tone.now())}
    }
}


whitekeys.forEach( function(key) {
    key.addEventListener("mousedown",playing);
});

whitekeys.forEach( function(key) {
    key.addEventListener("mouseup",playing);
});

blackkeys.forEach( function(key) {
    key.addEventListener("mousedown",playing);
});

blackkeys.forEach( function(key) {
    key.addEventListener("mouseup",playing);
});





function render() {
    pads.forEach(function(pad, index) {
      pad.classList.toggle("selected", model[index]);
      const audioEl= pad.getElementsByTagName("audio")[0];
      if(model[index]){
      audioEl.currentTime=0;
      audioEl.playbackRate = bpm/120;
      console.log(audioEl.playbackRate);
      audioEl.play();
      }
      else{
          audioEl.pause();
      }
    })
};

function click_assignment (pad, index) {
    pad.onclick = function() {
      model[index] = !model[index];
      render();
    }
};
pads.forEach(click_assignment);


//LOAD and SAVE pads buttons
  
function load_model(doc) {
    model = doc.data().preset
    render();
}

load.addEventListener("mousedown",
    function(id="load") {
        db.collection("vst").doc("pads").get().then(load_model);
        const x = document.getElementById("load");
        x.classList.add("synth_selected");
    }
);

save.addEventListener("mousedown",
    function() {
        db.collection("vst").doc("pads").set({preset: model});
        const x = document.getElementById("save");
        x.classList.add("synth_selected");
    }
);

load.addEventListener("mouseup",
    function() {
        const x = document.getElementById("load");
        x.classList.remove("synth_selected");   
    }
);

save.addEventListener("mouseup",
    function() {
        const x = document.getElementById("save");
        x.classList.remove("synth_selected");   
    }
);


// rendering of the bottom synth's buttons

var synthButton_model = [true, false, false];
const synths = Array.from(document.getElementsByClassName("synths_button"));

const instr = [synth,PolySynth,FMsynth];
const harmInstr1 = [harmSynth1,harmPolySynth1,harmFMsynth1];
const harmInstr2 = [harmSynth2,harmPolySynth2,harmFMsynth2];
var instr_index = 0;

function SynthButtonRender() {
    synths.forEach(function(synth,index) {
        synth.classList.toggle("synth_selected",synthButton_model[index]);
    })
};

function synth_clicked(synth,index) {
    synth.onclick = function() {
        synthButton_model.fill(false);
        synthButton_model[index] = true;
        instr_index = index;

        SynthButtonRender();
    }
};


const bpm_display=document.getElementById("bpm-display");

function setBpm() {
    bpm_display.textContent= bpm;
    render();
};
function setNoBpm(){
    bpm_display.textContent='';
};
let bpmFn= setBpm;
arr_right.addEventListener('click', ()=> {
    bpm=bpm+1
    bpmFn();
});
arr_left.addEventListener('click', ()=> {
    bpm=bpm-1
    bpmFn();
 });

setBpm();

 /* Toggle switch */
 
var toggleBtn = document.getElementById('toggle-btn');
toggleBtn.onclick = function() {
    this.classList.toggle('toggle-btn--dark');
    document.body.classList.toggle('dark-mode');
    if (this.classList == 'toggle-btn--dark') {
        alert('MIDI keyboard required for harmonizer');
        bpm_display.textContent = scaleType.substring(0,3);
    }
    else {
        setBpm();
    };
    bpmFn= bpmFn === setBpm ? setNoBpm : setBpm;
};

var toggleBtn_complex = document.getElementById('toggle-btn_sc');
toggleBtn_complex.onclick = function() {
    this.classList.toggle('toggle-btn_sc--dark');
    document.body.classList.toggle('dark-mode');
};





synths.forEach(synth_clicked);

SynthButtonRender();

 
// connect midi keyboard

WebMidi.enable(function (err) {

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
    }
    
    var MIDIinput = WebMidi.inputs[0];
    console.log(MIDIinput);

    MIDIinput.addListener('noteon',"all",
        function(e){
            if (toggleBtn.classList == 'toggle-btn--dark') {
                if (e.note.octave < 4) {
                    updateAddHarmVec(e);
                }
                else {
                    playHarmMIDI(e);
                }
            }
            
            else playnoteMIDI(e);

        })

    MIDIinput.addListener('noteoff',"all",
        function(e){
            if (toggleBtn.classList == 'toggle-btn--dark') {
                if (e.note.octave < 4) {
                 updateRemoveHarmVec(e);
                }
                else stopHarmMIDI(e);
            }

            else stopnoteMIDI(e);

        })

});

const harmVec = new Array();
var boolChord = new Array();
var scaleType = 'ionian';

function updateAddHarmVec(e) {
    harmVec[harmVec.length] = e.note.name;

    /* we can consider a chord if harmVec has more than 3 notes */
    if (harmVec.length > 3) {
        chordLab();     /*the function is in the harmonizer part of the code*/
    }
}

function updateRemoveHarmVec(e) {
    const index = harmVec.indexOf(e.note.name);
    harmVec.splice(index,1);

    if (harmVec.length > 3) {
        chordLab();       
    }
    /*console.log(harmVec);*/
}



//Functions to play when MIDI is used

function playnoteMIDI(e) {
    var noteon = e.note.name + e.note.octave
    /*console.log(noteon);*/                                               

    instr[instr_index].triggerAttack(noteon,Tone.now());

    document.getElementById(noteon).classList.add("playing");

};

function stopnoteMIDI(e){
    var noteoff = e.note.name + e.note.octave
    /* if not PolySynth */
    if (instr_index !== 1) {
        instr[instr_index].triggerRelease(Tone.now());
    }
    /* if PolySynth */
    else {instr[instr_index].triggerRelease(noteoff,Tone.now())}
    /*instr[instr_index].triggerRelease(Tone.now());*/

    document.getElementById(noteoff).classList.remove("playing");
};

//array that contains the different intervals used to harmonize in the different scales
const harmInter1 = [5,6,6,4,6,6,4];
const harmInter2 = [7,4,3,6,7,3,6];

//function used when harmonizer is ON
function playHarmMIDI(e){

    var playFund = e.note.name + e.note.octave;
    
    var playHarm1 = harmonicNotes(e,harmInter1[scaleIndex],1);  
    console.log(playHarm1);

    if (toggleBtn_complex.classList == 'toggle-btn_sc--dark'){
        var playHarm2 = harmonicNotes(e,harmInter2[scaleIndex],2);
        console.log(playHarm2);

        instr[instr_index].triggerAttack(playFund,Tone.now());
        harmInstr1[instr_index].triggerAttack(playHarm1,Tone.now());
        harmInstr2[instr_index].triggerAttack(playHarm2,Tone.now());
    }
    else{
        instr[instr_index].triggerAttack(playFund,Tone.now());
        harmInstr1[instr_index].triggerAttack(playHarm1,Tone.now());
    }

    document.getElementById(playFund).classList.add("playing");
};

function stopHarmMIDI(e){

    var stopFund = e.note.name + e.note.octave;

    document.getElementById(stopFund).classList.remove("playing");

    if(instr_index != 1) {
        instr[instr_index].triggerRelease(Tone.now());
        harmInstr1[instr_index].triggerRelease(Tone.now());
        harmInstr2[instr_index].triggerRelease(Tone.now());
    }
    else {
        var stopHarm1 = harmonicNotes(e,harmInter1[scaleIndex],1);
        var stopHarm2 = harmonicNotes(e,harmInter2[scaleIndex],2);
        //console.log(stopHarm1);
        harmInstr2[instr_index].triggerRelease(stopHarm2,Tone.now());
        harmInstr1[instr_index].triggerRelease(stopHarm1,Tone.now());
        instr[instr_index].triggerRelease(stopFund,Tone.now());
    }

}



/* OSCILLATORS */

  /*render()*/

var oscillator_12_starter=false;
var osc
var osc12
var osc22
var osc22_starter=true
var osc2
var valOsc;
var valOsc2;
function changeEventHandler(e, event){
    if (osc12 && oscillator_12_starter===true) {
        osc12.stop()
    }

    console.log(440 + e.value * 10)
    oscillator_12_starter=true
    if(valOsc===0){
    osc12 = new Tone.Oscillator(440 + e.value * 10, "sine").toMaster().start();
    bpm_display.textContent=440+e.value*10;
    setTimeout(() => {
        oscillator_12_starter=false
        console.log('5 s', osc)
       osc12.stop() 
    }, 5000);
    }
    if(valOsc===50){
        osc12 = new Tone.Oscillator(440 + e.value * 10, "square").toMaster().start();
        bpm_display.textContent=440+e.value*10;
        setTimeout(() => {
            oscillator_12_starter=false
            console.log('5 s', osc)
           osc12.stop() 
        }, 5000);
    }
    if(valOsc===100){
        osc12 = new Tone.Oscillator(440 + e.value * 10, "sawtooth").toMaster().start();
        bpm_display.textContent=440+e.value*10;
        setTimeout(() => {
            oscillator_12_starter=false
            console.log('5 s', osc)
           osc12.stop() 
        }, 5000);
    }

};
function changeValueHandler(e){
    console.log("clicked", e.value);
    if(Number(e.value)===100){
        e.value=0;
        valOsc=Number(e.value)
        if (osc) osc.stop()
        osc = new Tone.Oscillator(440, "sine");
        bpm_display.textContent="sine";
        
    }
    else if(Number(e.value)===50){
        e.value=100;
        valOsc=Number(e.value)
        if (osc) osc.stop()
        osc=new Tone.Oscillator(440, "square");
        bpm_display.textContent="square";
    }
    else{
        e.value=50;
        valOsc=Number(e.value)
        if (osc) osc.stop()
        osc = new Tone.Oscillator(440, "sawtooth");
        bpm_display.textContent="saw";
    }
};

function changeEventHandlerOsc22(e, event){
    if (osc22 && oscillator_22_starter===true) {
        osc22.stop()
    }

    console.log(440 + e.value * 10)
    oscillator_22_starter=true
    if(valOsc2===0){
    osc22 = new Tone.Oscillator(440 + e.value * 20, "sine").toMaster().start();
    bpm_display.textContent=440+e.value*20;
    setTimeout(() => {
        oscillator_22_starter=false
        console.log('5 s', osc)
       osc22.stop() 
    }, 5000);
    }
    if(valOsc2===50){
        osc22 = new Tone.Oscillator(440 + e.value * 20, "square").toMaster().start();
        bpm_display.textContent=440+e.value*20;
        setTimeout(() => {
            oscillator_22_starter=false
            console.log('5 s', osc)
           osc22.stop() 
        }, 5000);
    }
    if(valOsc2===100){
        osc22 = new Tone.Oscillator(440 + e.value * 20, "sawtooth").toMaster().start();
        bpm_display.textContent=440+e.value*20;
        setTimeout(() => {
            oscillator_22_starter=false
            console.log('5 s', osc)
           osc22.stop() 
        }, 5000);
    }

};

function changeValueHandlerOsc2(e){
    console.log("clicked", e.value);
    if(Number(e.value)===100){
        e.value=0;
        valOsc2=Number(e.value)
        if (osc2) osc2.stop()
        osc2 = new Tone.Oscillator(880, "sine");
        bpm_display.textContent="sine";
    }
    else if(Number(e.value)===50){
        e.value=100;
        valOsc2=Number(e.value)
        if (osc2) osc2.stop()
        osc2=new Tone.Oscillator(880, "square");
        bpm_display.textContent="square";
    }
    else{
        e.value=50;
        valOsc2=Number(e.value)
        if (osc) osc.stop()
        osc2 = new Tone.Oscillator(880, "sawtooth");
        bpm_display.textContent="saw";
    }
};



/* ARPEGGIATOR */
var newFreq;

function changeFrequency(e){
    synth.toDestination();
    if(Number(e.value)==0){
        e.value=50;
        var pattern = new Tone.Pattern(function(time,note){
            synth.triggerAttackRelease(note, 0.25);
    }, ["F4", "G4", "A#4", "C4", "D4"]);
    pattern.playbackRate=2;
    pattern.start(0);
    Tone.Transport.start()
    bpm_display.textContent="F4";
    }
    else if(Number(e.value)==50){
        e.value=100;
        Tone.Transport.pause();
        var pattern = new Tone.Pattern(function(time,note){
            synth.triggerAttackRelease(note, 0.25);
    }, ["G4", "A4", "B4", "C4", "D4"]);
    pattern.playbackRate=2;
    pattern.start(0);
    Tone.Transport.start()
    bpm_display.textContent="G4";
    }
    else{
        e.value=0;
        Tone.Transport.pause();
        bpm_display.textContent='';
    }
}

function changeArpeggiator(e){
    synth.toDestination();
    if(Number(e.value)==0){
        e.value=50;
        var pattern = new Tone.Pattern(function(time,note){
            synth.triggerAttackRelease(note, 0.25);
    }, ["C4", "D4", "E4", "G4", "A4"]);
    pattern.playbackRate=2;
    pattern.start(0);
    Tone.Transport.start()
    bpm_display.textContent="C4";
    }
    else if(Number(e.value)==50){
        e.value=100;
        Tone.Transport.pause();
        var pattern = new Tone.Pattern(function(time,note){
            synth.triggerAttackRelease(note, 0.25);
    }, ["D4", "G4", "A4", "B4", "C#4"]);
    pattern.playbackRate=2;
    pattern.start(0);
    Tone.Transport.start();
    bpm_display.textContent="D4";
    }
    else{
        e.value=0;
        Tone.Transport.pause();
        bpm_display.textContent='';
    }
    
};




/* EFFECTS */

function changeValueFx(e){
    console.log("clicked", e.value);
    if(Number(e.value)===100){
        e.value=0;

        /*const pingPong = new Tone.PingPongDelay("8n", 0.3).toDestination(); /*.connect(filter); USED IN PREVIOUS IMPLEMENTATIONS*/

        Mono.disconnect()
        Mono.toDestination();


        /*instr[instr_index].triggerAttackRelease("E4", "32n"); OR*/
        synth.triggerAttackRelease(0.05);
        PolySynth.triggerAttackRelease(0.05);
        FMsynth.triggerAttackRelease(0.05);
        
        
        
    }
    else if(Number(e.value)===50){
        e.value=100;
        const dist = new Tone.Distortion(0.9).toDestination();
        
        /*const freeverb1 = new Tone.Freeverb().toDestination(); USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN
        freeverb1.dampening = 1000*/

        /*const reverb1 = new Tone.JCReverb(0.4).toDestination(); USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN

        /*const delay = new Tone.FeedbackDelay(0.5); USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN*/

        Mono.disconnect();
        Mono.connect(dist);
        
        synth.triggerAttackRelease(0.05);
        PolySynth.triggerAttackRelease(0.05);
        FMsynth.triggerAttackRelease(0.05);
        /*OR instr[instr_index].triggerAttackRelease("A4", "8n");*/
        

    }
    else{
        e.value=50;

        const pingPong = new Tone.PingPongDelay("8n", 0.3).toDestination(); /*.connect(filter);*/

        /*const freeverb = new Tone.Freeverb().toDestination(); USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN*/
        /*freeverb.dampening = 1000;*/
        
        Mono.disconnect();
        Mono.connect(pingPong);
               
        synth.triggerAttackRelease(0.05);
        PolySynth.triggerAttackRelease(0.05);
        FMsynth.triggerAttackRelease(0.05);
        
        

    }
};

function changeValueFx2(e){
    console.log("clicked", e.value);
    if(Number(e.value)===100){
        e.value=0;

        /*const phaser = new Tone.Phaser({
            frequency: 15,
            octaves: 5,
            baseFrequency: 1000
        }).toDestination();      USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN*/
    
        /*const pingPong = new Tone.PingPongDelay("8n", 0.3).toDestination(); USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN*/

        const filter = new Tone.Filter(920, "lowpass").toDestination();
        
        Mono.disconnect();
        Mono.connect(filter);
        
        synth.triggerAttackRelease(0.05);
        PolySynth.triggerAttackRelease(0.05);
        FMsynth.triggerAttackRelease(0.05);
        /*OR
        synth.triggerAttackRelease("E3", "2n");
        PolySynth.triggerAttackRelease("E3", "2n");
        FMsynth.triggerAttackRelease("E3", "2n");
        */
        
        
    }
    else if(Number(e.value)===50){
        e.value=100;
    
        const dist = new Tone.Distortion(0.9).connect(filter);
        /*const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();   USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN*/

        Mono.disconnect();
        Mono.connect(dist);
              
        synth.triggerAttackRelease(0.05);
        PolySynth.triggerAttackRelease(0.05);
        FMsynth.triggerAttackRelease(0.05);
     
    }
    else{
        e.value=50;

        const pingPong = new Tone.PingPongDelay("8n", 0.3).connect(filter); /*.connect(filter);*/
        
        /*const freeverb = new Tone.Freeverb().toDestination(); USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN*/
        /*freeverb.dampening = 1000;*/

        /*const dist = new Tone.Distortion(0.8).toDestination(); USED IN PREVIOUS IMPLEMENTATIONS - CAN BE ADDED TO THE CHAIN*/
        
        Mono.disconnect();
        Mono.connect(pingPong);
      
        synth.triggerAttackRelease(0.05);
        PolySynth.triggerAttackRelease(0.05);
        FMsynth.triggerAttackRelease(0.05);
        
    }
};
/* end - EFFECTS */







/*HARMONIZER PART ':)*/
var scale = [1,0,1,0,1,1,0,1,0,1,0,1]; //the harmonizer is inizialized at C IONIAN scale

const chromScale = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const scaleTypes = ['ionian','dorian','phryg','lydian','myxol','aeol','locrian'];
var scaleIndex = 0;

var harmChord = nj.zeros([1,12]);
/*console.log('harmChord')
console.log(harmChord)*/


/*CREATE THE TEMPLATE MATRIXES OF CHORDS AND SCALES CONTAINING ALL TYPES OF SCALE*/ 
var nScales = 7;
var nNotes = 12;
/*var templateMatrix = nj.zeros([12,1]);
console.log(templateMatrix);*/
var templateMatrix = nj.array([1,0,0,0,1,0,0,1,0,0,0,1]).reshape(12,1);
var completeScaleMatrix = nj.array([1,0,1,0,1,1,0,1,0,1,0,1]).reshape(12,1);

function templateMatrixCreation() {

    var ionianTemplate = nj.array([1,0,0,0,1,0,0,1,0,0,0,1]);   /* [1,0,0,0,1,0,0,1,0,0,0,1] */
    var ionianScale = nj.array([[1,0,1,0,1,1,0,1,0,1,0,1]]);
    ionianTemplate = shiftTemplate(ionianTemplate.reshape(1,12));
    ionianScale = shiftTemplate(ionianScale.reshape(1,12));
   /* console.log('ionian template')
    console.log(ionianTemplate.selection.data)*/
    insertScale(ionianTemplate.reshape(1,12),1,false);
    insertScale(ionianScale.reshape(1,12),1,true);

    var dorianTemplate = nj.array([1,0,0,1,0,0,0,1,0,0,1,0]);
    var dorianScale = nj.array([1,0,1,1,0,1,0,1,0,1,1,0])   /* [1,0,0,1,0,0,0,1,0,0,1,0] */
    insertScale(dorianTemplate.reshape(1,12),0,false);
    insertScale(dorianScale.reshape(1,12),0,true);

    var phrygianTemplate = nj.array([1,1,0,0,0,1,0,1,0,0,1,0]);  /* [1,1,0,0,0,1,0,0,1,0,1,0] */  /* susb9 chord */
    var phrygianScale = nj.array([1,1,0,1,0,1,0,1,1,0,1,0]);
    insertScale(phrygianTemplate.reshape(1,12),0,false);
    insertScale(phrygianScale.reshape(1,12),0,true);

    var lydianTemplate = nj.array([1,0,0,0,1,0,1,1,0,0,0,1]);  /*[1,0,0,0,1,0,1,1,0,0,0,1] */
    var lydianScale = nj.array([1,0,1,0,1,0,1,1,0,1,0,1]);
    insertScale(lydianTemplate.reshape(1,12),0,false);
    insertScale(lydianScale.reshape(1,12),0,true);

    var myxolydianTemplate = nj.array([1,0,0,0,1,0,0,1,0,0,1,0]);  /* [1,0,0,0,1,0,0,1,0,0,1,0] */
    var myxolydianScale = nj.array([1,0,1,0,1,1,0,1,0,1,1,0]);
    insertScale(myxolydianTemplate.reshape(1,12),0,false);
    insertScale(myxolydianScale.reshape(1,12),0,true);

    var aeolianTemplate = nj.array([1,0,0,1,0,0,0,1,1,0,1,0]);  /* [1,0,0,1,0,0,0,1,1,0,1,0] */
    var aeolianScale = nj.array([1,0,1,1,0,1,0,1,1,0,1,0]);
    insertScale(aeolianTemplate.reshape(1,12),0,false);
    insertScale(aeolianScale.reshape(1,12),0,true);

    var locrianTemplate = nj.array([1,0,0,1,0,0,1,0,0,0,1,0]);   /* [1,0,0,1,0,0,1,0,0,0,1,0] */
    var locrianScale = nj.array([1,1,0,1,0,1,1,0,1,0,1,0]);
    insertScale(locrianTemplate.reshape(1,12),0,false);
    insertScale(locrianScale.reshape(1,12),0,true);
} 

//function that insert the scale template given at the input in the template matrix 
// and prepare the next vector to insert
function insertScale(template,flag,completeMatrix) {
    var idx;
    /*console.log(template);*/
    if(!completeMatrix){
        for(idx=0; idx < nNotes-flag; idx++) {
            templateMatrix = nj.concatenate(templateMatrix,template.reshape(12,1))
            /*console.log('template')
            console.log(template.selection.data);*/
            template = shiftTemplate(template);      
        }
    }
    else {
        for(idx=0; idx < nNotes-flag; idx++) {
            completeScaleMatrix = nj.concatenate(completeScaleMatrix,template.reshape(12,1))
            /*console.log('template')
            console.log(template.selection.data);*/
            template = shiftTemplate(template);      
        }
    }
    /*console.log('template matrix')
    console.log(templateMatrix);*/
}

function shiftTemplate(oldTemplate) {
    var k = 0 ;
    var shiftedTemplate = nj.zeros([1,12]);
    /*console.log('zero template')
    console.log(shiftedTemplate.selection.data)*/
    /*console.log('old template')
    console.log(oldTemplate.selection.data)*/
    var newFirstValue = oldTemplate.get(0,11);
    /*console.log('last value')
    console.log(newLastValue)*/

    for(k=0; k < nNotes-1; k++ ) {
        
        shiftedTemplate.set(0,k+1,oldTemplate.get(0,k));
        /*console.log(shiftedTemplate.get(0,k));*/
    }
    shiftedTemplate.set(0,0,newFirstValue);

    /*console.log('shifted template')
    console.log(shiftedTemplate.selection.data);*/

    const newTemplate = shiftedTemplate.clone();

    return newTemplate ;
}

templateMatrixCreation();


/*I visualize the columns of the template matrix*/

var templateMatrixT = templateMatrix.T;  /*transpose the template matrix*/
var matrix = templateMatrixT.tolist()

var completeScaleMatrixT = completeScaleMatrix.T; 
var scaleMatrix = completeScaleMatrixT.tolist();
/*console.log(matrix)*/

/*console.log(templateMatrix)*/

function chordLab(){
    console.log(harmVec);
    notesToArray(harmVec);   /*func notesToArray at line 912*/
    /*console.log(harmChord.selection.data);*/

    scaleType = scaleTypeRecognition(harmChord.selection.data);
    bpm_display.textContent = scaleType.substring(0,3);
    console.log(scaleType);
}

function notesToArray(notes) {
    var i = 0;
    var noteIndex;
    var chordNote;
    harmChord = nj.zeros([1,12]);

    for(i=0; i < notes.length; i++) {
        chordNote = notes[i];
        noteIndex = chromScale.indexOf(chordNote);
        harmChord.set(0,noteIndex,1);
    }

    /*console.log(harmChord.selection.data);*/
}

/* function that given the chord recognizes the scale type and the starting note */
function scaleTypeRecognition(chord) {
    var scaleTemplate = []
    var similarityValues = new Array(matrix.length);
     
    var k = 0;
    var h = 0;
    var sum = 0;
    var max = 0;
    var maxIndex;
    var startNoteIdx;

    for(k=0; k<matrix.length; k++) {
        sum = 0;
        scaleTemplate = matrix[k];

        for(h=0; h<scaleTemplate.length; h++) {
            sum += scaleTemplate[h]*chord[h];
        }

        /*console.log(
            scaleTemplate.reduce((a, b) => a + b, 0)
        );*/

        similarityValues[k] = sum / Math.max(chord.reduce((a, b) => a + b, 0), scaleTemplate.reduce((a, b) => a + b, 0));       /*i normalize the value of sum*/
    }

    max = Math.max(...similarityValues);
    maxIndex = similarityValues.indexOf(max);
    console.log(matrix[maxIndex]);

    scale = scaleMatrix[maxIndex];

    scaleIndex = Math.floor(maxIndex/12);
    startNoteIdx = maxIndex % 12;

    /*console.log('scale type')
    console.log(scaleTypes[scaleIndex]);*/

    console.log('starting note')
    console.log(chromScale[startNoteIdx]);
    console.log(scaleIndex);

    return scaleTypes[scaleIndex];
}  


// Calculating the harmonic notes

function harmonicNotes(event,interval,complex) {
    var noteName = event.note.name;
    var noteOctave = event.note.octave;
    var harmOctave = noteOctave;
    var startIndex = chromScale.indexOf(noteName);
    const harmInterval = interval;

    var intervalCount = 1;
    var index = startIndex;
    var found = false;
    while(!found){
        index = ++index;
        if(index > nNotes-1){
            index = index % nNotes;
            harmOctave = ++harmOctave;
        }

        if(scale[index]){
            intervalCount = ++intervalCount;

            if(intervalCount==harmInterval) found = true;
        }
    }

    if(complex==2) harmOctave=++harmOctave;
    var harmNoteName = chromScale[index];
    var harmNote = harmNoteName + harmOctave;
    // console.log(harmNote);
    
    return harmNote;
}
