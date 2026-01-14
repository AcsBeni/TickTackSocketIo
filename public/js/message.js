  // Select the message container
  const messageCard = document.querySelector('.app-card-message');

  if (messageCard) {
    // Wait 3 seconds, then add fade-out class
    setTimeout(() => {
      messageCard.classList.add('fade-out');
    }, 3000);
    console.log("hi")
    // Optionally, remove it from DOM after fade-out completes
    messageCard.addEventListener('transitionend', () => {
      messageCard.remove();
    });
  }
