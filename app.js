var midi = null;  // global MIDIAccess object
var inputs = null;
var SPEAD = 0.9;

function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;
  inputs = midi.inputs;
  inputs.forEach(function(input){
      input.onmidimessage = onMIDIMessage;
  });
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

function listInputsAndOutputs( midiAccess ) {
  for (var input in midiAccess.inputs) {
    console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'" );
  }

  for (var output in midiAccess.outputs) {
    console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'" );
  }
}

function onMIDIMessage( event ) {
  var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
  for (var i=0; i<event.data.length; i++) {
    str += event.data[i] + " ";
  }
  console.log(event.data[2] / 127 * 2 - 1);
  if(event.data[1] == 16){
      pepper.motion.changeAngles('LShoulderPitch', event.data[2] / 127 * 2 - 1, SPEAD);
  }
  if(event.data[1] == 17){
      pepper.motion.changeAngles('LShoulderRoll', event.data[2] / 127 * 2 - 1, SPEAD);
  }
  if(event.data[1] == 18){
      pepper.motion.changeAngles('LElbowYaw', event.data[2] / 127 * 2 - 1, SPEAD);
  }
  if(event.data[1] == 19){
      pepper.motion.changeAngles('LWristYaw', event.data[2] / 127 * 2 - 1, SPEAD);
  }
  if(event.data[1] == 20){
      pepper.motion.changeAngles('RShoulderPitch', event.data[2] / 127 * 2 - 1, SPEAD);
  }
  if(event.data[1] == 21){
      pepper.motion.changeAngles('RShoulderRoll', event.data[2] / 127 * 2 - 1, SPEAD);
  }
  if(event.data[1] == 22){
      pepper.motion.changeAngles('RElbowYaw', event.data[2] / 127 * 2 - 1, SPEAD);
  }
  if(event.data[1] == 23){
      pepper.motion.changeAngles('RWristYaw', event.data[2] / 127 * 2 - 1, SPEAD);
  }



  //console.log( str );
}

function startLoggingMIDIInput( midiAccess, indexOfPort ) {
  midiAccess.inputs.forEach( function(entry) {entry.value.onmidimessage = onMIDIMessage;});
}

var joint = [
    {
        key: 'HeadYaw',
        id: 'head-yaw'
    },
    {
        key: 'HeadPitch',
        id: 'head-pitch'
    },
    {
        key: 'LShoulderPitch',
        id: 'l-shoulder-pitch'
    },
    {
        key: 'LShoulderRoll',
        id: 'l-Shoulder-roll'
    },
    {
        key: 'LElbowYaw',
        id: 'l-elbow-yaw'
    },
    {
        key: 'LElbowRoll',
        id: 'l-elbow-roll'
    },
    {
        key: 'LWristYaw',
        id: 'l-wrist-yaw'
    },
    {
        key: 'LHand',
        id: 'l-hand'
    },
    {
        key: 'RShoulderPitch',
        id: 'r-shoulder-pitch'
    },
    {
        key: 'RShoulderRoll',
        id: 'r-shoulder-roll'
    },
    {
        key: 'RElbowYaw',
        id: 'r-elbow-yaw'
    },
    {
        key: 'RElbowRol',
        id: 'RElbowRoll'
    },
    {
        key: 'RWristYaw',
        id: 'r-wris-yaw'
    },
    {
        key: 'RHand',
        id: 'r-hand'
    }
];
//172.16.12.126
var pepper = {};
var $input = document.getElementById('input');
var $connect = document.getElementById('connect');
var $message = document.getElementById('message');
var $speach = document.getElementById('speach');

//pepper
function connect(){
    pepper.qi = new QiSession(input.value);
    pepper.qi.socket().on('connect', function(){
        console.log('success');
        navigator.requestMIDIAccess().then( onMIDISuccess , onMIDIFailure );
        $connect.innerHTML = '成功';
        $connect.classList.add('btn-success');
        pepper.qi.service('ALTextToSpeech')
            .done(function (tts){
                console.log('ALTextToSpeech is success');
                pepper.speech = tts;
            });
        pepper.qi.service('ALMotion')
            .done(function (tts){
                console.log('ALMotion is success');
                pepper.motion = tts;
            });
        pepper.qi.service('ALAudioPlayer')
            .done(function (tts){
                console.log('ALAudioPlayer is success');
                pepper.play = tts;
            });
    }).on('disconnect', function () {
        alert('failed');
        console.log('failed');
        $isConnect.innerHTML = '失敗';
    });
}
function speach(){
    pepper.speech.say($message.value);
}
$connect.addEventListener('click', connect);
$speach.addEventListener('click', speach);
