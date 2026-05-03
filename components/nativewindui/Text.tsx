import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { UITextView } from 'react-native-uitextview';

import { cn } from '@/lib/cn';

cssInterop(UITextView, { className: 'style' });

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      largeTitle: 'text-[48px] leading-[1.1] tracking-tight font-bold',
      title1: 'text-[32px] leading-[1.2] tracking-tight font-semibold',
      title2: 'text-[24px] leading-[1.3] tracking-tight font-semibold',
      title3: 'text-[20px] leading-[1.4] font-semibold',
      heading: 'text-[18px] leading-[1.6] font-semibold',
      body: 'text-[16px] leading-[1.6]',
      callout: 'text-[16px] leading-[1.6]',
      subhead: 'text-[14px] leading-[1.6]',
      footnote: 'text-[12px] leading-[1.6]',
      caption1: 'text-[12px] leading-none tracking-widest font-medium uppercase',
      caption2: 'text-[10px] leading-none tracking-widest font-medium uppercase',
    },
    color: {
      primary: '',
      secondary: 'text-secondary-foreground/90',
      tertiary: 'text-muted-foreground/90',
      quarternary: 'text-muted-foreground/50',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'primary',
  },
});

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  variant,
  color,
  ...props
}: React.ComponentProps<typeof UITextView> & VariantProps<typeof textVariants>) {
  const textClassName = React.useContext(TextClassContext);
  return (
    <UITextView
      className={cn(textVariants({ variant, color }), textClassName, className)}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
