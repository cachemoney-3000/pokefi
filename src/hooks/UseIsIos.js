import { useEffect, useState } from 'react';

// Custom hook to detect if the device is iOS
function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
	const checkIOS = () => {
		return (
			/iPad|iPhone|iPod/.test(navigator.userAgent) ||
			(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
	    );
	};

	setIsIOS(checkIOS());
  }, []);

  return isIOS;
}

export default useIsIOS;
