const CLAUDE_API_KEY = "YOUR_API_KEY_GOES_HERE";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'summarize') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ summary: 'Error: Unable to retrieve active tab.' });
      } else {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: getPageContent,
          },
          function(results) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              sendResponse({ summary: 'Error: Unable to retrieve page content.' });
            } else {
              const pageContent = results[0].result;
              summarizeContent(pageContent)
                .then(summary => {
                  sendResponse({ summary: summary });
                })
                .catch(error => {
                  console.error('Error:', error);
                  sendResponse({ summary: 'Error: Unable to generate summary.' });
                });
            }
          }
        );
      }
    });
    return true;
  }
});

function getPageContent() {
  const pageContent = document.body.innerText;
  return pageContent;
}

async function summarizeContent(content) {
  const apiKey = CLAUDE_API_KEY;
  const prompt = `Please summarize the following webpage content:\n\n${content}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      'Anthropic-Version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}