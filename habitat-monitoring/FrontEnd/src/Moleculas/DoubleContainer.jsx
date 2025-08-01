export function DoubleContainer ({children, className = ""}){
    return(<>
    <section className={` w-4/5 h-full flex ${className}`}>
        {children}
    </section>
    </>)
}