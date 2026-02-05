'use client';

import { motion } from 'framer-motion';

interface AggregationFlowProps {
  title: string;
  description: string;
  steps: string[];
}

export function AggregationFlow({ title, description, steps }: AggregationFlowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-secondary/20 border-border mt-6 rounded-2xl border p-8 text-center"
    >
      <h3 className="text-foreground mb-2 text-lg font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <div className="text-primary mt-4 flex flex-wrap justify-center gap-2 font-mono text-sm">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>{step}</span>
            {index < steps.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
