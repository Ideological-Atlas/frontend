"use client";

import { useTranslations } from "next-intl";
import { Button } from "../atoms/Button";
import { motion } from "framer-motion";

export function Hero() {
  const t = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  
  return (
    <div className="px-5 md:px-20 xl:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="@container">
          <div className="flex flex-col gap-10 px-4 py-10 lg:gap-16 lg:flex-row items-center">
            <div className="flex flex-col gap-6 lg:w-1/2 justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4 text-left"
              >
                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
                  {t("title")}
                </h1>
                <h2 className="text-slate-600 dark:text-slate-300 text-lg font-normal leading-relaxed">
                  {t("subtitle")}
                </h2>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                <Button variant="primary" className="h-12 px-6 text-base shadow-lg shadow-blue-900/20">
                  {tCommon("start_now")}
                </Button>
                <Button variant="outline">
                  {tCommon("learn_more")}
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                bounce: 0.4 
              }}
              className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-800 relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 mix-blend-overlay z-10 pointer-events-none"></div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="w-full h-full bg-center bg-cover"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgW3xqONpPVk-2qt7_VhjJGmhhMlqhzUq2XJW6GrjMaTJmb6NTWB5FvUAOURaixKtIyhK8-euTfDOPDR9fFCIK0NEwpw7uEhlqKZeCUB70ppRUsJFSSKqL_yDRjYkJyg-RD1DYNIVwQMZLMS9pHH-JIlSzeBoFZcrMsyYhGNTPsfnNuwJDj_St5Ly04TOoqQYV8qV0K_JnaCuEIR0lpCrqM8P9pY2hjuHlQIh7AcID-iLsJlfagvBU6jBV1t_jJDB0Fp9sERk7Jcw")' }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
