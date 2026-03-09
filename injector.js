(function() {
  'use strict';

  // 防止重复注入
  if (window.__copyBypassHookInstalled) return;
  window.__copyBypassHookInstalled = true;

  console.log('[CopyBypass] Hook 注入开始');

  // 1. Hook addEventListener
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'copy' || type === 'cut' || type === 'contextmenu' || type === 'selectstart') {
      const wrappedListener = function(e) {
        e.stopImmediatePropagation();
        return true;
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // 2. Hook preventDefault
  const originalPreventDefault = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function() {
    if (this.type === 'copy' || this.type === 'cut' || this.type === 'contextmenu' || this.type === 'selectstart') {
      console.log('[CopyBypass] Blocked preventDefault for:', this.type);
      return;
    }
    return originalPreventDefault.call(this);
  };

  // 3. Hook stopPropagation
  const originalStopPropagation = Event.prototype.stopPropagation;
  Event.prototype.stopPropagation = function() {
    if (this.type === 'copy' || this.type === 'cut') {
      console.log('[CopyBypass] Allowed propagation for:', this.type);
      return;
    }
    return originalStopPropagation.call(this);
  };

  // 4. 移除已存在的事件监听器
  document.querySelectorAll('body, html, *').forEach(el => {
    const clone = el.cloneNode(true);
    el.parentNode?.replaceChild(clone, el);
  });

  // 5. Hook execCommand
  const originalExecCommand = document.execCommand;
  document.execCommand = function(command) {
    if (command === 'copy' || command === 'cut') {
      console.log('[CopyBypass] execCommand allowed:', command);
    }
    return originalExecCommand.apply(this, arguments);
  };

  // 6. 解除 CSS 限制
  const style = document.createElement('style');
  style.id = '__copy-bypass-style';
  style.textContent = `
    * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
      -webkit-touch-callout: default !important;
      -webkit-user-drag: auto !important;
    }
  `;
  document.head.appendChild(style);

  console.log('[CopyBypass] Hook 注入完成');
})();