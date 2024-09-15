import { useState, useEffect } from 'react';

export let toast = function(_message: string, _duration?: number): void {}
let timeout: ReturnType<typeof setTimeout> | null = null;

export default function InfoPanel() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    if (toastMessage) {
      setIsVisible(true);
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setToastMessage(null), 400); // Clear message after fade out
      }, 2000); // Show for 3 seconds
    }
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string, duration: number = 2000) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setToastMessage(message);
    setIsVisible(true);
    timeout = setTimeout(() => {
      setIsVisible(false);
      timeout = setTimeout(() => {
        setToastMessage(null);
        timeout = null;
      }, 400);
    }, duration);
  }

  useEffect(() => {
    toast = showToast;
  }, )


  return (
    <div className="w-96 bg-blue-950 p-6 rounded-lg relative text-xl">
      <h2 className="text-2xl font-bold mb-4">Info Panel</h2>
      {toastMessage ? (
        <div
          className={`absolute bottom-6 left-6 right-6 bg-white text-black p-3 rounded transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {toastMessage}
        </div>
      ) : ""}
    </div>
  );
}