self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text()
  };

  event.waitUntil(
    self.registration.showNotification('Daily Reminder!', options)
  );
});
