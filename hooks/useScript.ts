
import { useEffect } from 'react';

// A simple hook to load an external script
export const useScript = (url: string) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [url]);
};