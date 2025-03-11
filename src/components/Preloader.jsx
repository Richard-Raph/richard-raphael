// import '../assets/css/Preloader.css';
// import { useEffect, useRef, useState } from 'react';

// const messages = [
//   { text: 'You never really knew much about tech, did you?', sender: 'speaker' },
//   { text: 'Not at first.', sender: 'me' },
//   { text: 'Then you found <a href="https://myteacher.ng" target="_blank" rel="noopener noreferrer">Myteacher Institute</a>.', sender: 'speaker' },
//   { text: 'Yeah, and met Cadet Tonye—he introduced me to coding.', sender: 'me' },
//   { text: 'And then?', sender: 'speaker' },
//   { text: 'One project turned into another... and soon, I was building full-stack applications.', sender: 'me' },
//   { text: 'And now?', sender: 'speaker' },
//   { text: '<a href="https://www.linkedin.com/in/rich-tech123/" target="_blank" rel="noopener noreferrer">Richard Raphael</a>, software engineer and instructor.', sender: 'me' },
//   { text: 'That’s right.', sender: 'speaker' },
//   { text: 'How does it feel?', sender: 'speaker' },
//   { text: 'Feels great—solving problems, building solutions, and sharing knowledge.', sender: 'me' },
//   { text: 'Push it!', sender: 'speaker' },
//   { text: 'Up the repo!', sender: 'me' },
//   { text: 'Ah, production crashed!', sender: 'speaker' },
//   { text: 'Debug mode activated.😒', sender: 'me' },
// ];

// export default function Preloader({ onComplete }) {
//   const chatRef = useRef(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingText, setTypingText] = useState('');
//   const [messageIndex, setMessageIndex] = useState(0);
//   const [currentMessages, setCurrentMessages] = useState([]);

//   useEffect(() => {
//     if (messageIndex >= messages.length) {
//       setTimeout(() => onComplete(), 2000);
//       return;
//     }

//     const nextMessage = messages[messageIndex];

//     setIsTyping(true);
//     setTypingText('');

//     let charIndex = 0;
//     const typeInterval = setInterval(() => {
//       setTypingText(nextMessage.text.slice(0, charIndex + 1));
//       charIndex++;

//       if (charIndex === nextMessage.text.length) {
//         clearInterval(typeInterval);
//         setTimeout(() => {
//           setCurrentMessages((prev) => [...prev, nextMessage]);
//           setMessageIndex((prev) => prev + 1);
//           setIsTyping(false);
//         }, 500);
//       }
//     }, 30 + Math.random() * 20);

//     return () => clearInterval(typeInterval);
//   }, [messageIndex, onComplete]);

//   useEffect(() => {
//     // Generate stars dynamically
//     const starsContainer = document.querySelector('.chat-overlay');
//     if (starsContainer) {
//       for (let i = 0; i < 100; i++) {
//         let star = document.createElement('span');
//         let size = Math.random() * 3;
//         let duration = Math.random() * 5 + 5;

//         star.style.width = `${size}px`;
//         star.style.height = `${size}px`;
//         star.style.top = `${Math.random() * 100}vh`;
//         star.style.left = `${Math.random() * 100}vw`;
//         star.style.animationDuration = `${duration}s`;

//         starsContainer.appendChild(star);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [currentMessages, typingText]);

//   return (
//     <section className='chat-overlay'>
//       <div className='chat-container' ref={chatRef}>
//         {currentMessages.map((msg, idx) => (
//           <p key={idx} className={`${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
//         ))}

//         {isTyping && (
//           <p className={`${messages[messageIndex]?.sender} typing`} dangerouslySetInnerHTML={{ __html: typingText }} />
//         )}
//       </div>
//     </section>
//   );
// }


import '../assets/css/Preloader.css';
import { useEffect } from 'react';

export default function Preloader({ onComplete }) {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 5000); // Adjust timing as needed
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="preloader">
      <div className="animation01">
        <div className="rhombus_small">
          <div className="rhombus">
            <div className="border_box">
              {[...Array(4)].map((_, i) => <span key={i} className={`line line0${i + 1}`}></span>)}
              {[...Array(4)].map((_, i) => <span key={i} className={`circle circle0${i + 1}`}></span>)}
              {[...Array(8)].map((_, i) => (
                <span key={i} className={`animation_line ${i % 2 === 1 ? `animation_line0${i + 1}_wrapper` : `animation_line0${i + 1}`}`}></span>
              ))}
            </div>
            <div className="wave">
              <div className="wave_wrapper"><div className="wave_box"></div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="animation02">
        <div className="rhombus_box">
          {[...Array(2)].map((_, i) => (
            <span key={i} className={`rhombus_item_wrapper rhombus_item0${i + 1}_wrapper`}>
              <span className="rhombus_item"></span>
            </span>
          ))}
        </div>
        <div className="double_content">
          {['dotted', 'white', 'gray', 'orange'].map((color, i) => (
            <div key={i} className={`double_wrapper02 ${color}02`}>
              <div className={`double_wrapper01 ${color}01`}></div>
            </div>
          ))}
        </div>
        <div className="name">
          <p>KURI-CHAN</p>
          <span className="name_circle01"></span>
          <span className="name_circle02"></span>
        </div>
      </div>
    </div>
  );
}