import { useState, useCallback } from 'react';

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [copyStatus, setCopyStatus] = useState('idle'); // 'idle', 'copying', 'success', 'error'

  const copyToClipboard = useCallback(async (text) => {
    console.log('useCopyToClipboard: attempting to copy:', text);
    
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      setCopyStatus('error');
      return false;
    }

    try {
      setCopyStatus('copying');
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setCopyStatus('success');
      console.log('useCopyToClipboard: copy successful');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setCopyStatus('idle');
        setCopiedText(null);
      }, 2000);
      
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
      return false;
    }
  }, []);

  return {
    copyToClipboard,
    copiedText,
    copyStatus,
    isCopying: copyStatus === 'copying',
    isSuccess: copyStatus === 'success',
    isError: copyStatus === 'error'
  };
}; 