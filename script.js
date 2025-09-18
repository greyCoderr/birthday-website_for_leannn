document.addEventListener('DOMContentLoaded', () => {

  const $ = id => document.getElementById(id);

  /* ---------------------------
     Elements (match your HTML IDs)
     --------------------------- */
  const startBtn = $('startBtn');           
  const progressBar = $('progressBar');
  const loadingText = $('loadingText');
  const rickVid = $('rickVid');

  const giftBtn = $('giftBtn');

  const modalBackdrop = $('modalBackdrop');
  const modalText = $('modalText');
  const modalCloseBtn = $('modalCloseBtn');

  const gameSection = $('gameSection');
  const scoreDisplay = $('score');
  const gameArea = $('gameArea');

  const unlockModal = $('unlockModal');
  const continueToGreeting = $('continueToGreeting');

  const greeting = $('greeting');
  const continueBtn = $('continueBtn');

  const choiceSection = $('choice');
  const btnGala = $('btnGala');
  const btnFood = $('btnFood');
  const galaOptions = $('galaOptions');
  const foodOptions = $('foodOptions');
  const galaRide = $('galaRide');
  const galaNature = $('galaNature');
  const nextGalaBtn = $('nextGalaBtn');
  const galaSuggestionsInput = $('galaSuggestions');

  const foodLunch = $('foodLunch');
  const foodSnack = $('foodSnack');
  const lunchChoices = $('lunchChoices');
  const jabee = $('jabee');
  const mcdo = $('mcdo');
  const unli = $('unli');
  const samgyup = $('samgyup');
  const nextLunchBtn = $('nextLunchBtn');
  const lunchSuggestionsInput = $('lunchSuggestions');

  const finalSection = $('final');

  /* EmailJS placeholders — REPLACE with your real IDs */
  const EMAILJS_SERVICE_ID = 'service_0wyib7y';
  const EMAILJS_TEMPLATE_ID = 'template_swg4tv2';
  const EMAILJS_PUBLIC_KEY = 'uHhbDTil9BGUTFpRc';
  

  /* ---------------------------
     Section list used by showSection()
     Keep names exactly as IDs
     --------------------------- */
  const SECTIONS = ['landing','loading','rickroll','gameSection','greeting','choice','final'];

  /* showSection: hide everything in SECTIONS and show the requested one */
  function showSection(id) {
    SECTIONS.forEach(sid => {
      const el = $(sid);
      if (!el) return;
      // use the 'hidden' class (your CSS already defines .hidden)
      if (sid === id) el.classList.remove('hidden');
      else el.classList.add('hidden');
    });
  }

  /* ---------------------------
     Simple modal backdrop (modalBackdrop)
     showModal(text, {blockInteraction:true/false})
     - blockInteraction = false => modal shown but we keep giftBtn clickable (used for Rickroll message)
     --------------------------- */
  function showModal(text, opts = { blockInteraction: true }) {
    if (modalText) modalText.textContent = text;
    if (!modalBackdrop) return;

    modalBackdrop.classList.add('show');

    // if we want underlying controls still clickable (for the rickroll hint),
    // bring giftBtn to top so user can click it even if backdrop is visible
    if (!opts.blockInteraction && giftBtn) {
      giftBtn.style.position = 'relative';
      giftBtn.style.zIndex = '9999';
    }
  }
  function hideModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('show');

    // restore giftBtn z-index if we changed it
    if (giftBtn) {
      giftBtn.style.zIndex = '';
      giftBtn.style.position = '';
    }
  }

  /* ---------------------------------
     Loading sequence (fake progress)
     --------------------------------- */
  function startLoadingSequence() {
    showSection('loading');
    let pct = 0;
    const steps = 50;
    const interval = 5000 / steps;
    const timer = setInterval(() => {
      pct += Math.ceil(100 / steps);
      if (pct > 100) pct = 100;
      if (progressBar) progressBar.style.width = pct + '%';
      if (loadingText) loadingText.textContent = pct + '%';
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          showSection('rickroll');
          // try to play the video (user already interacted)
          if (rickVid) {
            try { rickVid.currentTime = 0; rickVid.play(); } catch (e) {}
          }
          // after 5s show the "Just kidding" hint modal but DO NOT block giftBtn
          window.rickrollModalTimer = setTimeout(() => {
            showModal("Just kidding haha 😆 Please click the button below.", { blockInteraction: false });
            // make the modal close button hide it (this is a tiny hint modal)
            if (modalCloseBtn) modalCloseBtn.onclick = hideModal;
          }, 5000);
        }, 350);
      }
    }, interval);
  }

  /* wire startBtn (landing) */
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      // go to loading and start sequence
      startLoadingSequence();
    });
  }

  /* make sure modalCloseBtn hides by default (can be overridden) */
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);

  /* ---------------------------
     Whack-a-Cat mini-game
     --------------------------- */
  const TARGET_SCORE = 5;
  let miniScore = 0;
  let miniInterval = null;

  function clearMiniGameArea(){
    if (!gameArea) return;
    gameArea.innerHTML = '';
  }

  function startMiniGame(){
    miniScore = 0;
    if(scoreDisplay) scoreDisplay.textContent = '0';
    clearMiniGameArea();
    if (miniInterval) { clearInterval(miniInterval); miniInterval = null; }
    // spawn cats faster or slower to adjust difficulty
    miniInterval = setInterval(spawnCat, 800);
  }

  function spawnCat() {
    if (!gameArea) return;
    const cat = document.createElement('div');
    cat.className = 'cat';

    const areaW = Math.max(0, gameArea.clientWidth - 50);
    const areaH = Math.max(0, gameArea.clientHeight - 50);
    const x = Math.random() * areaW;
    const y = Math.random() * areaH;
    cat.style.left = x + 'px';
    cat.style.top = y + 'px';

    // click handler
    const onClick = (ev) => {
      miniScore++;
      if (scoreDisplay) scoreDisplay.textContent = miniScore;
      cat.removeEventListener('click', onClick);
      if (cat.parentNode) cat.parentNode.removeChild(cat);
      if (miniScore >= TARGET_SCORE) {
        endMiniGame(true);
      }
    };
    cat.addEventListener('click', onClick);

    // auto remove after 1.5s
    const removeTimer = setTimeout(() => {
      if (cat.parentNode) cat.parentNode.removeChild(cat);
      cat.removeEventListener('click', onClick);
    }, 1500);

    gameArea.appendChild(cat);
  }

  function endMiniGame(won) {
    if (miniInterval) { clearInterval(miniInterval); miniInterval = null; }
    clearMiniGameArea();
    if (won) {
      // show the unlock modal (this is different from modalBackdrop)
      if (unlockModal) {
        unlockModal.classList.remove('hidden');
        unlockModal.classList.add('show');
      }
    } else {
      showModal("You didn't reach the score — try again!");
    }
  }  

  /* giftBtn should start the mini-game (after rickroll) */
  if (giftBtn) {
    giftBtn.addEventListener('click', () => {
      // cancel rickroll hint timer if still pending
      if (window.rickrollModalTimer) { clearTimeout(window.rickrollModalTimer); window.rickrollModalTimer = null; }
      // pause video
      if (rickVid) {
        try { rickVid.pause(); } catch(e) {}
      }
      // hide rickroll and show game
      showSection('gameSection');
      startMiniGame();
    });
  }

  /* unlock modal Continue -> reveal greeting */
  if (continueToGreeting) {
    continueToGreeting.addEventListener('click', () => {
      if (unlockModal)
        unlockModal.classList.add('hidden');
        unlockModal.classList.remove('show');
      showSection('greeting');
      setTimeout(() => {
        const container = $('confetti');
        if (container) {
          container.innerHTML = '';
          const colors = ['#ff7aa2','#ffd166','#7ad7ff','#c6ffb3','#fff'];
          for(let i=0;i<40;i++){
            const el = document.createElement('div');
            el.className = 'piece';
            el.style.left = Math.random()*100 + '%';
            el.style.top = (Math.random()*-40) + 'vh';
            el.style.width = (6 + Math.random()*10) + 'px';
            el.style.height = (10 + Math.random()*12) + 'px';
            el.style.background = colors[Math.floor(Math.random()*colors.length)];
            el.style.animationDuration = (4 + Math.random()*5) + 's';
            el.style.animationDelay = (Math.random()*2) + 's';
            el.style.transform = 'rotate(' + (Math.random()*360) + 'deg)';
            container.appendChild(el);
          }
        }
      }, 120);
    });
  }

  /* greeting Continue -> choice page */
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      showSection('choice');
    });
  }
   
/* ---------------------------
   Choice logic (fixed)
--------------------------- */
let currentTopChoice = '';
let detailChoice = '';
let otherSuggestion = '';

function disableAndHide(el) {
  if (!el) return;
  el.disabled = true;
  el.style.display = 'none';
}

// Show Gala options
if (btnGala) {
  btnGala.addEventListener('click', () => {
    currentTopChoice = 'Gala';
    galaOptions.style.display = 'block';
    foodOptions.style.display = 'none';
    disableAndHide(btnGala);
    disableAndHide(btnFood);
  });
}

// Show Food options
if (btnFood) {
  btnFood.addEventListener('click', () => {
    currentTopChoice = 'Food';
    foodOptions.style.display = 'block';
    galaOptions.style.display = 'none';
    disableAndHide(btnGala);
    disableAndHide(btnFood);
  });
}

// Gala choices
if (galaRide) {
  galaRide.addEventListener('click', (e) => {
    detailChoice = e.currentTarget.getAttribute('data-choice') || 'Ride & Grab Snacks';
    disableAndHide(galaRide);
    disableAndHide(galaNature);
    otherSuggestion = galaSuggestionsInput?.value || '';
    openFinalSurpriseModal();
  });
}
if (galaNature) {
  galaNature.addEventListener('click', (e) => {
    detailChoice = e.currentTarget.getAttribute('data-choice') || 'La Cascina Henbel (Nature) with Snacks';
    disableAndHide(galaNature);
    disableAndHide(galaRide);
    otherSuggestion = galaSuggestionsInput?.value || '';
    openFinalSurpriseModal();
  });
}
if (nextGalaBtn) {
  nextGalaBtn.addEventListener('click', () => {
    detailChoice = "Other Gala Suggestion";
    otherSuggestion = galaSuggestionsInput?.value || '';
    nextGalaBtn.disabled = true;
    galaSuggestionsInput && (galaSuggestionsInput.disabled = true);
    openFinalSurpriseModal();
  });
}

// Food → Lunch / Snack
if (foodLunch) {
  foodLunch.addEventListener('click', () => {
    disableAndHide(foodLunch);
    disableAndHide(foodSnack);
    lunchChoices.style.display = 'block';
  });
}
if (foodSnack) {
  foodSnack.addEventListener('click', () => {
    disableAndHide(foodSnack);
    disableAndHide(foodLunch);
    galaOptions.style.display = 'block';
  });
}

// Lunch detail choices
['jabee','mcdo','unli','samgyup'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', (e) => {
    detailChoice = e.currentTarget.getAttribute('data-choice') || '';
    document.querySelectorAll('#lunchChoices .option-btn').forEach(b => disableAndHide(b));
    otherSuggestion = lunchSuggestionsInput?.value || '';
    openFinalSurpriseModal();
  });
});

// Lunch Next button
if (nextLunchBtn) {
  nextLunchBtn.addEventListener('click', () => {
    detailChoice = "Other Lunch Suggestion";
    otherSuggestion = lunchSuggestionsInput?.value || '';
    nextLunchBtn.disabled = true;
    lunchSuggestionsInput && (lunchSuggestionsInput.disabled = true);
    openFinalSurpriseModal();
  });
}

function openFinalSurpriseModal() {
  // Show modal message
  showModal("And maybe after, we could also feed some stray cats or dogs together 🙂", { blockInteraction: true });

  if (!modalCloseBtn) return;

  // Reset button
  modalCloseBtn.disabled = false;
  modalCloseBtn.textContent = "OK";

  // Click handler for sending email
  modalCloseBtn.onclick = async function () {
    modalCloseBtn.disabled = true;
    modalCloseBtn.textContent = "Sending...";

    try {
      await sendEmail(); // send email via EmailJS
      
      updateModal("Yay! Your response was sent successfully 🎉", "Done", true);
    } catch (err) {
      console.error("Email send failed:", err);
      updateModal("Failed to send. Please try again.", "OK");
    }
  };
}

// -------------------------------
// Send email using EmailJS
// -------------------------------
async function sendEmail() {
  const payload = {
    top_choice: currentTopChoice || "",
    detail_choice: detailChoice || "",
    other_suggestions: otherSuggestion || "",
    timestamp: new Date().toLocaleString(),
  };

  await emailjs.send(
    "service_0wyib7y",     
    "template_swg4tv2",  
    payload
  );
}

// -------------------------------
// Update modal helper
// -------------------------------
function updateModal(message, buttonText, goToFinal = false) {
  if (modalText) modalText.textContent = message;

  if (!modalCloseBtn) return;

  modalCloseBtn.textContent = buttonText;
  modalCloseBtn.disabled = false;

  if (goToFinal) {
    modalCloseBtn.onclick = () => {
      hideModal();
      showSection("final");
    };
  }
}


});

