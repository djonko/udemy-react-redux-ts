import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { selectDateStart, start, stop } from '../../redux/recorder';
import './Recorder.css';
import { addZero } from '../../lib/utils';
import { createUserEvent } from '../../redux/user-events';



const Recorder = () => {
  const dispatch = useDispatch();

  const startDate = useSelector(selectDateStart);

  const started = startDate !== '';

  // to rerender this component let use UseState
  const [, setCount] = useState<number>(0);
  // to be able to get previous value on next render we use UseRef hook
  let interval = useRef<number>(0);
  const handleClick = () => {
    if (started) {
      window.clearInterval(interval.current);
      dispatch(createUserEvent())
      dispatch(stop());
    } else {
      dispatch(start());
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  // clean on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  let seconds = started
    ? Math.floor((Date.now() - new Date(startDate).getTime()) / 1000)
    : 0;
  let hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
  seconds -= hours * 60 * 60;
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  seconds -= minutes * 60;
  return (
    <div className={cx('recorder', { 'recorder-started': started })}>
      <button className="recorder-record" onClick={handleClick}>
        <span></span>
      </button>
      <div className="recorder-counter">
        {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
    </div>
  );
};

export default Recorder;
