import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-primary text-white border-b-4 border-red-900 active:border-b-0 active:translate-y-1',
        secondary: 'bg-secondary text-white border-b-4 border-blue-900 active:border-b-0 active:translate-y-1',
        outline: 'bg-white text-dark border-2 border-sand border-b-4 active:border-b-2 active:translate-y-0.5',
    };

    return (
        <motion.button
        whileTap={{ scale: 0.95 }}
        className={clsx(
            'px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2',
            variants[variant],
            className
        )}
        {...props}
        >
        {children}
        </motion.button>
    );
};

export const GameCard = ({ children, className, ...props }) => (
    <div className={clsx('bg-white border-2 border-sand rounded-3xl shadow-game p-5', className)} {...props}>
        {children}
    </div>
);

export const XPBar = ({ progress, label, color = 'bg-green-500' }) => (
    <div className="w-full">
        <div className="flex justify-between text-xs font-bold mb-1 px-1">
        <span>{label}</span>
        <span>{progress}%</span>
        </div>
        <div className="w-full bg-sand h-4 rounded-full border-2 border-dark overflow-hidden relative">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${color}`}
        />
        {/* Efek kilau */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20"></div>
        </div>
    </div>
);