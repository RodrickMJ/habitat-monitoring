export function AuthContainer({ children, className = "" }) {
    return (
      <section className={` bg-opacity-40 w-4/5 h-4/5 flex flex-col sm:flex-row ${className}`}>
        {children}
      </section>
    );
  }
  