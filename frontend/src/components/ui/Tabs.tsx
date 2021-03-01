import { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ children, defaultValue, value: controlledValue, onChange, className }: {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onChange: handleChange }}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn('flex gap-1 bg-olive-50 p-1 rounded-lg border', className)}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, disabled, className }: {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { value: currentValue, onChange } = context;
  const isActive = currentValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabs-content-${value}`}
      id={`tabs-trigger-${value}`}
      onClick={() => !disabled && onChange(value)}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-md text-body-sm font-medium transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2',
        isActive
          ? 'bg-white text-olive-950 shadow-sm'
          : 'text-olive-600 hover:text-olive-900 hover:bg-white/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className }: {
  children: ReactNode;
  value: string;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { value: currentValue } = context;
  const isActive = currentValue === value;

  return (
    <div
      role="tabpanel"
      id={`tabs-content-${value}`}
      aria-labelledby={`tabs-trigger-${value}`}
      hidden={!isActive}
      className={cn(className)}
    >
      {isActive && children}
    </div>
  );
}