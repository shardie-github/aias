import { motion } from 'framer-motion';
import { MessageCircle, Calendar, PlayCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const dockItems = [
  { icon: MessageCircle, label: 'Chat', action: 'chat', color: 'from-primary to-primary-glow' },
  { icon: Calendar, label: 'Schedule', href: '/#booking', color: 'from-accent to-yellow-400' },
  { icon: PlayCircle, label: 'Demo', href: '/case-studies', color: 'from-purple-500 to-pink-500' },
  { icon: FileText, label: 'Docs', href: '/#resources', color: 'from-green-500 to-emerald-400' },
];

interface FloatingDockProps {
  onChatOpen?: () => void;
}

export const FloatingDock = ({ onChatOpen }: FloatingDockProps) => {
  const handleItemClick = (item: typeof dockItems[0]) => {
    if (item.action === 'chat' && onChatOpen) {
      onChatOpen();
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6, type: 'spring', stiffness: 100 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block"
    >
      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-glow">
        <div className="flex items-center gap-2">
          {dockItems.map((item, index) => {
            const content = (
              <motion.div
                whileHover={{ scale: 1.15, y: -8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-12 w-12 rounded-xl group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity`} />
                  <item.icon className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium bg-card px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.label}
                  </span>
                </Button>
              </motion.div>
            );

            if (item.href) {
              return (
                <Link key={`dock-item-${index}`} to={item.href}>
                  {content}
                </Link>
              );
            }

            return <div key={`dock-div-${index}`}>{content}</div>;
          })}
        </div>
      </div>
    </motion.div>
  );
};
