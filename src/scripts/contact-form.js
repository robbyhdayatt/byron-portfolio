export function init() {
  const form = document.querySelector('.contact-form');
  
  // Copy Email button functionality
  const copyBtn = document.querySelector('#copy-email-btn');
  const copyBtnText = document.querySelector('#copy-btn-text');
  const emailText = document.querySelector('#email-text');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        if (copyBtnText) copyBtnText.textContent = 'Tersalin! ✓';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Salin Email';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy email: ', err);
      });
    });
  }

  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const messageEl = document.querySelector('.form-message') || document.createElement('div');
  
  if (!document.querySelector('.form-message')) {
    messageEl.className = 'form-message';
    form.appendChild(messageEl);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      messageEl.textContent = 'Silakan isi semua kolom yang diperlukan.';
      messageEl.style.color = '#FFB74D';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      messageEl.textContent = 'Format email tidak valid.';
      messageEl.style.color = '#FFB74D';
      return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    messageEl.textContent = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '995fc307-60f6-41a8-836d-0599e1c97da2',
          name, 
          email, 
          message,
          subject: 'Pesan Baru dari Portfolio (byron.my.id)'
        })
      });

      const result = await response.json();

      if (response.ok) {
        messageEl.textContent = 'Pesan berhasil terkirim! Terima kasih.';
        messageEl.style.color = '#90CAF9';
        form.reset();
      } else {
        messageEl.textContent = result.message || 'Terjadi kesalahan. Silakan coba lagi.';
        messageEl.style.color = '#FFB74D';
      }
    } catch (error) {
      messageEl.textContent = 'Terjadi gangguan jaringan. Silakan coba lagi nanti.';
      messageEl.style.color = '#FFB74D';
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}
