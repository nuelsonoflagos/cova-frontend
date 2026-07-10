(function() {
  // Don't inject if already injected or if we are inside the chatbot iframe itself
  if (document.getElementById('cova-chatbot-widget') || window.location.pathname.includes('cova-chatbot.html')) {
    return;
  }

  const styles = `
    .cova-chatbot-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      background-color: #0a5c45;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(10, 92, 69, 0.4);
      cursor: pointer;
      z-index: 999999;
      transition: transform 0.3s ease, background-color 0.3s ease;
      border: none;
      outline: none;
    }

    .cova-chatbot-widget-btn:hover {
      transform: scale(1.05);
      background-color: #137a5c;
    }

    .cova-chatbot-widget-btn svg {
      width: 30px;
      height: 30px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .cova-chatbot-widget-container {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 48px);
      max-height: calc(100vh - 124px);
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 999998;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .cova-chatbot-widget-container.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }

    .cova-chatbot-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    @media (max-width: 640px) {
      .cova-chatbot-widget-container {
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
      }
      
      .cova-chatbot-widget-container.open ~ .cova-chatbot-widget-btn {
        display: none;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);

  const container = document.createElement('div');
  container.className = 'cova-chatbot-widget-container';
  container.id = 'cova-chatbot-widget-container';

  container.innerHTML = `
    <iframe class="cova-chatbot-widget-iframe" src="cova-chatbot.html?widget=true" title="Cova Chatbot"></iframe>
  `;
  document.body.appendChild(container);

  const btn = document.createElement('button');
  btn.className = 'cova-chatbot-widget-btn';
  btn.id = 'cova-chatbot-widget';
  btn.setAttribute('aria-label', 'Toggle Chatbot');
  
  const chatIcon = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  
  btn.innerHTML = chatIcon;
  document.body.appendChild(btn);

  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      container.classList.add('open');
      btn.innerHTML = closeIcon;
    } else {
      container.classList.remove('open');
      btn.innerHTML = chatIcon;
    }
  });

  window.addEventListener('message', (event) => {
    if (event.data === 'close-cova-chatbot') {
      isOpen = false;
      container.classList.remove('open');
      btn.innerHTML = chatIcon;
    }
  });
})();