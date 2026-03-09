// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-copy-bypass') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' });
      }
    });
  }
});