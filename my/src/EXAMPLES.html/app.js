import React, { useRef } from "react";

function InputFocus() {
  const inputRef = useRef();

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />

      <button onClick={focusInput}>
        Focus Input
      </button>
    </div>
  );
}

export default InputFocus;