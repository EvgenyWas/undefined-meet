import { useEffect } from 'react';

// --- Attributes for BMC ---
const attrs = {
  name: 'BMC-Widget',
  cfasync: 'false',
  id: 'yauheniv',
  description: 'Support me on Buy me a coffee :)',
  color: '#4eee85',
  position: 'Right',
  x_margin: '24',
  y_margin: '18',
};

export function useBuyMeACoffeeWidget() {
  useEffect(() => {
    // --- Load font (as original script does) ---
    try {
      // Mirrors: new FontFace("Avenir Book", "url(...)").load()
      const ff = new FontFace(
        'Avenir Book',
        'url(https://cdn.buymeacoffee.com/bmc_widget/font/710789a0-1557-48a1-8cec-03d52d663d74.eot)',
      );
      ff.load()
        .then((font) => {
          (document as any).fonts?.add?.(font);
        })
        .catch(() => {});
    } catch {
      // ignore if FontFace unsupported
    }

    // Precompute height as in original
    const initialI = window.innerHeight - 120;
    const mq = window.matchMedia('(min-width: 480px)');

    // === Button === (e)
    const btn = document.createElement('div');
    btn.id = 'bmc-wbtn';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.width = '64px';
    btn.style.height = '64px';
    btn.style.background = attrs.color;
    btn.style.color = 'white';
    btn.style.borderRadius = '32px';
    btn.style.position = 'fixed';
    btn.style.right = `${attrs.x_margin}px`;
    btn.style.bottom = `${attrs.y_margin}px`;
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,.15)';
    btn.innerHTML =
      '<img src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg" alt="Buy Me A Coffee" style="height: 36px; width: 36px; margin: 0; padding: 0;">';
    btn.style.zIndex = '9999';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = '600';
    btn.style.transition = '.25s ease all';

    // === Overlay container === (l)
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '0';
    overlay.style.height = '0';
    overlay.style.background = 'rgba(0, 0, 0, 0)';
    overlay.style.textAlign = 'center';
    overlay.style.zIndex = '9999999';

    // === Close button === (n)
    const closeBtn = document.createElement('div');
    overlay.appendChild(closeBtn);
    closeBtn.setAttribute('id', 'bmc-close-btn');
    closeBtn.style.position = 'fixed';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.display = 'flex';
    closeBtn.style.visibility = 'hidden';
    closeBtn.style.borderRadius = '100px';
    closeBtn.style.width = '40px';
    closeBtn.style.height = '40px';
    closeBtn.innerHTML =
      '<svg style="width: 16px;height:16px;" width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M2.45156 27.6516L0.351562 25.5516L11.9016 14.0016L0.351562 2.45156L2.45156 0.351562L14.0016 11.9016L25.5516 0.351562L27.6516 2.45156L16.1016 14.0016L27.6516 25.5516L25.5516 27.6516L14.0016 16.1016L2.45156 27.6516Z" fill="#666"/>\n  </svg>\n';
    closeBtn.style.top = '16px';
    closeBtn.style.right = '16px';
    closeBtn.style.zIndex = '9999999';
    closeBtn.onclick = function () {
      // original sets empty function; keeping parity (overlay click does the closing)
    };

    // === Iframe === (a)
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'bmc-iframe');
    iframe.setAttribute('allow', 'publickey-credentials-get *; payment *');
    iframe.title = 'Buy Me a Coffee';
    iframe.style.position = 'fixed';
    iframe.style.margin = '0';
    iframe.style.border = '0';
    if (mq.matches) {
      iframe.style.right = `${attrs.x_margin}px`;
      iframe.style.bottom = `${parseInt(attrs.y_margin, 10) + 72}px`;
    } else {
      iframe.style.left = '0px';
      iframe.style.right = '0px';
      iframe.style.top = '0px';
      iframe.style.bottom = '32px';
    }
    iframe.style.height = '0';
    iframe.style.opacity = '0';
    if (mq.matches) {
      iframe.style.width = 'calc(100% - 38px)';
      iframe.style.width = '420px';
      iframe.style.maxWidth = '420px';
      iframe.style.minHeight = `${initialI}px`;
      iframe.style.maxHeight = `${initialI}px`;
    } else {
      iframe.style.width = 'calc(100% - 38px)';
      iframe.style.width = '100vw';
      iframe.style.maxWidth = '100vw';
      iframe.style.minHeight = '100%';
      iframe.style.maxHeight = '100%';
    }
    iframe.style.borderRadius = '10px';
    iframe.style.boxShadow = '-6px 0px 30px rgba(13, 12, 34, 0.1)';
    iframe.style.background = '#fff';
    iframe.style.backgroundImage =
      'url(https://cdn.buymeacoffee.com/assets/img/widget/loader.svg)';
    iframe.style.backgroundPosition = 'center';
    iframe.style.backgroundSize = '64px';
    iframe.style.backgroundRepeat = 'no-repeat';
    iframe.style.zIndex = '999999';
    iframe.style.transition = 'all .25s ease';
    iframe.style.transformOrigin = 'right bottom';
    iframe.style.transform = 'scale(0)';
    (iframe.style as any).userSelect = 'none';

    // Append (order mirrors original)
    document.body.appendChild(overlay);
    overlay.appendChild(iframe);
    document.body.appendChild(btn);

    // Interactions
    let clicks = 0;
    btn.onclick = function () {
      if (!clicks) {
        iframe.src =
          'https://www.buymeacoffee.com/widget/page/' +
          attrs.id +
          '?description=' +
          encodeURIComponent(attrs.description) +
          '&color=' +
          encodeURIComponent(attrs.color);
      }

      clicks++;

      // expand overlay to full screen
      overlay.style.width = '100%';
      overlay.style.height = '100%';

      // show iframe
      iframe.style.width = '420px';
      iframe.style.height = `${window.innerHeight - 120}px`;
      iframe.style.transform = 'scale(1)';
      iframe.style.opacity = '1';

      // show close on small screens after 150ms
      if (!mq.matches) {
        setTimeout(function () {
          closeBtn.style.visibility = 'visible';
        }, 150);
      }

      // animate button
      btn.style.transform = 'scale(1)';
      btn.style.transition = '.25s ease all';

      // change icon to chevron
      btn.innerHTML =
        '<svg style="width: 16px;height:16px;" width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.1133 0L8 6.11331L1.88669 0L0 1.88663L8 9.88663L16 1.88663L14.1133 0Z" fill="white"/></svg>';
    };

    btn.onmouseover = function () {
      btn.style.transform = 'scale(1.1)';
      btn.style.transition = '.25s ease all';
    };
    btn.onmouseleave = function () {
      btn.style.transform = 'scale(1)';
      btn.style.transition = '.25s ease all';
    };
    btn.onmousedown = function () {
      btn.style.transform = 'scale(0.90)';
      btn.style.transition = '.25s ease all';
    };
    overlay.onmouseover = function () {
      overlay.style.cursor = 'pointer';
      btn.style.transform = 'scale(1)';
      btn.style.transition = '.25s ease all';
    };
    overlay.onmouseleave = function () {
      btn.style.transform = 'scale(1)';
      btn.style.transition = '.25s ease all';
    };

    // Click outside to close (overlay click)
    overlay.onclick = function () {
      overlay.style.width = '0';
      overlay.style.height = '0';
      iframe.style.height = '0';
      iframe.style.opacity = '0';
      btn.style.transform = 'scale(1)';
      btn.style.transition = '.25s ease all';
      iframe.style.transform = 'scale(0)';
      if (!mq.matches) {
        closeBtn.style.visibility = 'hidden';
        setTimeout(function () {}, 100);
      }

      // restore cup icon
      btn.innerHTML =
        '<img src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg" alt="Buy Me A Coffee" style="height: 36px; width: 36px; margin: 0; padding: 0;">';
    };

    overlay.onmousedown = function () {
      btn.style.transform = 'scale(0.90)';
      btn.style.transition = '.25s ease all';
    };

    // Cleanup
    return () => {
      try {
        btn.remove();
        overlay.remove();
      } catch {}
    };
  }, []);
}
