'use client';

import { motion, useTransform, useSpring } from 'framer-motion';

interface BurgerAssemblyProps {
  scrollYProgress: ReturnType<typeof useTransform<number, number>>;
}

interface LayerProps {
  scrollY: ReturnType<typeof useTransform<number, number>>;
  startY: number;
  endY: number;
  startRotate: number;
  endRotate: number;
  startScale: number;
  endScale: number;
  startOpacity: number;
  endOpacity: number;
  children: React.ReactNode;
  zIndex?: number;
}

function BurgerLayer({
  scrollY,
  startY,
  endY,
  startRotate,
  endRotate,
  startScale,
  endScale,
  startOpacity,
  endOpacity,
  children,
  zIndex = 0,
}: LayerProps) {
  const y = useTransform(scrollY, [0, 1], [startY, endY]);
  const rotate = useTransform(scrollY, [0, 1], [startRotate, endRotate]);
  const scale = useTransform(scrollY, [0, 1], [startScale, endScale]);
  const opacity = useTransform(scrollY, [0, 1], [startOpacity, endOpacity]);

  const smoothY = useSpring(y, { stiffness: 80, damping: 30 });
  const smoothRotate = useSpring(rotate, { stiffness: 80, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 30 });

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        y: smoothY,
        rotate: smoothRotate,
        scale: smoothScale,
        opacity,
        zIndex,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Food Layers (pure CSS) ─── */

function TopBun() {
  return (
    <div className="relative">
      <div
        className="relative rounded-[50%] w-[220px] h-[90px] sm:w-[300px] sm:h-[120px] md:w-[380px] md:h-[150px]"
        style={{
          background: 'linear-gradient(180deg, #D4913D 0%, #C17D2B 40%, #A86920 100%)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.5), inset 0 10px 20px rgba(255,255,255,0.15), inset 0 -5px 15px rgba(0,0,0,0.3)',
        }}
      >
        {/* Sesame seeds */}
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-[50%]"
            style={{
              width: `${6 + (i % 3) * 2}px`,
              height: `${4 + (i % 2) * 2}px`,
              background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
              left: `${12 + ((i * 37 + 13) % 76)}%`,
              top: `${12 + ((i * 23 + 7) % 60)}%`,
              transform: `rotate(${(i * 47) % 360}deg)`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          />
        ))}
        <div
          className="absolute top-[15%] left-[20%] w-[40%] h-[25%] rounded-[50%]"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)' }}
        />
      </div>
    </div>
  );
}

function Cheese() {
  return (
    <div className="relative">
      <div
        className="w-[240px] sm:w-[320px] md:w-[400px] h-[35px] sm:h-[45px] md:h-[55px]"
        style={{
          background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          borderRadius: '8px',
          clipPath: 'polygon(0% 30%, 5% 80%, 10% 20%, 18% 90%, 25% 10%, 32% 85%, 40% 15%, 48% 95%, 55% 5%, 62% 88%, 70% 12%, 78% 82%, 85% 18%, 92% 78%, 100% 30%, 100% 100%, 0% 100%)',
          boxShadow: '0 4px 15px rgba(255,165,0,0.3)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      />
      {/* Melted drips */}
      <div className="absolute bottom-[-18px] left-[28%] w-[12px] h-[20px] sm:h-[28px] rounded-b-full" style={{ background: 'linear-gradient(180deg, #FFA500, #FF8C00)', opacity: 0.8 }} />
      <div className="absolute bottom-[-14px] right-[22%] w-[10px] h-[15px] sm:h-[22px] rounded-b-full" style={{ background: 'linear-gradient(180deg, #FFA500, #FF8C00)', opacity: 0.6 }} />
    </div>
  );
}

function Patty() {
  return (
    <div
      className="w-[230px] sm:w-[310px] md:w-[390px] h-[50px] sm:h-[60px] md:h-[70px] rounded-[6px] relative"
      style={{
        background: 'linear-gradient(180deg, #5C3317 0%, #3E1F0D 30%, #2C1608 60%, #3E1F0D 100%)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -3px 8px rgba(0,0,0,0.4)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-[15%] right-[15%] h-[3px] rounded-full"
          style={{
            top: `${20 + i * 25}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.4) 85%, transparent 100%)',
          }}
        />
      ))}
      <div
        className="absolute top-[10%] left-[25%] w-[50%] h-[30%] rounded-[50%]"
        style={{ background: 'radial-gradient(ellipse, rgba(120,60,20,0.4) 0%, transparent 70%)' }}
      />
    </div>
  );
}

function Bacon() {
  return (
    <div className="relative flex flex-col gap-[2px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-[200px] sm:w-[280px] md:w-[350px] h-[14px] sm:h-[16px] md:h-[18px] rounded-[4px]"
          style={{
            background: i === 1
              ? 'linear-gradient(90deg, #8B2500 0%, #CD3700 30%, #FF4500 50%, #CD3700 70%, #8B2500 100%)'
              : 'linear-gradient(90deg, #A0522D 0%, #D2691E 30%, #F4A460 50%, #D2691E 70%, #A0522D 100%)',
            transform: `translateX(${i === 1 ? 8 : -4}px) rotate(${i === 1 ? 0.5 : -0.3}deg)`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            opacity: i === 1 ? 1 : 0.85,
          }}
        />
      ))}
    </div>
  );
}

function Lettuce() {
  return (
    <div
      className="w-[250px] sm:w-[340px] md:w-[420px] h-[30px] sm:h-[38px] md:h-[45px] relative"
      style={{
        background: 'linear-gradient(180deg, #4CAF50 0%, #388E3C 50%, #2E7D32 100%)',
        borderRadius: '60% 70% 50% 55% / 100% 100% 80% 90%',
        boxShadow: '0 3px 10px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.1)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.08) 35%, transparent 50%, rgba(255,255,255,0.06) 65%, transparent 80%)',
          borderRadius: 'inherit',
        }}
      />
    </div>
  );
}

function Tomato() {
  return (
    <div
      className="w-[210px] sm:w-[290px] md:w-[360px] h-[28px] sm:h-[35px] md:h-[42px] rounded-[4px] relative"
      style={{
        background: 'linear-gradient(180deg, #E53935 0%, #C62828 40%, #B71C1C 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.1)',
      }}
    >
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-[4px] h-[3px] sm:w-[5px] sm:h-[4px] rounded-[50%]"
          style={{
            background: 'rgba(255,200,200,0.3)',
            left: `${20 + ((i * 37 + 11) % 60)}%`,
            top: `${25 + ((i * 19 + 5) % 50)}%`,
          }}
        />
      ))}
    </div>
  );
}

function BottomBun() {
  return (
    <div
      className="w-[230px] sm:w-[310px] md:w-[390px] h-[45px] sm:h-[55px] md:h-[65px] relative"
      style={{
        background: 'linear-gradient(180deg, #C17D2B 0%, #A86920 40%, #8B5E1A 100%)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.6), inset 0 3px 8px rgba(255,255,255,0.1), inset 0 -4px 10px rgba(0,0,0,0.3)',
        borderRadius: '4px 4px 30% 30%',
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
      />
    </div>
  );
}

/* ─── Main Component ─── */

export default function BurgerAssembly({ scrollYProgress }: BurgerAssemblyProps) {
  const burgerScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.7]);
  const burgerOpacity = useTransform(scrollYProgress, [0, 0.6, 0.9, 1], [1, 1, 0.6, 0]);
  const smoothScale = useSpring(burgerScale, { stiffness: 60, damping: 25 });

  const glowIntensity = useTransform(scrollYProgress, [0, 0.5], [0.15, 0.25]);

  const layers = [
    { startY: -300, endY: 0, startRotate: -20, endRotate: 0, startScale: 0.75, endScale: 1, startOpacity: 0.3, endOpacity: 1, zIndex: 7, component: <TopBun /> },
    { startY: -210, endY: 0, startRotate: 16, endRotate: 0, startScale: 0.8, endScale: 1, startOpacity: 0.4, endOpacity: 1, zIndex: 6, component: <Cheese /> },
    { startY: -130, endY: 0, startRotate: -12, endRotate: 0, startScale: 0.85, endScale: 1, startOpacity: 0.5, endOpacity: 1, zIndex: 5, component: <Patty /> },
    { startY: -65, endY: 0, startRotate: 9, endRotate: 0, startScale: 0.83, endScale: 1, startOpacity: 0.45, endOpacity: 1, zIndex: 4, component: <Bacon /> },
    { startY: 5, endY: 0, startRotate: -7, endRotate: 0, startScale: 0.87, endScale: 1, startOpacity: 0.5, endOpacity: 1, zIndex: 3, component: <Lettuce /> },
    { startY: 65, endY: 0, startRotate: 6, endRotate: 0, startScale: 0.82, endScale: 1, startOpacity: 0.45, endOpacity: 1, zIndex: 2, component: <Tomato /> },
    { startY: 170, endY: 0, startRotate: -9, endRotate: 0, startScale: 0.78, endScale: 1, startOpacity: 0.35, endOpacity: 1, zIndex: 1, component: <BottomBun /> },
  ];

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        scale: smoothScale,
        opacity: burgerOpacity,
        width: '400px',
        height: '500px',
      }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,69,0,0.18) 0%, rgba(255,140,0,0.08) 40%, transparent 70%)',
          opacity: glowIntensity,
        }}
      />

      {/* Steam particles rising */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[80px] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${20 + i * 12}%`,
              bottom: 0,
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
            }}
            animate={{
              y: [0, -60 - i * 10],
              opacity: [0, 0.15, 0],
              scale: [1, 1.5 + i * 0.2, 2],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Burger layers */}
      <div className="relative w-full h-full flex items-center justify-center">
        {layers.map((layer, i) => (
          <BurgerLayer
            key={i}
            scrollY={scrollYProgress}
            startY={layer.startY}
            endY={layer.endY}
            startRotate={layer.startRotate}
            endRotate={layer.endRotate}
            startScale={layer.startScale}
            endScale={layer.endScale}
            startOpacity={layer.startOpacity}
            endOpacity={layer.endOpacity}
            zIndex={layer.zIndex}
          >
            {layer.component}
          </BurgerLayer>
        ))}
      </div>
    </motion.div>
  );
}
