import { useEffect, useState } from 'react';

export const useKeyPress = (targetKey: string): boolean => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  const onKeyDown = ({ key }: { key: string }): void => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };

  const onKeyUp = ({ key }: { key: string }): void => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keyPressed;
};
