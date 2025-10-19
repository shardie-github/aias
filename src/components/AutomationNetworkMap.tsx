import { motion } from 'framer-motion';
import { Database, Cloud, Zap, Workflow, Bot, Link as LinkIcon } from 'lucide-react';

const nodes = [
  { icon: Database, label: 'Data Sources', x: 10, y: 50, color: 'from-blue-500 to-cyan-400' },
  { icon: Cloud, label: 'Cloud Systems', x: 30, y: 20, color: 'from-purple-500 to-pink-400' },
  { icon: Bot, label: 'AI Agents', x: 50, y: 50, color: 'from-primary to-primary-glow' },
  { icon: Workflow, label: 'Workflows', x: 70, y: 20, color: 'from-green-500 to-emerald-400' },
  { icon: Zap, label: 'Automations', x: 90, y: 50, color: 'from-accent to-yellow-400' },
];

const connections = [
  { from: 0, to: 2 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
];

export const AutomationNetworkMap = () => {
  return (
    <div className="relative w-full h-80 sm:h-96 bg-gradient-card backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-8 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(225 100% 50% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(225 100% 50% / 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Title */}
      <div className="relative z-20 mb-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LinkIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">Live Network Visualization</span>
        </div>
      </div>

      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections.map((conn, index) => {
          const from = nodes[conn.from];
          const to = nodes[conn.to];
          
          return (
            <motion.line
              key={`connection-${conn.from}-${conn.to}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: index * 0.2 }}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="hsl(225 100% 50%)"
              strokeWidth="2"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-10"
                dur="1s"
                repeatCount="indefinite"
              />
            </motion.line>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => (
        <motion.div
          key={`node-${node.id || index}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            delay: index * 0.15,
          }}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="z-10"
        >
          <motion.div
            whileHover={{ scale: 1.2, y: -5 }}
            className="relative group cursor-pointer"
          >
            {/* Pulse animation */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              className={`absolute inset-0 bg-gradient-to-br ${node.color} rounded-full blur-md`}
            />
            
            {/* Node */}
            <div className={`relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${node.color} rounded-full flex items-center justify-center shadow-glow`}>
              <node.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>

            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-3 py-1 bg-card border border-border rounded-lg shadow-card text-xs font-semibold">
                {node.label}
              </div>
            </div>

            {/* Data flow particles */}
            <motion.div
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5,
              }}
              className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Stats overlay */}
      <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 text-xs z-20">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-muted-foreground">5 active connections</span>
        </motion.div>
      </div>
    </div>
  );
};
