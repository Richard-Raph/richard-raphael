import './Hero.css';
import { Link } from 'react-router-dom';
import { HiPlus, HiOutlineArrowDown } from 'react-icons/hi2';

const Hero = () => {
    return (
        <section className='hero'>
            <div className='hero-container'>
                <span className='glare outer'></span>
                <div className='window-outline'>
                    <span className='glare inner'></span>
                    <div className='window-main'>
                        <div className='shine'>
                            <div className='small'></div>
                            <div className='big'></div>
                        </div>
                        <div className='window-bar'>
                            <div className='window-dots'>
                                <span className='dot red'></span>
                                <span className='dot yellow'></span>
                                <span className='dot green'></span>
                            </div>
                            <HiPlus />
                        </div>
                        <div className='window-content'>
                            <div className='hero-content'>
                                <div className='text-hero'>
                                    I craft products, interactions &amp; 
                                    <span className='text-hero-serif'>stories.</span>
                                </div>
                                <div className='hero-about-grid'>
                                    <span className='hero-about-null'></span>
                                    <div>
                                        <div className='text-hero-about'>
                                            Instructor at <Link to='htps://myteacher.ng'>Myteacher</Link>. Based in Port Harcourt.<br />
                                            <span className='text-hero-about-formerly'>Formerly at Google and RBC.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className='window-grain'></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='hero-fade'>
                <Link><HiOutlineArrowDown /></Link>
            </div>
        </section>
    );
}

export default Hero;
{/* <div className='paper'>
    <div className='paper-content'>
        <textarea className='text' autoFocus></textarea>
    </div>
</div> */}

{/* <div className='paper'>
  <div className='lines'>
    <div className='text' contentEditable spellCheck='false'></div>
  </div>
  <div className='holes hole-top'></div>
  <div className='holes hole-middle'></div>
  <div className='holes hole-bottom'></div>
</div> */}

{/* <div className='notepad'>
  <div className='top'></div>
  <div className='paper' contentEditable='true'></div>
</div> */}

{/* <div className='paper'>
  <div className='pin'>
    <div className='shadow'></div>
    <div className='metal'></div>
    <div className='bottom-circle'></div>
  </div>
  <p>Contact me</p>
</div> */}