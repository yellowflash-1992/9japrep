import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react'; // Combined imports
import { 
  FaHome, FaFacebookMessenger, FaChevronDown, FaChevronUp, FaUserGraduate,
  FaBookOpen, FaLaptopCode, FaClock, FaLightbulb, FaCertificate 
} from 'react-icons/fa';
import { MdPlayCircle } from 'react-icons/md';
import '../App.css';
import { ExamStateContext } from '../Helpers/Contexts';
import CartButton from '../Components/Header/CartButton';


const Sidebar = ({ isOpen, setIsOpen, onStartExam }) => {

    const { waecConfig } = useContext(ExamStateContext);
    const location = useLocation();

    const isWAECActive = location.pathname.startsWith('/new-') && waecConfig?.examType === 'waec';
    const isNECOActive = location.pathname.startsWith('/new-') && waecConfig?.examType === 'neco';


    const handleStartExam = (e, examType) => {
        e.preventDefault();
        setIsOpen(false);
        onStartExam(examType);
    };

    const [isChatOpen, setIsChatOpen] = useState(false);

    //

    
    const [isStudyOpen, setIsStudyOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);

     const [isExamOpen, setIsExamOpen] = useState(()=> {
        return location.pathname.includes('subject') || 
        location.pathname.includes('exam');
     })


   const toggleExam = ()=> {
    setIsExamOpen(prev => !prev);
   }

   const handleNavLinkClick =()=> {
    if (window.innerWidth < 1024) {
        setIsOpen(false);
    }
   }

   const activeLink =
    'bg-blue-600/30 text-white border-l-4 border-white shadow-md opacity-100';
    const normalLink = "text-slate-300 opacity-70 hover:opacity-100 hover:bg-white/5"

    

    return (
        <>

        <aside className={`
                        fixed inset-y-0 left-0 z-50 w-64 text-white transform transition-transform
                        bg-[#1e292b]/95 md:bg-[#1e292b] md:backdrop-blur-none lg:border-r 
                        duration-300 ease-in-out overflow-y-auto backdrop-blur-xl 
                        lg:border-white/5 hover:overflow-y-auto overflow-x-hidden
                        custom-scrollbar
                        
                        ${isOpen ? "translate-x-0" : "-translate-x-full"}
                        lg:relative lg:translate-x-0 oveflow-y-scroll`}>
                            
                        <div className='p-4 flex items-center justify-between border-b 
                        border-white/10  '>
                                <h2 className='text-xl font-bold italic tracking-tight'>
                                    Exam Portal
                                </h2>
                                <button 
                                onClick={()=> setIsOpen(false)} 
                                className='lg:hidden p-2 hover:text-slate-800
                                 transition-colors focus:outline-none '
                                >
                                    <svg className='w-6 h-6' fill="none" stroke="currentColor"
                                    viewBox='0 0 24 24' >
                                        <path strokeLinecap='round' strokeLinejoin='round'
                                        strokeWidth="5" d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                                     </div>

                                     <div className="p-2 ">
                                    <h2 className='text-2xl font-bold mb-1 p-4'>CBT EXAM</h2>
                                <nav className='space-y-2 flex flex-col  '>
                                    
                                    <Link to="/" className='hover:shadow-md rounded-lg 
                                    py-3' 
                                    onClick={handleNavLinkClick}>
                                    <div className='px-4 hover:text-blue-50 flex  gap-4
                                     items-center w-full'>
                                    <FaHome /> 
                                     Home
                                     </div>
                                     </Link>
                                     
                                    
                     <div className="relative mt-4 ">
                        <button
                            onClick={() => setIsChatOpen(prev => !prev)}
                            className="flex items-center gap-3 hover:text-blue-300 
                            w-full px-4"
                        >
                            <FaFacebookMessenger />
                            <span>Chats</span>
                            {isChatOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        
                            <div className={`
                                absolute left-0 mt-2 rounded-xl transition-all
                             w-40 py-2 z-50  border border-white/20 shadow-2xl 
                            text-slate-300 bg-slate-800/90 backdrop-blur-md duration-500 
                            ease-in-out
                                ${isChatOpen 
                                ? "max-h-60 opacity-100 translate-y-0 pointer-events-auto"
                                : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"}
                                `}>
                                
                                <div className='py-2'>
                            <a href="#" className="block px-4 py-2 text-slate-300
                             hover:bg-blue-600/30 hover:text-white transition-colors">
                                Facebook
                            </a>
                            <a href="#" className="block px-4 py-2 text-slate-300
                             hover:bg-blue-600/30 hover:text-white transition-colors">
                                WhatsApp
                            </a>
                            <a href="#" className="block px-4 py-2 text-slate-300
                             hover:bg-blue-600/30 hover:text-white transition-colors">
                                Instagram
                            </a>
                            </div>
                            
                            </div>
                
                        </div>
                             
                <div className='px-6 h-6 flex items-end'>
                    <hr className={`w-full transition-colors duration-300 border-t ${
                        isExamOpen ? 'border-slate-700' : 'border-transparent'
                    }`} />
                </div>

                     

    <div className="w-full">
        <button
            onClick={toggleExam}
            className="flex justify-between items-center w-full py-2 px-4
                    hover:bg-blue-600/50 rounded-lg transition-colors duration-300"
        >
            <span>Exam</span>
            <FaChevronDown
            className={`transition-transform duration-500 ${
                isExamOpen ? "rotate-180" : ""
            }`}
            />
        </button>

        <div
            className={`overflow-hidden transition-all duration-700 ease-in-out ${
            isExamOpen ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
        >
            <div className="flex flex-col space-y-2 w-full items-start
                             rounded-lg  ">
            
            
             <NavLink
             to='/select-subject'
             onClick={(event) => handleStartExam(event, 'jamb')}
            className={({isActive})=>`flex items-center gap-3 py-3 rounded-4xl w-full 
            cursor-pointer transition-all duration-300 px-4
            ${ isActive ? activeLink : normalLink }`}>
                
            <FaLaptopCode className='text-blue-400' />
            <span>JAMB</span>
            </NavLink>

                
            {/* WAEC Link - Active only when examType is 'waec' */}
                                    <NavLink
                                        to='/new-select-subject'
                                        onClick={(event) => handleStartExam(event, 'waec')}
                                        className={`flex items-center gap-3 py-3 rounded-4xl w-full transition-all px-4 ${isWAECActive ? activeLink : normalLink}`}
                                    >
                                        <FaUserGraduate className='text-rose-400' />
                                        <span>WAEC</span>
                                    </NavLink>

                                    {/* NECO Link - Active only when examType is 'neco' */}
                                    <NavLink
                                        to='/new-select-subject'
                                        onClick={(event) => handleStartExam(event, 'neco')}
                                        className={`flex items-center gap-3 py-3 rounded-4xl w-full cursor-pointer transition-all px-4 ${isNECOActive ? activeLink : normalLink}`}
                                    >
                                        <FaBookOpen className='text-emerald-400' />
                                        <span>NECO</span>
                                    </NavLink>
                                </div>
                            </div>


         <div className='px-6 h-6 flex items-end'>
                    <hr className={`w-full transition-colors duration-300 border-t ${
                    (isExamOpen || isStudyOpen) ? 'border-slate-700' : 'border-transparent'
                    }`} />
                </div>
        
        </div>

         

             <div className="w-full px-2">
        <button
            onClick={() => setIsStudyOpen(prev => !prev)}
            className="flex justify-between items-center w-full px-2 py-2 
                    hover:bg-white/30 rounded-lg transition-colors duration-300"
        >
            <span>Study</span>
            <FaChevronDown
            className={`transition-transform duration-500 ${
                isStudyOpen ? "rotate-180" : ""
            }`}
            />
        </button>

        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isStudyOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
        >
            <div className="flex flex-col space-y-2 
                            bg-white/10 rounded-lg p- backdrop-blur-sm">
            <Link to="https://www.jumia.com.ng/catalog/?q=jamb+waec+books" >
            <div className="flex items-center hover:bg-white/20 px-3 py-2 rounded-md gap-3
            transition">
            <MdPlayCircle />
            
                Video Lessons
            </div>
            </Link>
            <Link to="https://myschool.ng/classroom" >
            <div className="hover:bg-white/20 px-3 py-2 rounded-md flex items-center gap-3
             transition">
            <FaClock />
            
                Study Past Questions
            </div>
            </Link>
            <Link to="https://myschool.ng/classroom" >
            <div className="hover:bg-white/20 px-3 py-2 rounded-md flex items-center gap-3
             transition">
            <FaLightbulb />
            
                Jamb syllabus
            </div>
             </Link>
            <Link to="https://flashlearners.com/jamb-syllabus-brochure-novel/" >
            <div className="hover:bg-white/20 px-3 py-2 rounded-md flex items-center gap-3
            transition">
            <FaCertificate />
            
                Jamb Brochure
            </div>
            </Link>

            </div>
        </div>

                      
                <div className='px-6 h-6 flex items-end'>
                    <hr className={`w-full transition-colors duration-300 border-t ${
                    (isStudyOpen || isMoreOpen) ? 'border-slate-700' : 'border-transparent'
                    }`} />
                </div>
        </div>

         <div className="w-full px-2 mb-8">
        <button
            onClick={() => setIsMoreOpen(prev => !prev)}
            className="flex justify-between items-center w-full px-2 py-2 
                    hover:bg-white/30 rounded-lg transition-colors duration-300"
        >
            <span>More</span>
            <FaChevronDown
            className={`transition-transform duration-500 ${
                isMoreOpen ? "rotate-180" : ""
            }`}
            />
        </button>

        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isMoreOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
        >
            <div className="flex flex-col space-y-2 
                            bg-white/10 rounded-lg p- backdrop-blur-sm">
            
            <div className="flex items-center hover:bg-white/20 px-3 py-2 rounded-md gap-3
            transition">
            <MdPlayCircle />
            <a href="https://ptdf.gov.ng" >
                Event
            </a>
            </div>

            <div className="hover:bg-white/20 px-3 py-2 rounded-md flex items-center gap-3
             transition">
            <FaClock />
            <a href="https://www.jamb.gov.ng/news" >
                News
            </a>
            </div>

            <div className="hover:bg-white/20 px-3 py-2 rounded-md flex items-center gap-3
             transition">
            <FaLightbulb />
            <a href="https://unilag.edu.ng" >
                School Talks
            </a>
            </div>

            <div className="hover:bg-white/20 px-3 py-2 rounded-md flex items-center gap-3
            transition">
            <FaCertificate />
            <a href="https://flashlearners.com" >
                Jamb Brochure
            </a>
            </div>

            </div>
        </div>

        <div className='px-6 h-6 flex items-end'>
                    <hr className={`w-full transition-colors duration-300 border-t ${
                        isMoreOpen ? 'border-slate-700' : 'border-transparent'
                    }`} />
                </div>
        </div>

        <div className="md:hidden mt-8 border-t border-white/10 pt-4 px-4 [&>button]:w-full [&>button]:justify-start [&>button]:gap-3 [&>button]:rounded-lg [&>button]:border-0 [&>button]:px-4 [&>button]:py-3 [&>button]:text-slate-300 [&>button]:text-sm [&>button]:hover:bg-white/5">
            <CartButton />
        </div>

                                </nav>
                               </div>
                            
                        </aside>

                         {isOpen && (
                    <div
                    className='fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm 
                    transition-opacity'
                    onClick={()=> setIsOpen(false)} />
                )}

        </>
    );
};
export default Sidebar;
