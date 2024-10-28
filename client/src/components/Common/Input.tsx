import React, { ForwardedRef } from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref: ForwardedRef<HTMLInputElement>) => {
  return <input ref={ref} {...props} />;
});

Input.displayName = 'Input';

export default Input;
