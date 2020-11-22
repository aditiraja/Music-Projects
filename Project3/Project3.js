//Declaring all of the variables that will be used.
var loopBeat;
var bass, cymbal, kick, autoFilter, oscillator;
var counter, counter2, counter3;
var chebyshev, pluck;
var chorus, synth;
var melody;
var x, y, rad1, rad2;

//This function is to set up all of the instruments and effects I am using for the piece as well as the canvas for the animation.
function setup() {
  //This is creating the canvas and assigning values to all of the variables being used.
  createCanvas(720, 400);
  // Starts in the middle
  x = width / 2;
  y = height / 2;
  rad1 = 1;
  rad2 = 1;
  
  //This counter is used to determine when the drums are played
  counter = 0;
  //This counter is used to switch between the two synth chords in the background
  counter2 = 0;

  //This MembraneSynth object is used for the bass drums
  bass = new Tone.MembraneSynth().toMaster();

  //This MetalSynth object is used for the cymbals with the parameters altered from the default.
  cymbal = new Tone.MetalSynth({
    frequency: 50,
    envelope: {
      attack: 0.01,
      decay: 0.3,
      release: 0.6
    },
    harmonicity: 6.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).toMaster();

  //This MembraneSynth object is used for the kick drum with the parameters altered from the default.
  kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
      attackCurve: 'exponential'
    }
  }).toMaster();

  //This object is a Chebyshev waveshaper which provides a distortion effect.
  chebyshev = new Tone.Chebyshev(10).toMaster();

  //This a PluckSynth object that is connected to the Chebyshev effect
  pluck = new Tone.PluckSynth({
    volume: 2,
    attackNoise: 0.4,
    dampening: 1000,
    resonance: 1
  }).connect(chebyshev).toMaster();
  pluck.volume.value = -8;

  //This object provides a stereo chorus effect.
  chorus = new Tone.Chorus(4, 2.5, 0.5);

  //This is a PolySynth object connected to the chorus effect.
  synth = new Tone.PolySynth(5, Tone.Synth, {
    oscillator: {
      type: "fatsawtooth"
    }
  }).connect(chorus).toMaster();

  //This is a PolySynth object used for the melody notes.
  melody = new Tone.PolySynth(5, Tone.Synth, {
    oscillator: {
      volume: 4,
      type: "sine"
    }
  }).connect(chorus).toMaster();
  
  loopBeat = new Tone.Loop(song, '16n');
  Tone.Transport.bpm.value = 80;
  Tone.Transport.start();
  loopBeat.start(0);
}

//This is the actual piece where all of the objects are triggered.
function song(time) {
  // These if statements determine when the bass, kick, and cymbals are played.
  if (counter % 16 === 0 || counter % 16 === 5 || counter % 16 === 5 || counter % 4 === 3 || counter % 16 === 13 || counter % 16 === 14) {
    bass.triggerAttackRelease('E1', '8n', time, 1);
  }

  if (counter % 16 === 4 || counter % 16 === 12) {
    kick.triggerAttackRelease('G3', '16n', time, 0.3);
    cymbal.triggerAttackRelease('16n', time, 0.1);
  }

  pluck.triggerAttackRelease("E2", "16n", time, 0.05);
  
  //These if statements determine when the notes of the melody are played.
  if (counter % 16 === 13) {
    melody.triggerAttackRelease("A4", "16n", time, 1);
  }
  if (counter % 16 === 14) {
    melody.triggerAttackRelease("G4", "16n", time, 1);
  }
  if (counter % 16 === 15) {
    melody.triggerAttackRelease("F#4", "16n", time, 1);
  }
  if (counter % 16 === 0 && counter2 == 0) {
    melody.triggerAttackRelease("F#4", "16n", time, 1);
  }
  if (counter % 16 === 0 && counter2 == 1) {
    melody.triggerAttackRelease("G4", "16n", time, 1);
  }
  
  
  if (counter3 > 5) {
    pluck.volume.value = -10;
  }
  counter = (counter + 1) % 16;
  
  //These if statements are to determine when to switch between the two chords.
  if (counter2 === 0) {
    synth.triggerAttackRelease(["C3", "E3", "Gb3"], "8n", time, 0.2);
    if (counter === 0) {
      counter2 = 1;
    }
  } else {
    synth.triggerAttackRelease(["C3", "E3", "G3"], "8n", time, 0.2);
    if (counter === 0) {
      counter2 = 0;
    }
  }
  counter3 = counter3 + 1;
}

//This is where the animation happens.
function draw() {
  background(200);
  
  // Draw a circle
  stroke(50);
  fill(50);
  ellipse(x, y, rad1, rad2);
  
  //Make circle bigger or smaller depending on the chord being played.
  if (counter2 == 0) {
    rad1 = rad1 + 1;
    rad2 = rad2 + 1;
  }
  if (counter2 == 1) {
    rad1 = rad1 - 1;
    rad2 = rad2 - 1;
  }
  
}
