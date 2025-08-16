import { useEffect } from 'react';

interface MailerLiteFormHostProps {
  html: string;
  onSuccess?: () => void;
}

export default function MailerLiteFormHost({ html, onSuccess }: MailerLiteFormHostProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://groot.mailerlite.com/js/w/webforms.min.js?v176e10baa5e7ed80d35ae235be3d5024';
    script.async = true;
    document.body.appendChild(script);

    const observer = new MutationObserver(() => {
      const successDiv = document.querySelector('.ml-form-successBody');
      if (successDiv && successDiv.offsetParent !== null && onSuccess) {
        onSuccess();
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.removeChild(script);
      observer.disconnect();
    };
  }, [onSuccess]);

  return (
    <div
      className="max-w-xl mx-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
