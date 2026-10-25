import * as THREE from 'three';

const byId= id => document.getElementById(id);
const uploadInput= byId('audio-upload');
const fileName= byId('file-name');
const startBtn= byId('start-btn');
const homeScreen= byId('home-screen');

const audioPlayer= byId('audio-player');
const preview= byId('song-preview');
const previewPlay= byId('preview-play');
const previewDuration= byId('preview-duration');

const hud= byId('hud');
const nowPlaying= byId('now-playing');
const playerPlay= byId('player-play');
const elapsed= byId('elapsed');
const remaining= byId('remaining');
const seek= byId('seek');
const volume= byId('volume');
const bands= byId('bands');

let objectURL;
let audioContext, analyser, gain, frequencyData;
let bass= 0
let mids= 0;
let treble= 0;
let previousFrame;

const visual= {
    fftSize: 2048,
    smoothing: 0.7,
    bassAmount: 0.8,
    morphAmount: 0.25,
    rippleAmount: 0.2

};
function setupAudio(){
    if(audioContext)return;
    audioContext= new AudioContext();

    const source= audioContext.createMediaElementSource(audioPlayer);

    analyser= audioContext.createAnalyser();
    analyser.fftSize= visual.fftSize;
    analyser.smoothingTimeConstant= visual.smoothing;

    gain= audioContext.createGain();
    gain.gain.value= Number(volume.value);
    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(audioContext.destination);

    frequencyData= new Uint8Array(
        analyser.frequencyBinCount
    );

}

async function playAudio(){
    setupAudio();
    await audioContext.resume();
    await audioPlayer.play();
}
function bandLevel(lowHz, highHz){
    const hzPerBin= audioContext.sampleRate/analyser.fftSize;

    const first= Math.max(
        0, 
        Math.floor(lowHz / hzPerBin)
    );
const end= Math.min(
    frequencyData.length, 
    Math.ceil(highHz/hzPerBin)
);
    let total= 0;
    for (let i= first; i< end; i++){
        total+= frequencyData[i];
    }

    return end>first
    ? total/((end-first)*255): 0;
    
}

function formatTime(seconds) {

    if(!Number.isFinite(seconds)) return '--:--';

    const minutes= Math.floor(seconds/60);
    const rest= Math.floor(seconds%60);

    return minutes + ':' + String(rest).padStart(2,'0');

}

function syncPlayer(){
    const duration= audioPlayer.duration;
    const ready= Number.isFinite(duration) && duration>0;

    previewDuration.textContent= formatTime(duration)+'total';
elapsed.textContent= formatTime(audioPlayer.currentTime);
    remaining.textContent= ready ? formatTime(
        Math.max(0, duration- audioPlayer.currentTime)) + 'left': '--:--';
    seek.value= ready? audioPlayer.currentTime/duration *100:0;
    seek.disabled= !ready;
    startBtn.disabled= !ready;
    previewPlay.disabled= !ready;
    playerPlay.disabled= !ready;

    previewPlay.textContent= audioPlayer.paused
    ? 'Play preview': 'Pause preview';

    playerPlay.textContent= audioPlayer.paused ? 'Play':'Pause';

}

[
    'loadedmetadata',
    'durationchange',
    'timeupdate',
    'play',
    'pause',
    'ended',
    'emptied'
].forEach(eventName => {
    audioPlayer.addEventListener(eventName, syncPlayer);
});

async function togglePlayback(){
    try{
        if(audioPlayer.paused){
            await playAudio();
        } else { audioPlayer.pause(); }
    } catch(error){
        fileName.textContent= error.message;
        nowPlaying.textContent= error.message;
    }
}

previewPlay.addEventListener('click', togglePlayback);
playerPlay.addEventListener('click', togglePlayback);

seek.addEventListener('input', ()=>{
    if(Number.isFinite(audioPlayer.duration)){
        audioPlayer.currentTime= 
        Number(seek.value)/100*audioPlayer.duration;
    }
})
volume.addEventListener('input', ()=>{
    if(gain){
        gain.gain.value= Number(volume.value);

    }
})
audioPlayer.addEventListener('error', ()=> {
    fileName.textContent=
    'Could not load that audio file ;-;. Try another one.';
    nowPlaying.textContent= fileName.textContent;

    startBtn.disabled= true;
    previewPlay.disabled= true;
    playerPlay.disabled= true;
    seek.disabled= true;
});
uploadInput.addEventListener('change', event=>{
    const file= event.target.files[0];

    if (!file) return;

    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
    audioPlayer.load();

    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL= URL.createObjectURL(file);
    audioPlayer.src= objectURL;
    audioPlayer.load();

    fileName.textContent= file.name;
    nowPlaying.textContent= file.name;

    preview.classList.remove('hidden');
    startBtn.disabled= true;
    previewPlay.disabled= true;

});

startBtn.addEventListener('click', async()=>{
    try{
        await playAudio();

        homeScreen.classList.add('hidden');
        hud.classList.remove('hidden');

        sphere.visible= true;
        camera.position.set(0,0,8);
    
    }

    catch(error){
        fileName.textContent= error.message;
    }
});

syncPlayer();
function animate(time) {
    const t= time/1000;
    const dt= previousFrame===undefined?0: Math.min((time-previousFrame)/1000, 0.05);
    previousFrame= time;
    let targetBass= 0, targetMids=0, targetTreble=0;
    if(analyser&& !audioPlayer.paused) {
        analyser.getByteFrequencyData(frequencyData);
        targetBass= bandLevel(20,250);
        targetMids= bandLevel(250, 2000);
        targetTreble= bandLevel(2000, 12000);
    }
    const blend= 1- Math.exp(-10*dt);
    bass+= (targetBass-bass)*blend;
    mids+=(targetMids-mids)*blend;
    treble += (targetTreble-treble)*blend;

    for(let i=0; i<positions.count; i++){
        const x= restPositions[i*3];
        const y= restPositions[i*3+1];
        const z= restPositions[i*3+2];
        const radius= Math.hypot(x,y,z);
        const nx= x/radius, ny= y/radius, nz= z/radius;
        const broadWave= Math.sin(nx*3+t)*Math.sin(ny*4-t*0.7)*Math.sin(nz*3+t*0.4);
        const fineWave= Math.sin(nx*12+ny*9+nz*7+t*3);
        const expansion= visual.bassAmount * bass;
        const morph= visual.morphAmount*(bass*0.7+mids*0.3) * broadWave;
        const ripple= visual.rippleAmount *treble *fineWave;
        const factor= 1+expansion+morph+ripple;
        positions.setXYZ(i,x*factor, y*factor, z*factor);


    }
    positions.needsUpdate= true;
    geometry.computeBoundingSphere();
    sphere.rotation.x= t * 0.1;
    sphere.rotation.y= t * 0.2;
    bands.textContent= 'Bass'+Math.round(bass*100)+'%.Mids'+Math.round(mids*100)+'%.Treble'+ Math.round(treble*100)+'%';
    renderer.render(scene,camera);
}


const scene= new THREE.Scene()
scene.background= null;
scene.fog= new THREE.Fog(0x333333, 0.1, 1000);



const camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,0,8);


const renderer= new THREE.WebGLRenderer({
    antialias:true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry= new THREE.SphereGeometry(2,64,64);
const positions= geometry.getAttribute('position');
positions.setUsage(THREE.DynamicDrawUsage);
const restPositions= positions.array.slice();

const material= new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
const sphere= new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.castShadow= true;
sphere.recieveShadow= true;
sphere.visible=false;

const uploadBtn= document.getElementById('upload-btn');
uploadBtn.addEventListener('click', ()=>{
    uploadInput.click();
});
renderer.setAnimationLoop(animate);