// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json")
    .then(data => data.json())
    .then(data => {
      // Make config available globally
      window.config = data;
      
      dataArr = Object.keys(data);
      dataArr.map(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelector(`[data-node-name*="${customData}"]`)
              .setAttribute("src", data[customData]);
          } else {
            document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
          }
        }

        // Check if the iteration is over
        // Run animation if so
        if ( dataArr.length === dataArr.indexOf(customData) + 1 ) {
          // Setup audio first
          setupAudio();
          // Then start animation
          animationTimeline();
        } 
      });
    });
};

// Audio control functions
const setupAudio = () => {
  // Create audio element if it doesn't exist
  let audio = document.getElementById('birthdayAudio');
  
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'birthdayAudio';
    audio.loop = true;
    
    const source = document.createElement('source');
    source.src = window.config?.audioFile || 'audio/hBd.mp3';
    source.type = 'audio/mpeg';
    
    audio.appendChild(source);
    document.body.appendChild(audio);
  }
  
  // Set volume (default to 0.5 if not specified)
  audio.volume = window.config?.audioVolume || 0.5;
  
  // Try to play audio (may require user interaction on some browsers)
  const playAudio = () => {
    if (window.config?.audioEnabled !== false) {
      audio.play().catch(error => {
        console.log('Autoplay prevented:', error);
        // Show a play button if autoplay is blocked
        createPlayButton();
      });
    }
  };
  
  // Create play button if autoplay is blocked
  const createPlayButton = () => {
    // Check if button already exists
    if (document.getElementById('audioPlayBtn')) return;
    
    const playBtn = document.createElement('button');
    playBtn.id = 'audioPlayBtn';
    playBtn.innerHTML = '🎵 Play Birthday Music';
    playBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: linear-gradient(45deg, #ff69b4, #ff1493);
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      font-family: 'Work Sans', sans-serif;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
      transition: all 0.3s ease;
    `;
    
    // Add hover effect
    playBtn.addEventListener('mouseenter', () => {
      playBtn.style.transform = 'scale(1.05)';
      playBtn.style.boxShadow = '0 6px 20px rgba(255, 105, 180, 0.4)';
    });
    
    playBtn.addEventListener('mouseleave', () => {
      playBtn.style.transform = 'scale(1)';
      playBtn.style.boxShadow = '0 4px 15px rgba(255, 105, 180, 0.3)';
    });
    
    playBtn.addEventListener('click', () => {
      audio.play();
      playBtn.style.display = 'none';
    });
    
    document.body.appendChild(playBtn);
  };
  
  // Play audio when animation starts
  if (window.config?.playAudioOnStart !== false) {
    // Delay slightly to let page load
    setTimeout(playAudio, 1000);
  }
  
  // Also restart audio when replaying animation
  const replayBtn = document.getElementById('replay');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      audio.currentTime = 0;
      playAudio();
    });
  }
};

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible"
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "rgb(127, 206, 248)"
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150
      },
      "+=0.7"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0
      },
      "+=0.5"
    )
    .to(
      ".idea-5 .smiley",
      0.7,
      {
        rotation: 90,
        x: 8
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400
      },
      {
        opacity: 1,
        y: -1000
      },
      0.2
    )
    .from(
      ".Alysia-dp",  
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90
      },
      "+=1"
    );

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};

// Run fetch and animation in sequence
fetchData();