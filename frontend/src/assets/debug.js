// Simple tool to check backend connectivity
console.log('Debug script loaded');
window.testBackendConnection = function() {
  console.log('Testing backend connection...');
  fetch('/api')
    .then(response => response.json())
    .then(data => {
      console.log('Backend response:', data);
      alert('Backend connection successful! Response: ' + JSON.stringify(data));
    })
    .catch(error => {
      console.error('Backend connection error:', error);
      alert('Backend connection failed! Error: ' + error.message);
    });
};
