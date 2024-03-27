import { forwardRef, InputHTMLAttributes, createContext, useContext, useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({ value, onChange, children, disabled, className }: RadioGroupProps) {
  const name = useId();
  return (
    <RadioGroupContext.Provider value={{ value, onChange, disabled, name }}>
      <div className={cn('space-y-3', className)} role="radiogroup">{children}</div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, label, description, icon, className, disabled, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

    const { value: currentValue, onChange, disabled: groupDisabled, name: groupName } = context;
    const isChecked = currentValue === value;
    const isDisabled = disabled || groupDisabled;

    return (
      <label
        className={cn(
          'relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-sage-600 focus-within:ring-offset-2',
          isChecked
            ? 'border-sage-600 bg-sage-50'
            : 'border-olive-200 hover:border-olive-300 hover:bg-olive-50',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            name={groupName}
            value={value}
            checked={isChecked}
            onChange={() => !isDisabled && onChange(value)}
            disabled={isDisabled}
            className="absolute opacity-0 w-5 h-5 cursor-pointer"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
              isChecked
                ? 'border-sage-600 bg-sage-600'
                : 'border-olive-300 bg-white'
            )}
          >
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2.5 h-2.5 rounded-full bg-white"
              />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('font-medium text-olive-900 text-body-sm', isDisabled && 'text-olive-400')}>
              {label}
            </span>
            {icon && <span className="text-sage-600">{icon}</span>}
          </div>
          {description && (
            <p className={cn('mt-1 text-caption', isChecked ? 'text-sage-600' : 'text-olive-500')}>
              {description}
            </p>
          )}
        </div>
      </label>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';