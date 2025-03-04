import '../assets/css/Preloader.css';
import { useEffect, useRef, useState } from 'react';

const messages = [
  { text: 'It all just kinda happened...', sender: 'me' },
  { text: 'You never really knew about tech, did you?', sender: 'speaker' },
  { text: 'Nope. Not at all.', sender: 'me' },
  { text: 'Then you found Myteacher Institute.', sender: 'speaker' },
  { text: 'Yeah, and I met Cadet Tonye—he gave me a glimpse of coding, but I wanted to know more.', sender: 'me' },
  { text: 'So you went deeper.', sender: 'speaker' },
  { text: 'Way deeper. One tutorial turned into another, then another... before I knew it, I was building full-stack applications!', sender: 'me' },
  { text: 'And now, the digital world calls you... (And he turned out to be...)', sender: 'speaker' },
  { text: 'You know the name.', sender: 'me' },
  { text: 'Richard Raphael!', sender: 'speaker' },
  { text: 'That\'s right, folks!', sender: 'me' },
  { text: 'But coding isn\'t a solo mission.', sender: 'speaker' },
  { text: 'Nope. I needed a squad.', sender: 'me' },
  { text: 'So you became an instructor, a speaker, a leader in the tech space.', sender: 'speaker' },
  { text: 'And now, I guide others on this wild, unpredictable journey of web meelopment!', sender: 'me' },
  { text: 'So tell me... what do you do now?', sender: 'speaker' },
  { text: 'I push commits, squash bugs, and deploy scalable solutions.', sender: 'me' },
  { text: 'And how does that feel?', sender: 'speaker' },
  { text: 'Feels gooooood!', sender: 'me' },
  { text: 'Push it!', sender: 'speaker' },
  { text: 'Up the repo!', sender: 'me' },
  { text: 'Ah, production crashed!', sender: 'speaker' },
  { text: 'Ha!', sender: 'me' }
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