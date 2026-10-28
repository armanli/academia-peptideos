/**
 * ACADEMIA DE PEPTÍDEOS - LÓGICA E INTERATIVIDADE (VANILLA JS)
 * Slogan: "Conhecimento a serviço do resultado"
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initMolecularCanvas();
  initLeadForm();
  initWhatsAppRedirect();
  initModals();
  initPillarModals();
});

/* ==========================================================================
   1. NAVBAR & MENU MOBILE
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    toggleBtn.innerHTML = isExpanded ? '✕' : '☰';
  });

  // Fechar ao clicar em qualquer link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggleBtn.innerHTML = '☰';
    });
  });
}

/* ==========================================================================
   2. SIMULAÇÃO MOLECULAR INTERATIVA NO CANVAS (PEPTIDE LATTICE)
   ========================================================================== */
function initMolecularCanvas() {
  const canvas = document.getElementById('molecular-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth > 768 ? 45 : 22, 60);
  const maxDistance = 140;

  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.radius = Math.random() * 2.2 + 1.2;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(16, 185, 129, ';
      this.baseAlpha = Math.random() * 0.4 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interação sutil com o cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const directionX = dx / dist;
          const directionY = dy / dist;
          this.x -= directionX * force * 1.5;
          this.y -= directionY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.baseAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Desenhar conexões moleculares
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. MÁSCARA E CAPTURA DE LEADS (CONTEÚDO EXCLUSIVO EM PDF)
   ========================================================================== */
function initLeadForm() {
  const form = document.getElementById('mailchimp-lead-form');
  const nameInput = document.getElementById('lead-name');
  const emailInput = document.getElementById('lead-email');
  const whatsappInput = document.getElementById('lead-whatsapp');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('lead-submit-btn');

  if (!form || !emailInput || !feedback || !submitBtn) return;

  // Máscara automática de telefone celular brasileiro: (XX) XXXXX-XXXX
  if (whatsappInput) {
    whatsappInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '').substring(0, 11);
      if (!value) {
        e.target.value = '';
        return;
      }
      if (value.length <= 2) {
        e.target.value = `(${value}`;
      } else if (value.length <= 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length <= 10) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput.value.trim();
    const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
    const whatsappDigits = whatsapp.replace(/\D/g, '');

    // Reset de estados de erro visuais
    [nameInput, emailInput, whatsappInput].forEach(inp => inp && inp.classList.remove('input-error'));

    // Validação 1: Nome Completo (mínimo 3 caracteres)
    if (nameInput && name.length < 3) {
      showFeedback('Por favor, digite seu nome completo para personalização do envio.', 'error');
      nameInput.classList.add('input-error');
      nameInput.focus();
      return;
    }

    // Validação 2: Formato de E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Por favor, informe um endereço de e-mail corporativo ou pessoal válido.', 'error');
      emailInput.classList.add('input-error');
      emailInput.focus();
      return;
    }

    // Validação 3: WhatsApp com DDD (pelo menos 10 dígitos)
    if (whatsappInput && whatsappDigits.length < 10) {
      showFeedback('Por favor, insira um número de WhatsApp válido com DDD (mínimo 10 dígitos).', 'error');
      whatsappInput.classList.add('input-error');
      whatsappInput.focus();
      return;
    }

    // Estado de carregamento (Feedback Imediato - Laws of UX)
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Enviando Conteúdo em PDF...
    `;

    const actionUrl = form.getAttribute('action');

    try {
      if (actionUrl && actionUrl.includes('list-manage.com')) {
        const formData = new FormData(form);
        await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });
      } else {
        // Simulação instantânea quando em teste local / pré-configuração
        await new Promise(resolve => setTimeout(resolve, 850));
        const leads = JSON.parse(localStorage.getItem('academia_peptideos_leads') || '[]');
        leads.push({ name, email, whatsapp, timestamp: new Date().toISOString() });
        localStorage.setItem('academia_peptideos_leads', JSON.stringify(leads));
      }

      showFeedback('✔ Sucesso! O Conteúdo Exclusivo em PDF sobre Peptídeos, Tirzepatida e Retatrutida foi enviado para seu e-mail e WhatsApp!', 'success');
      form.reset();
      submitBtn.innerHTML = '✔ Conteúdo Enviado com Sucesso!';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 4500);

    } catch (err) {
      showFeedback('Houve uma instabilidade temporária. Você também pode solicitar o material via WhatsApp.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
  }
}

/* ==========================================================================
   5. INTEGRAÇÃO WHATSAPP (wa.me)
   ========================================================================== */
function initWhatsAppRedirect() {
  const whatsappButtons = document.querySelectorAll('.js-whatsapp-trigger');
  
  // Número de telefone configurável (formato internacional sem caracteres especiais)
  // Exemplo: 5511999999999 (Brasil: +55, DDD 11)
  const defaultPhone = '5511999999999';
  const defaultMessage = encodeURIComponent(
    'Olá! Conheci a Academia de Peptídeos através do site oficial e gostaria de mais informações sobre os materiais científicos e tirar algumas dúvidas com um especialista.'
  );

  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customPhone = btn.getAttribute('data-phone') || defaultPhone;
      const customMsg = btn.getAttribute('data-msg') ? encodeURIComponent(btn.getAttribute('data-msg')) : defaultMessage;
      
      const whatsappUrl = `https://wa.me/${customPhone}?text=${customMsg}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });
}

/* ==========================================================================
   6. MODAL DO MANIFESTO (VÍDEO / DECLARAÇÃO CIENTÍFICA)
   ========================================================================== */
function initModals() {
  const openManifestoBtns = document.querySelectorAll('.js-open-manifesto');
  const modalOverlay = document.getElementById('manifesto-modal');
  const closeBtn = document.getElementById('close-manifesto-btn');

  if (!modalOverlay) return;

  function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openManifestoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. MODAL DETALHADO DOS PILARES (DEEP DIVE ACADÊMICO)
   ========================================================================== */
function initPillarModals() {
  const pillarCards = document.querySelectorAll('.pillar-card');
  const pillarModal = document.getElementById('pillar-detail-modal');
  const closePillarBtn = document.getElementById('close-pillar-btn');
  const pillarTitle = document.getElementById('pillar-modal-title');
  const pillarBadge = document.getElementById('pillar-modal-badge');
  const pillarContent = document.getElementById('pillar-modal-content');

  if (!pillarModal) return;

  const pillarDetails = {
    '1': {
      title: 'Mecanismos de Ação & Sinalização Celular',
      badge: 'Fisiologia Transmembrana',
      content: `
        <p>A sinalização metabólica mediada por peptídeos atua primariamente em receptores acoplados à proteína G (GPCRs). Neste pilar, destrinchamos como os hormônios incretínicos ativam cascatas intracelulares:</p>
        <div style="background: rgba(0,242,254,0.06); padding: 1rem 1.25rem; border-radius: 8px; margin: 1.2rem 0; border-left: 3px solid #00f2fe;">
          <h4 style="color: #00f2fe; margin-bottom: 0.4rem;">Principais Vias Investigadas:</h4>
          <ul style="padding-left: 1.2rem; color: #cbd5e1; font-size: 0.95rem;">
            <li><strong>Receptor GLP-1R:</strong> Estimulação da via adenilil ciclase-cAMP, regulando a secreção de insulina dependente de glicose no pâncreas e núcleos sacietógenos hipotalâmicos.</li>
            <li><strong>Receptor GIPR:</strong> Efeitos sinérgicos sobre a deposição e fluxo lipídico no tecido adiposo e proteção de ilhotas pancreáticas.</li>
            <li><strong>Receptor GCGR:</strong> Estímulo ao gasto energético mitocondrial e lipólise hepática sem comprometimento cardíaco.</li>
          </ul>
        </div>
        <p>Todos os conteúdos deste eixo traduzem artigos indexados com esquemas ilustrados para que qualquer pessoa compreenda as transformações fisiológicas no próprio corpo.</p>
      `
    },
    '2': {
      title: 'Biotecnologia Metabólica: Tirzepatida, Retatrutida & Inovações',
      badge: 'Vanguarda Terapêutica',
      content: `
        <p>A evolução dos agonistas começou com monoagonistas (Semaglutida), evoluiu para duplo-agonistas (Tirzepatida) e atinge seu ápice experimental nos tri-agonistas (Retatrutida):</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.2rem 0;">
          <div style="background: rgba(13,22,41,0.8); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: 8px;">
            <span style="color: #00f2fe; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Tirzepatida (GLP-1 + GIP)</span>
            <p style="font-size: 0.88rem; margin-top: 0.4rem;">Ensaios SURMOUNT comprovaram até 22,5% de redução de peso corporal com acentuada redução da esteatose hepática.</p>
          </div>
          <div style="background: rgba(13,22,41,0.8); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: 8px;">
            <span style="color: #10b981; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Retatrutida (GLP-1 + GIP + Glucagon)</span>
            <p style="font-size: 0.88rem; margin-top: 0.4rem;">Resultados de Fase II demonstraram redução de até 24,2% em 48 semanas, com resolução quase total da gordura visceral hepática.</p>
          </div>
        </div>
        <p>Abordamos farmacodinâmica, tempos de meia-vida, estabilidade molecular e a previsão de aprovações regulatórias.</p>
      `
    },
    '3': {
      title: 'Longevidade, Rejuvenescimento & Biohacking',
      badge: 'Healthspan & Otimização',
      content: `
        <p>O foco em longevidade transcende a redução de adiposidade. Analisamos biomarcadores de idade biológica e as seguintes chaves de rejuvenescimento celular:</p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin: 1rem 0;">
          <li style="display: flex; gap: 0.5rem; font-size: 0.95rem; color: #cbd5e1;">⚡ <strong>Preservação de Massa Magra:</strong> Estratégias nutricionais e treinamento resistido para neutralizar a perda de densidade muscular durante o déficit calórico.</li>
          <li style="display: flex; gap: 0.5rem; font-size: 0.95rem; color: #cbd5e1;">🧬 <strong>Modulação de mTOR & AMPK:</strong> Equilíbrio entre autofagia (limpeza de resíduos celulares) e anabolismo muscular.</li>
          <li style="display: flex; gap: 0.5rem; font-size: 0.95rem; color: #cbd5e1;">🔬 <strong>Biomarcadores Críticos:</strong> Marcadores de inflamação subclínica (PCR ultrassensível, interleucinas e HOMA-IR).</li>
        </ul>
      `
    },
    '4': {
      title: 'Ensaios Clínicos, Segurança & Farmacocinética',
      badge: 'Evidência Padrão Ouro',
      content: `
        <p>Neste pilar, ensinamos o leitor e o profissional a ler além das manchetes promocionais e analisar a metodologia real dos estudos publicados:</p>
        <div style="background: rgba(245, 158, 11, 0.08); border-left: 3px solid #f59e0b; padding: 1rem; border-radius: 8px; margin: 1.2rem 0;">
          <h4 style="color: #f59e0b; font-size: 0.95rem; margin-bottom: 0.3rem;">Compromisso de Risco & Segurança:</h4>
          <p style="font-size: 0.88rem; color: #e2e8f0;">Discutimos manejo de náuseas, constipação, titulação conservadora de doses, contraindicações para histórico familiar de carcinoma medular de tireoide e o papel indispensável da equipe médica.</p>
        </div>
        <p>Fontes sistematicamente checadas: The New England Journal of Medicine, The Lancet, JAMA e Diabetes Care.</p>
      `
    }
  };

  pillarCards.forEach(card => {
    card.addEventListener('click', () => {
      const pillarId = card.getAttribute('data-pillar');
      const data = pillarDetails[pillarId];

      if (data) {
        pillarTitle.textContent = data.title;
        pillarBadge.textContent = data.badge;
        pillarContent.innerHTML = data.content;
        pillarModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closePillar() {
    pillarModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closePillarBtn) {
    closePillarBtn.addEventListener('click', closePillar);
  }

  pillarModal.addEventListener('click', (e) => {
    if (e.target === pillarModal) {
      closePillar();
    }
  });
}
