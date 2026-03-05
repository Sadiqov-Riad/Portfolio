"use client";

import { useState, useEffect } from "react";

/* ── Typing hook — starts when `trigger` becomes true ── */
function useTyping(text: string, speed = 60, trigger = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [trigger, text, speed]);

  return { displayed, done };
}

/* ── Live clock ── */
function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function HeroOverlay() {
  const name = useTyping("Riad Sadiqov", 75, true);
  const role = useTyping("Software Engineer", 60, name.done);
  const liveTime = useClock();

  const [frozenTime, setFrozenTime] = useState("");
  useEffect(() => {
    if (role.done && !frozenTime && liveTime) setFrozenTime(liveTime);
  }, [role.done, liveTime, frozenTime]);

  const clockTyped = useTyping(frozenTime, 55, !!frozenTime);
  const displayedTime = clockTyped.done ? liveTime : clockTyped.displayed;

  return (
    <div className="hero-overlay">
      <div className="hero-line hero-name">
        {name.displayed}
        {!name.done && <span className="hero-cursor" />}
      </div>
      {name.done && (
        <div className="hero-line hero-name">
          {role.displayed}
          {!role.done && <span className="hero-cursor" />}
        </div>
      )}
      {frozenTime && (
        <div className="hero-line hero-clock">
          {displayedTime}
          {!clockTyped.done && <span className="hero-cursor" />}
        </div>
      )}
    </div>
  );
}
