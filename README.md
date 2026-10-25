# **SOUNDMAXXXING**
## *Visualising the music through 3d Mesh styled-sphere!*
Everyone hears music, but.... this is a whole experience which allows us to *FEEL* the beats. The core concept of the demo is to present a sphere which takes different forms which vary from beat to beat, following algoritms, insteaded of some hard-coded stuff.

### **The Whole Logic for the Visualizing:**
- The way we will be going to visualize the beats is through (drumroll....) A SPHERE!!!

- The sphere is not just a constant, but it also changes with the beats, like with varying bass, treble and mids in the tunes, the sphere reforms its shapes according, so, its not just a scripted reforming that occurs, instead, its a whole Algorithm that runs in background, making the visualization even more vibrant, artistic, modern, or in just simple words......cool.

- The Deviations for the reforming are as follows:
1. *Bass-> 20-250 Hz of Frequency Range*
2. *Mids-> 250-2000Hz of Frequency Range*
3. *Treble-> 2000-12000Hz of Frequency Range*

- The Radius multiplier for the sphere with respective kinds of beats:
1. +0.80 × bass
2. +(0.175 × bass + 0.075 × mids) × broadWave
3. +0.20 × treble × fineWave


### **How to access:**

1. Go to *https://soundmaxxxing.vercel.app/*
2. Click on 'Upload the Audio here'.
3. You can click on Preview for listening to the audio before starting the main visualization, and then click on Start for the experience to begin!

<img width="1457" height="868" alt="Screenshot 2026-10-25 at 11 38 30 PM" src="https://github.com/user-attachments/assets/16fcf310-46fe-4086-919a-e6632dac53c1" />


4.Then, you will be re-directed to a new page where you will see a rotating sphere with a mesh like design


<img width="1457" height="868" alt="Screenshot 2026-10-25 at 11 59 52 PM" src="https://github.com/user-attachments/assets/4e8cf55b-aae8-4749-9916-c02ddd3deb27" />

<img width="1457" height="868" alt="Screenshot 2026-10-26 at 12 30 52 AM" src="https://github.com/user-attachments/assets/f520a1d2-59a3-4f70-ab40-2af81f6c2bfe" />





5. There, You can see another widget/hero-card on the screen, i.e. the control panel- where we can control the song's duration from where we want to listen from, and also access the volume controls, along with a pause/play button.

<p align="center">
  This project, again, was my first one. With further progression in time and my skills, i would love to develop features in this project
  EVEN further.
</p>


### ***Role of each File:***
- index.html:
  + Holding together the main homepage,
  + Handling the main buttons and the workframe involved with that
 
- style.css:
  + Setting fonts, colors, and other QOL Features.
  + Positioning the homepage, control panel for controlling the music, etc.

- final.js:
  + Loads the audio and also manages all the working of the playback, volume, etc. 
  + Loads the whole 3D sphere along with its animations, the texture, etc. (using Three.js- the main tool on which the project relies on)
  + Extracts the bass, mids, treble from the music.

### ***Notes:***
-The other (unmentioned) files in this readme.md are the ones which are either just supporting files for Three.js or are some test files which have unrelated content to the main project.

- AI was only used once and that too for an error which i was stuck on for really long time and couldn't find help through existing documentation or forums as much.

- Most of the numeric values and the color themes involve a hit and try behind it which was done mostly externally on web-based tools and calculators available.

