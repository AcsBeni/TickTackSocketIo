
  const messageCard = document.querySelector('.app-card-message');

  if (messageCard) {
    setTimeout(() => {
      messageCard.classList.add('fade-out');
    }, 3000);
    messageCard.addEventListener('transitionend', () => {
      messageCard.remove();
    });
  }
