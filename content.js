(function() {
  let isInjected = false;
  let scriptElement = null;

  // 创建悬浮通知
  function createNotification() {
    const div = document.createElement('div');
    div.id = 'copy-bypass-notification';
     const iconUrl = chrome.runtime.getURL('images/image.png');
    div.innerHTML = `
      <div class="cb-icon">
      <img src="${iconUrl}" alt="icon" width="24" height="24">
      </div>
      <div class="cb-text">复制限制已解除</div>
      <div class="cb-hint">按 Ctrl+E 关闭</div>
    `;
    document.body.appendChild(div);
    return div;
  }

  // 移除通知
  function removeNotification() {
    const existing = document.getElementById('copy-bypass-notification');
    if (existing) {
      existing.remove();
    }
  }

  // 注入脚本
  function injectScript() {
    if (isInjected) return;

    scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL('injector.js');
    scriptElement.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(scriptElement);

    createNotification();
    isInjected = true;
    console.log('[CopyBypass] 已开启');
  }

  // 移除注入效果
  function removeInjection() {
    if (!isInjected) return;

    removeNotification();
    // 重新加载页面以清除 hook
    window.location.reload();
    isInjected = false;
  }

  // 切换状态
  function toggle() {
    if (isInjected) {
      removeInjection();
    } else {
      injectScript();
    }
  }

  // 页面内监听 Ctrl+E
  function handleKeyDown(e) {
    // Ctrl+E 或 Cmd+E (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      e.stopPropagation();

      // 确保页面已加载完成
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', toggle, { once: true });
      } else {
        toggle();
      }
    }
  }

  // 添加键盘监听
  document.addEventListener('keydown', handleKeyDown, true);

  console.log('[CopyBypass] 已加载，按 Ctrl+E 开启');
})();