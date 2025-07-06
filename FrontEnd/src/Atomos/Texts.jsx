
export function Paragraphs(props) {
    const { text, className = "" } = props;
  
    return (
      <p className={`text-sm sm:text-base font-normal text-white ${className}`}>
        {text}
      </p>
    );
  }
  
  
  
  export function Titles(props) {
    const { text, className = "" } = props;
  
    return (
      <h1 className={`text-center text-2xl sm:text-4xl font-semibold text-white ${className}`}>
        {text}
      </h1>
    );
  }
  
  
  
  