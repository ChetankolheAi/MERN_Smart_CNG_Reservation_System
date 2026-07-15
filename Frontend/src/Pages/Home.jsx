import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Fuel,
  MapPinned,
  Clock3,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 60, damping: 15 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function Home() {
  const steps = [
    { title: "Find a Pump", desc: "Locate active high-pressure CNG stations near your exact path.", icon: MapPinned },
    { title: "Pick a Time", desc: "Reserve your specific 15-minute dispensing slot in advance.", icon: Clock3 },
    { title: "Get QR Pass", desc: "Receive an automated arrival code directly on your mobile device.", icon: QrCode },
    { title: "Skip the Queue", desc: "Drive into the priority lane, scan your pass, refuel, and go.", icon: Zap }
  ];

  const valueProps = [
    "Zero queue wait times",
    "Real-time pump pressure monitoring",
    "Seamless mobile payments integration",
    "Available for both commercial & private vehicles"
  ];
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
const handleGetStarted = () => {
  if (user) {
    navigate("/bookingPage");
  } else {
    navigate("/signup");
  }
};
  return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white p-3 sm:p-6 lg:p-8 overflow-hidden selection:bg-green-500 selection:text-white flex items-center justify-center transition-colors duration-300">
      
 
      {/* Global Ambient Background Illumination Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[50vw] h-[50vw] bg-green-200/40 dark:bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[50vw] h-[50vw] bg-emerald-100/30 dark:bg-green-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[400px] h-[400px] bg-slate-200/40 dark:bg-green-400/5 blur-[150px] rounded-full pointer-events-none" />

      {/* WHOLE PAGE GLASS CONTAINER */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 w-full max-w-7xl mx-auto rounded-[32px] transition-all duration-300 p-6 sm:p-10 lg:p-14 overflow-y-auto space-y-20 lg:space-y-28"
      >
        
        {/* HERO SECTION */}
        <motion.section 
          variants={fadeUpVariants}
          className="grid lg:grid-cols-12 gap-10 items-center"
        >
          {/* Removed fixed h-[70vh] to prevent text layout clipping on smaller text scalings */}
          <div className="lg:col-span-7 space-y-6 py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-600/20 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" />
              The Future of Fueling is Here
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-jos">
              Skip the CNG Queue. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-green-500 to-green-500 dark:from-green-400 dark:via-emerald-400 dark:to-emerald-300 drop-shadow-[0_0_30px_rgba(74,222,128,0.2)]  font-Outfit">
                Book Your Slot.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              Tired of spending hours waiting at refueling stations? BookMyCNG lets you reserve digital lane priority passes so you can get back on the road instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate(user ? "/bookingPage" : "/signup")}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-900 to-green-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/20"
              >
                {user ? (
                  "Book a Slot Now"
                ) : (
                  <>
                    Get Started for Free
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </>
                )}
              </button>

              <Link to="/findNearbyCNG" className="px-7 py-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base shadow-sm">
                Find Live Pumps
              </Link>
            </div>

            {/* Quick checkmarks underneath hero */}
            <div className="grid sm:grid-cols-2 gap-3 pt-6 border-t border-slate-200 dark:border-white/5 mt-6">
              {valueProps.map((prop) => (
                <div key={prop} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                  <span>{prop}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Visual Accent */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="p-10 rounded-3xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 backdrop-blur-md relative shadow-xl group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-900 to-emerald-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />
              <Fuel size={110} className="text-green-600 dark:text-green-400 drop-shadow-[0_0_25px_rgba(74,222,128,0.35)]" />
              
              <div className="absolute -bottom-3 -left-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-2">
                <ShieldCheck className="text-green-600 dark:text-green-400" size={18} />
                <div className="text-left">
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Verified Platform</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">100% Secure Pass</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* HOW IT WORKS PROCEDURAL SECTION */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Refuel in 4 Simple Steps</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Our smart platform is engineered to transition you from empty to filled smoothly without the headache of long queues.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUpVariants}
                  className="relative rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:border-slate-300 dark:hover:border-white/20 transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center font-bold mb-5 group-hover:bg-green-500 group-hover:text-white dark:group-hover:text-slate-950 transition-all duration-300">
                      <StepIcon size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  
                  {/* Subtle step numbering index */}
                  <div className="absolute top-4 right-4 text-3xl font-black text-slate-400 dark:text-white/50 group-hover:text-green-500/20 dark:group-hover:text-green-500/10 font-mono select-none transition-colors">
                    0{idx + 1}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* SIGNUP CTA BANNER BLOCK */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-50 via-emerald-50/50 to-transparent dark:from-green-950/30 dark:via-emerald-950/10 dark:to-transparent p-6 sm:p-10 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 text-left relative overflow-hidden"
        >
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ready to reclaim your time?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Create a free account today, link your vehicle credentials, and execute your first automated CNG reservation instantly.
            </p>
          </div>

         <button 
          onClick={handleGetStarted}
          className="px-5 py-3 rounded-xl bg-green-500 dark:bg-green-400 text-white dark:text-slate-950 font-bold hover:bg-green-600 dark:hover:bg-green-300 transition-colors flex items-center gap-2 group shadow-md shrink-0 text-sm"
        >
          Get Started Free
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
        </motion.section>

      </motion.div>
    </div>
  );
}