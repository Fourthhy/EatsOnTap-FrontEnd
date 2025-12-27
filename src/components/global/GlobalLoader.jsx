import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '../../context/LoaderContext';

export const GlobalLoader = () => {
    const { isLoading, progress, currentLabel } = useLoader();

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        backgroundColor: '#ffffff',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {/* Logo or Brand Icon could go here */}
                    <div className="flex flex-col items-center w-full gap-5">
                        <div>
                            <img src="/lv-logo.svg" alt="La Verdad Logo" />
                        </div>
                        <div className="h-full flex flex-col gap-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-8 font-geist text-center">Eat's On Tap!</h2>
                            <p className="text-lg font-bold text-gray-800 mb-8 font-tolkien text-center">LA VERDAD CHRISTIAN COLLEGE</p>
                        </div>

                        <motion.p
                            key={currentLabel} // Triggers animation when text changes
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-sm text-gray-500 font-geist"
                        >
                            {currentLabel}
                        </motion.p>
                        <div style={{ width: '300px', height: '4px', backgroundColor: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 50 }}
                                style={{ height: '100%', backgroundColor: '#4268BD' }}
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-400 font-mono">{Math.min(100, Math.round(progress))}%</p>




                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};