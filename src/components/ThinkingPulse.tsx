import { motion } from 'framer-motion';
import { Brain, Zap, Network } from 'lucide-react';

export const ThinkingPulse = () => {
  return (
    <div className="relative w-full max-w-md mx-auto h-64">
      {/* Central brain */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
          />
          <div className="relative w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Orbiting nodes */}
      {[0, 1, 2].map((index) => {
        const angle = (index * 120) * (Math.PI / 180);
        const radius = 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={`orbiting-node-${index}`}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.3,
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
            }}
            className="w-1 h-1"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.4,
              }}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="relative"
            >
              {/* Connection line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1,
                  delay: index * 0.3,
                }}
                style={{
                  position: 'absolute',
                  width: radius,
                  height: '2px',
                  background: 'linear-gradient(90deg, hsl(225 100% 50% / 0.5), transparent)',
                  transformOrigin: 'left',
                  right: '50%',
                  top: '50%',
                }}
              />
              
              {/* Node */}
              <div className="w-12 h-12 bg-card border-2 border-accent rounded-full flex items-center justify-center shadow-accent">
                {index === 0 && <Zap className="w-5 h-5 text-accent" />}
                {index === 1 && <Network className="w-5 h-5 text-accent" />}
                {index === 2 && <Zap className="w-5 h-5 text-accent" />}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Pulse waves */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={`wave-${index}`}
          animate={{
            scale: [0, 2],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
            delay: index * 1,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-primary rounded-full"
        />
      ))}
    </div>
  );
};
