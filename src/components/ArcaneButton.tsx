import { ButtonHTMLAttributes, forwardRef, useMemo } from 'react';
import { useSound } from '../hooks/useSound';

export type ArcaneButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ArcaneButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ArcaneButtonVariant;
  glowOnHover?: boolean;
}

const ArcaneButton = forwardRef<HTMLButtonElement, ArcaneButtonProps>(
  ({ variant = 'primary', glowOnHover = true, onMouseEnter, onClick, className = '', disabled, ...rest }, ref) => {
    const { play, isReady } = useSound();

    const variantClass = useMemo(() => {
      switch (variant) {
        case 'secondary':
          return 'arcane-button arcane-button--secondary';
        case 'ghost':
          return 'arcane-button arcane-button--ghost';
        default:
          return 'arcane-button arcane-button--primary';
      }
    }, [variant]);

    const handleMouseEnter: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (!disabled && glowOnHover && isReady) {
        play('hoverGlow');
      }
      onMouseEnter?.(event);
    };

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (!disabled && isReady) {
        play(variant === 'primary' ? 'sealPop' : 'pageTurn');
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        className={`${variantClass} ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        data-variant={variant}
        disabled={disabled}
        {...rest}
      />
    );
  }
);

ArcaneButton.displayName = 'ArcaneButton';

export default ArcaneButton;
