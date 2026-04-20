import { cn } from '../../../core/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
  noPadding?: boolean;
}

export const Card = ({ 
  children, 
  className, 
  title, 
  subtitle,
  action,
  onClick,
  hover = false,
  noPadding = false
}: CardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
        hover && 'transition-all duration-200 hover:shadow-md cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-6')}>{children}</div>
    </div>
  );
};
