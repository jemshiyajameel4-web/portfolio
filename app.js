/* ==========================================================================
   JEMSHIYA JAMEEL // CYBER FUTURISTIC PORTFOLIO CORE ENGINE (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚡ JEMSHIYA.SYS Core Engine Initialized...');

  // 1. WEB AUDIO SYNTHESIZER FOR CYBER SOUND EFFECTS
  let audioEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playCyberSound(type = 'hover') {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'terminal') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Audio context error fallback
    }
  }

  // Audio Toggle Button
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        sfxIcon.className = 'fa-solid fa-volume-high';
        sfxToggleBtn.style.color = 'var(--neon-cyan)';
        playCyberSound('click');
      } else {
        sfxIcon.className = 'fa-solid fa-volume-xmark';
        sfxToggleBtn.style.color = 'var(--text-muted)';
      }
    });
  }

  // Attach audio listeners to elements with data-sfx
  document.querySelectorAll('[data-sfx]').forEach(elem => {
    const sfxType = elem.getAttribute('data-sfx');
    if (sfxType === 'hover') {
      elem.addEventListener('mouseenter', () => playCyberSound('hover'));
    } else if (sfxType === 'click') {
      elem.addEventListener('click', () => playCyberSound('click'));
    }
  });

  // 2. SCANLINES TOGGLE
  const scanlinesBtn = document.getElementById('scanlines-toggle');
  const scanlinesOverlay = document.getElementById('scanlines');
  if (scanlinesBtn && scanlinesOverlay) {
    scanlinesBtn.addEventListener('click', () => {
      scanlinesOverlay.classList.toggle('hidden');
    });
  }

  // 3. CUSTOM CYBER CURSOR
  const cursor = document.getElementById('cyber-cursor');
  const follower = document.getElementById('cyber-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // 4. AMBIENT PARTICLES CANVAS BACKGROUND
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(Math.floor(width / 18), 70);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#00f0ff' : '#9d00ff'
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Render connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Render & update particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }



  // 6. SKILLS MATRIX FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 7. MODALS MANAGER
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close');

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      playCyberSound('click');
    }
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modalOverlays.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Resume Modal
  const openResumeBtn = document.getElementById('open-resume-btn');
  const resumeModal = document.getElementById('resume-modal');
  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
    });
  }

  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      const iframe = document.getElementById('resume-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.print();
      }
    });
  }

  // 8. CYBER CLI TERMINAL ENGINE
  const cliModal = document.getElementById('cli-modal');
  const terminalTrigger = document.getElementById('terminal-trigger');
  const launchCliBtn = document.getElementById('launch-cli-btn');
  const cliCloseBtn = document.getElementById('cli-close-btn');
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');

  function openCLI() {
    cliModal.classList.add('active');
    cliInput.focus();
    playCyberSound('terminal');
  }

  if (terminalTrigger) terminalTrigger.addEventListener('click', openCLI);
  if (launchCliBtn) launchCliBtn.addEventListener('click', openCLI);
  if (cliCloseBtn) cliCloseBtn.addEventListener('click', () => closeModal(cliModal));

  const cliCommands = {
    help: `Available Commands:
  - bio      : Display summary profile
  - skills   : Matrix of technical competencies
  - projects : Deployed AI & LegalTech systems
  - exp      : Work history at MarketBytes
  - education: Academic degree & certifications
  - contact  : Direct communication links
  - resume   : Launch PDF Resume preview
  - clear    : Clear screen
  - sudo hire: Initiate recruitment protocol`,

    bio: `JEMSHIYA JAMEEL // Python Full Stack Developer
Location: Kerala, India
Summary: Skilled in building responsive web UIs, high-speed REST APIs (Django & FastAPI), SQL database schemas, and AI-powered sentiment analysis platforms.`,

    skills: `TECHNICAL MATRIX:
  [Backend]  : Python, Django, REST APIs, FastAPI, SQLAlchemy
  [Frontend] : React.js, Next.js, JS ES6+, HTML5, CSS3, Tailwind CSS, Bootstrap
  [Databases]: MySQL
  [Dev Tools]: Git, GitHub, GitHub Copilot, Linux, Data Structures, OOP`,

    projects: `FEATURED PROJECTS:
  1. AI-Based Mental Health Sentiment Analyzer
     Tech: Python, Django, NLP, Chart.js, MySQL
     Desc: AI sentiment classification, doctor portal, real-time consultation chat.
  
  2. LegalTech Platform – Law Firm & Case Management
     Tech: Python, FastAPI, Next.js, SQLAlchemy, MySQL, Tailwind
     Desc: High efficiency gain, GST/Court Fee finance engine, role-based dashboards.`,

    exp: `WORK LOG:
  Role: Junior Python Full Stack Developer
  Company: MarketBytes, Infopark Cherthala
  Period: May 2026 - Present
  Tasks: Django/FastAPI REST APIs, React/Next.js UI components, Git collaboration, SQL optimization.`,

    education: `ACADEMIC & CREDENTIALS:
  - Bachelor of Computer Application (BCA) | 2023 - 2026
    Swamy Saswathikananda College
  - AI Sentiment Analyzer Project Certificate | 2026
    Gentrius Solutions`,

    contact: `DIRECT CHANNELS:
  Portfolio: jemshiya.vercel.app
  Email    : jemshiyajameel4@gmail.com
  Phone    : +91 8075507112
  LinkedIn : www.linkedin.com/in/jemshiya-jameel4
  GitHub   : github.com/jemshiyajameel4`,

    'sudo hire': `[PROTOCOL ACTIVATED]: Candidate Jemshiya Jameel is READY for Full Stack Developer opportunities!
Initiating Direct Contact Modal...`
  };

  if (cliInput && cliOutput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = cliInput.value.trim().toLowerCase();
        playCyberSound('terminal');

        // Render command line prompt entry
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:var(--neon-cyan)">jemshiya@marketbytes-node:~$</span> ${cliInput.value}`;
        cliOutput.appendChild(line);

        if (command === 'clear') {
          cliOutput.innerHTML = '';
        } else if (command === 'resume') {
          closeModal(cliModal);
          resumeModal.classList.add('active');
        } else if (command === 'sudo hire') {
          const res = document.createElement('div');
          res.style.color = 'var(--neon-green)';
          res.textContent = cliCommands['sudo hire'];
          cliOutput.appendChild(res);
          setTimeout(() => {
            closeModal(cliModal);
            document.getElementById('contact').scrollIntoView();
          }, 1200);
        } else if (cliCommands[command]) {
          const res = document.createElement('div');
          res.style.color = '#e2e8f0';
          res.style.whiteSpace = 'pre-wrap';
          res.style.marginTop = '4px';
          res.style.marginBottom = '12px';
          res.textContent = cliCommands[command];
          cliOutput.appendChild(res);
        } else if (command !== '') {
          const err = document.createElement('div');
          err.style.color = 'var(--neon-pink)';
          err.textContent = `Command not recognized: '${command}'. Type 'help' for available commands.`;
          cliOutput.appendChild(err);
        }

        cliInput.value = '';
        const cliBody = document.getElementById('cli-body');
        cliBody.scrollTop = cliBody.scrollHeight;
      }
    });
  }

  // 9. LIVE SENTIMENT ANALYSIS SIMULATOR LOGIC
  const openSimBtns = document.querySelectorAll('.open-sim-btn');
  const simSentimentModal = document.getElementById('sim-sentiment-modal');
  const simLegalModal = document.getElementById('sim-legaltech-modal');

  openSimBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const simType = btn.getAttribute('data-sim');
      if (simType === 'sentiment' && simSentimentModal) {
        simSentimentModal.classList.add('active');
      } else if (simType === 'legaltech' && simLegalModal) {
        simLegalModal.classList.add('active');
      }
    });
  });

  const analyzeBtn = document.getElementById('analyze-sentiment-btn');
  const sentimentInput = document.getElementById('sentiment-input');
  const sentimentResult = document.getElementById('sentiment-result');

  if (analyzeBtn && sentimentInput && sentimentResult) {
    analyzeBtn.addEventListener('click', () => {
      const text = sentimentInput.value.toLowerCase().trim();
      if (!text) {
        alert('Please enter a patient statement to analyze!');
        return;
      }

      playCyberSound('click');

      // Simple heuristic sentiment engine simulation
      let score = 0;
      const anxiousWords = ['overwhelmed', 'anxious', 'scared', 'panic', 'stress', 'struggling', 'sad', 'depressed', 'fear'];
      const positiveWords = ['happy', 'better', 'good', 'calm', 'relaxed', 'hopeful', 'peaceful', 'great'];

      anxiousWords.forEach(w => { if (text.includes(w)) score -= 0.35; });
      positiveWords.forEach(w => { if (text.includes(w)) score += 0.35; });

      score = Math.max(-1.0, Math.min(1.0, score));

      let emotion = 'NEUTRAL / STABLE';
      let rec = 'Regular routine check-in recommended. Maintain healthy work-life balance.';
      let triage = 'ROUTINE MONITORING';

      if (score < -0.3) {
        emotion = 'HIGH ANXIETY / ELEVATED STRESS';
        rec = 'Automated AI recommendation: Alert assigned doctor for consultation. Provide cognitive grounding exercises.';
        triage = 'PRIORITY DOCTOR CONNECT';
      } else if (score > 0.3) {
        emotion = 'POSITIVE / CALM STATE';
        rec = 'Patient exhibits positive mental resilience. Continue current wellness plan.';
        triage = 'STABLE STATE';
      }

      document.getElementById('res-emotion').textContent = emotion;
      document.getElementById('res-score').textContent = score.toFixed(2);
      document.getElementById('res-rec').textContent = rec;
      document.getElementById('res-triage').textContent = triage;

      sentimentResult.style.display = 'block';
    });
  }

  // 10. LEGALTECH FINTECH CALCULATOR SIMULATOR LOGIC
  const calcLegalBtn = document.getElementById('calc-legal-btn');
  const baseFeeInput = document.getElementById('base-fee');
  const courtTypeInput = document.getElementById('court-type');
  const legalResult = document.getElementById('legaltech-result');

  if (calcLegalBtn && baseFeeInput && courtTypeInput && legalResult) {
    calcLegalBtn.addEventListener('click', () => {
      const baseFee = parseFloat(baseFeeInput.value) || 0;
      const courtType = courtTypeInput.value;

      playCyberSound('click');

      let courtFee = 1500;
      if (courtType === 'high') courtFee = 5000;
      if (courtType === 'supreme') courtFee = 12000;

      const gst = baseFee * 0.18;
      const total = baseFee + gst + courtFee;

      document.getElementById('inv-base').textContent = `₹${baseFee.toLocaleString('en-IN')}`;
      document.getElementById('inv-gst').textContent = `₹${gst.toLocaleString('en-IN')}`;
      document.getElementById('inv-court').textContent = `₹${courtFee.toLocaleString('en-IN')}`;
      document.getElementById('inv-total').textContent = `₹${total.toLocaleString('en-IN')}`;

      legalResult.style.display = 'block';
    });
  }

  // 11. SYSTEM ARCHITECTURE MODAL HANDLER
  const openArchBtns = document.querySelectorAll('.open-arch-btn');
  const archModal = document.getElementById('arch-modal');
  const archContent = document.getElementById('arch-content');
  const archTitle = document.getElementById('arch-title');

  const archData = {
    sentiment: {
      title: 'AI Mental Health Platform Architecture',
      html: `
        <div style="font-family: var(--font-mono); font-size: 13px; line-height: 1.8;">
          <h4 style="color:var(--neon-cyan); margin-bottom:10px;">[LAYER 1: FRONTEND INTERFACE]</h4>
          <p>HTML5, CSS3, Bootstrap, JavaScript ES6+, Chart.js (Real-time Emotion Radar & Analytics Graphs)</p>

          <h4 style="color:var(--neon-purple); margin-top:16px; margin-bottom:10px;">[LAYER 2: BACKEND ENGINE]</h4>
          <p>Python Django Framework, REST API Endpoints, Real-time WebSockets Chat, Admin/Doctor RBAC</p>

          <h4 style="color:var(--neon-green); margin-top:16px; margin-bottom:10px;">[LAYER 3: AI & NLP ENGINE]</h4>
          <p>Sentiment Analysis Classification Pipeline, NLP Keyword Extractor, AI Wellness Recommendation Engine</p>

          <h4 style="color:var(--neon-pink); margin-top:16px; margin-bottom:10px;">[LAYER 4: DATABASE & STORAGE]</h4>
          <p>MySQL Relational Database, Encrypted Patient/Doctor Profiles, Sentiment Log Records</p>
        </div>
      `
    },
    legaltech: {
      title: 'LegalTech Case & Financial System Architecture',
      html: `
        <div style="font-family: var(--font-mono); font-size: 13px; line-height: 1.8;">
          <h4 style="color:var(--neon-purple); margin-bottom:10px;">[LAYER 1: FRONTEND SPA]</h4>
          <p>Next.js, React.js, Tailwind CSS, Dynamic Case Tracking & Calendar Scheduling</p>

          <h4 style="color:var(--neon-cyan); margin-top:16px; margin-bottom:10px;">[LAYER 2: ASYNC API SERVICES]</h4>
          <p>FastAPI (Python), Pydantic Schemas, OAuth2 Auth Tokens, Role-Based Access Control (Senior/Junior Advocates, Clients)</p>

          <h4 style="color:var(--neon-green); margin-top:16px; margin-bottom:10px;">[LAYER 3: FINANCIAL MATH ENGINE]</h4>
          <p>Automated GST (18%) Calculator, Statutory Court Fee Ledger, Invoice PDF Generation & Payment Status Workflow (100% Math Accuracy)</p>

          <h4 style="color:var(--neon-pink); margin-top:16px; margin-bottom:10px;">[LAYER 4: DATABASE & ORM]</h4>
          <p>SQLAlchemy ORM, MySQL Relational Database, Case File Storage Indexing</p>
        </div>
      `
    }
  };

  openArchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      if (archData[projectKey] && archModal) {
        archTitle.innerHTML = `<i class="fa-solid fa-sitemap neon-cyan"></i> ${archData[projectKey].title}`;
        archContent.innerHTML = archData[projectKey].html;
        archModal.classList.add('active');
      }
    });
  });

  // 12. ENCRYPTED CONTACT FORM HANDLER
  const contactForm = document.getElementById('contact-form');
  const statusDiv = document.getElementById('transmission-status');
  const sendBtn = document.getElementById('send-msg-btn');

  if (contactForm && statusDiv && sendBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playCyberSound('click');

      const name = document.getElementById('contact-name').value;
      sendBtn.disabled = true;

      statusDiv.style.color = 'var(--neon-cyan)';
      statusDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ENCRYPTING TRANSMISSION... 33%';

      setTimeout(() => {
        statusDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING PACKETS VIA QUANTUM NODE... 66%';
      }, 800);

      setTimeout(() => {
        statusDiv.style.color = 'var(--neon-green)';
        statusDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> TRANSMISSION DELIVERED! Thank you, ${name}. Jemshiya will respond shortly.`;
        sendBtn.disabled = false;
        contactForm.reset();
      }, 1600);
    });
  }
});
