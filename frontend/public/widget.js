(function() {
  if (document.getElementById('born-ai-widget-container')) return;

  const agentId = window.BORN_AI_AGENT_ID;
  if (!agentId) {
    console.error('Born AI Widget: window.BORN_AI_AGENT_ID is not defined.');
    return;
  }

  // Get the host of the current script to know where to load the iframe from
  const currentScript = document.currentScript;
  let host = 'http://localhost:3000'; // Default
  if (currentScript && currentScript.src) {
    const url = new URL(currentScript.src);
    host = url.origin;
  }

  // Create Container
  const container = document.createElement('div');
  container.id = 'born-ai-widget-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  container.style.fontFamily = 'sans-serif';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'flex-end';

  // Create Iframe (hidden by default)
  const iframe = document.createElement('iframe');
  iframe.src = `${host}/embed/${agentId}`;
  iframe.style.width = '380px';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
  iframe.style.marginBottom = '16px';
  iframe.style.display = 'none';
  iframe.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  iframe.style.opacity = '0';
  iframe.style.transform = 'translateY(20px)';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.colorScheme = 'normal';
  iframe.allow = 'microphone; clipboard-write';

  // Create Toggle Button
  const button = document.createElement('button');
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.borderRadius = '50%';
  button.style.backgroundColor = '#8b5cf6'; // Purple-500
  button.style.color = '#ffffff';
  button.style.border = 'none';
  button.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
  button.style.cursor = 'pointer';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
  
  // Chat Icon SVG
  const chatIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  // Close Icon SVG
  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  button.innerHTML = chatIcon;

  let isOpen = false;

  button.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.display = 'block';
      setTimeout(() => {
        iframe.style.opacity = '1';
        iframe.style.transform = 'translateY(0)';
      }, 10);
      button.innerHTML = closeIcon;
      button.style.backgroundColor = '#334155'; // Slate-700
    } else {
      iframe.style.opacity = '0';
      iframe.style.transform = 'translateY(20px)';
      setTimeout(() => {
        iframe.style.display = 'none';
      }, 300);
      button.innerHTML = chatIcon;
      button.style.backgroundColor = '#8b5cf6';
    }
  });

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });

  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);

  // Responsive adjustments for mobile
  const mediaQuery = window.matchMedia('(max-width: 480px)');
  function handleMobileChange(e) {
    if (e.matches) {
      iframe.style.width = 'calc(100vw - 40px)';
      iframe.style.height = 'calc(100vh - 120px)';
    } else {
      iframe.style.width = '380px';
      iframe.style.height = '600px';
    }
  }
  mediaQuery.addListener(handleMobileChange);
  handleMobileChange(mediaQuery);

})();
