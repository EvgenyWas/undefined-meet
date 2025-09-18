import { memo, useEffect, useState, type ElementType } from 'react';

interface IProps {
  text: string;
  as?: ElementType;
  className?: string;
}

const TypingOutText = ({ text, as = 'p', className }: IProps) => {
  const [index, setIndex] = useState<number>(0);

  const Tag = as;

  useEffect(() => {
    let i = 0;
    let timeoutID: NodeJS.Timeout | undefined;
    const tick = () => {
      if (i < text.length) {
        // increment index by 1-3 chars for speed
        i += Math.floor(Math.random() * 5) + 5;
        setIndex(Math.min(i, text.length));
        timeoutID = setTimeout(tick, 2 + Math.random() * 5);
      }
    };

    tick();

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    };
  }, [text]);

  return <Tag className={className}>{text.slice(0, index)}</Tag>;
};

export default memo(TypingOutText);
