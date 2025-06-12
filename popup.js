document.getElementById('summarizeBtn').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: 'summarize' }, function(response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      updateSummary('Error: Unable to generate summary.');
    } else if (response && response.summary) {
      updateSummary(response.summary);
    } else {
      updateSummary('Error: Unable to generate summary.');
    }
  });
});

function updateSummary(summary) {
  document.getElementById('summary').textContent = summary;
}
