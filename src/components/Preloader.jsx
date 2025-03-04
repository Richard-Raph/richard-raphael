import '../assets/css/Preloader.css';
import { useEffect, useRef, useState } from 'react';

const messages = [
  { text: 'It all just kinda happened...', sender: 'dev' },
  { text: 'You never really knew about tech, did you?', sender: 'mentor' },
  { text: 'Nope. Not at all.', sender: 'dev' },
  { text: 'Then you found Myteacher Institute.', sender: 'mentor' },
  { text: 'Yeah, and I met Cadet Tonye—he gave me a glimpse of coding, but I wanted to know more.', sender: 'dev' },
  { text: 'So you went deeper.', sender: 'mentor' },
  { text: 'Way deeper. One tutorial turned into another, then another... before I knew it, I was building full-stack applications!', sender: 'dev' },
  { text: 'And now, the digital world calls you... (And he turned out to be...)', sender: 'mentor' },
  { text: 'You know the name.', sender: 'dev' },
  { text: 'Richard Raphael!', sender: 'mentor' },
  { text: 'That\'s right, folks!', sender: 'dev' },
  { text: 'But coding isn\'t a solo mission.', sender: 'mentor' },
  { text: 'Nope. I needed a squad.', sender: 'dev' },
  { text: 'So you became an instructor, a mentor, a leader in the tech space.', sender: 'mentor' },
  { text: 'And now, I guide others on this wild, unpredictable journey of web development!', sender: 'dev' },
  { text: 'So tell me... what do you do now?', sender: 'mentor' },
  { text: 'I push commits, squash bugs, and deploy scalable solutions.', sender: 'dev' },
  { text: 'And how does that feel?', sender: 'mentor' },
  { text: 'Feels gooooood!', sender: 'dev' },
  { text: 'Push it!', sender: 'mentor' },
  { text: 'Up the repo!', sender: 'dev' },
  { text: 'Ah, production crashed!', sender: 'mentor' },
  { text: 'Ha!', sender: 'dev' }
];

export default function Preloader({ onComplete }) {
  const chatRef = useRef(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentMessages, setCurrentMessages] = useState([]);

  useEffect(() => {
    if (messageIndex >= messages.length) {
      setTimeout(() => onComplete(), 2000);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentMessages(prev => [...prev, messages[messageIndex]]);
      setMessageIndex(prev => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [messageIndex, onComplete]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentMessages]);

  return (
    <div className='chat-container' ref={chatRef}>
      {currentMessages.map((msg, idx) => (
        <p key={idx} className={`${msg.sender} visible`}>{msg.text}</p>
      ))}
    </div>
  );
}