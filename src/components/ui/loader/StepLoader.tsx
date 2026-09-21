import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {SpinnerLoader} from "./SpinnerLoader";

interface StepLoaderProps {
  steps: string[];
  intervalMs?: number;
  currentStep?: number; // Para control manual opcional
  showSpinner?: boolean;
  className?: string;
}

export const StepLoader = ({
  steps,
  intervalMs = 400,
  currentStep: externalStep,
  showSpinner = true,
  className = "",
}: StepLoaderProps) => {
  const [internalStep, setInternalStep] = useState(0);

  const isControlled = externalStep !== undefined;
  const activeStep = isControlled ? externalStep : internalStep;

  useEffect(() => {
    if (isControlled) return;

    const interval = setInterval(() => {
      setInternalStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [steps.length, intervalMs, isControlled]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {showSpinner && <SpinnerLoader />}

      {/* Texto del paso animado */}
      <div className="mt-6 h-8 flex items-center justify-center relative overflow-hidden w-64">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-sm font-medium text-gray-300 absolute text-center"
          >
            {steps[activeStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Indicadores de progreso (puntos/barras) */}
      <div className="flex gap-2 mt-2">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1.5 rounded-full ${
              index <= activeStep ? "bg-blue-500" : "bg-gray-800"
            }`}
            animate={{
              width: index === activeStep ? 20 : 6,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};