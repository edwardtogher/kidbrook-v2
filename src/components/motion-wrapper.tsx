"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variant } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationVariant =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "scaleIn";

const variants: Record<AnimationVariant, { hidden: Variant; visible: Variant }> =
  {
    fadeUp: {
      hidden: { opacity: 0, y: 32 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 48 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: -48 },
      visible: { opacity: 1, x: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.92 },
      visible: { opacity: 1, scale: 1 },
    },
  };

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimationVariant;
  as?: "div" | "section" | "article" | "li" | "span";
}

export function MotionWrapper({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  as = "div",
}: MotionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const v = variants[variant];
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: v.hidden,
        visible: v.visible,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: delay / 1000,
      }}
    >
      {children}
    </Tag>
  );
}
