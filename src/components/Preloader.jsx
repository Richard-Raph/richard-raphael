import '../assets/css/Preloader.css';
import { useEffect, useRef, useState } from 'react';

const messages = [
  { text: 'It all just kinda happened...', sender: 'me' },
  { text: 'You never really knew about tech, did you?', sender: 'speaker' },
  { text: 'Nope. Not at all.', sender: 'me' },
  { text: 'Then you found <a href="https://myteacher.ng" target="_blank" rel="noopener noreferrer">Myteacher Institute</a>.', sender: 'speaker' },
  { text: 'Yeah, and I met <a href="https://example.com/cadet-tonye" target="_blank" rel="noopener noreferrer">Cadet Tonye</a>—he gave me a glimpse of coding, but I wanted to know more.', sender: 'me' },
  { text: 'So you went deeper.', sender: 'speaker' },
  { text: 'Way deeper. One tutorial turned into another, then another... before I knew it, I was building full-stack applications!', sender: 'me' },
  { text: 'And now, the digital world calls you... (And he turned out to be...)', sender: 'speaker' },
  { text: 'You know the name.', sender: 'me' },
  { text: '<a href="https://linkedin.com/in/richard-raphael" target="_blank" rel="noopener noreferrer">Richard Raphael</a>!', sender: 'speaker' },
  { text: 'That\'s right, folks!', sender: 'me' },
  { text: 'But coding isn\'t a solo mission.', sender: 'speaker' },
  { text: 'Nope. I needed a squad.', sender: 'me' },
  { text: 'So you became an instructor, a speaker, a leader in the tech space.', sender: 'speaker' },
  { text: 'And now, I guide others on this wild, unpredictable journey of web development!', sender: 'me' },
  { text: 'And now?', sender: 'speaker' },
  { text: 'I push commits, squash bugs, and deploy scalable solutions.', sender: 'me' },
  { text: 'And how does that feel?', sender: 'speaker' },
  { text: 'Feels gooooood!', sender: 'me' },
  { text: 'Push it!', sender: 'speaker' },
  { text: 'Up the repo!', sender: 'me' },
  { text: 'Ah, production crashed!', sender: 'speaker' },
  { text: 'Ha!', sender: 'me' },
];

export default function Preloader({ onComplete }) {
  const chatRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentMessages, setCurrentMessages] = useState([]);

  useEffect(() => {
    if (messageIndex >= messages.length) {
      setTimeout(() => onComplete(), 2000);
      return;
    }

    const nextMessage = messages[messageIndex];

    setIsTyping(true);
    setTypingText('');

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      setTypingText(nextMessage.text.slice(0, charIndex + 1));
      charIndex++;

      if (charIndex === nextMessage.text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentMessages((prev) => [...prev, nextMessage]);
          setMessageIndex((prev) => prev + 1);
          setIsTyping(false);
        }, 500);
      }
    }, 30 + Math.random() * 20);

    return () => clearInterval(typeInterval);
  }, [messageIndex, onComplete]);

  useEffect(() => {
    // Generate stars dynamically
    const starsContainer = document.querySelector('.chat-overlay');
    if (starsContainer) {
      for (let i = 0; i < 100; i++) {
        let star = document.createElement('span');
        let size = Math.random() * 3;
        let duration = Math.random() * 5 + 5;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDuration = `${duration}s`;

        starsContainer.appendChild(star);
      }
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentMessages, typingText]);

  return (
    <section className='chat-overlay'>
      <div className='chat-container' ref={chatRef}>
        {currentMessages.map((msg, idx) => (
          <p key={idx} className={`${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
        ))}

        {isTyping && (
          <p className={`${messages[messageIndex]?.sender} typing`} dangerouslySetInnerHTML={{ __html: typingText }} />
        )}
      </div>
    </section>
  );
}