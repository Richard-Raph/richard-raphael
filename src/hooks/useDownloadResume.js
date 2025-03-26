import { useCallback } from 'react';

const RESUME_URL = '/RICHARD.pdf';
const RESUME_FILENAME = 'Richard_Raphael.pdf';

export const useDownloadResume = () => {
  const downloadResume = useCallback(({ openInNewTab = false } = {}) => {
    if (openInNewTab) {
      window.open(RESUME_URL, '_blank');
    }

    const link = document.createElement('a');
    link.href = RESUME_URL;
    link.download = RESUME_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return downloadResume;
};