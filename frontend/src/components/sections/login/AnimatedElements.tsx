/**
 * Animated Elements - Elemente animate pentru gradient background
 * Forme geometrice, cod binar, simboluri matematice
 */

export const AnimatedElements = () => {
  return (
    <></>
    {/* Forme geometrice - Hexagoane, pătrate, cercuri */}
      <div 
        className="absolute w-5 h-5 bg-white/30" 
        style={{ 
          top: '10%', 
          left: '15%', 
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'float-slow 8s ease-in-out infinite' 
        }} 
      />
      <div 
        className="absolute w-4 h-4 bg-white/30" 
        style={{ top: '30%', left: '80%', animation: 'float-slow 7s ease-in-out infinite', animationDelay: '1s' }} 
      />
      <div 
        className="absolute w-4 h-4 bg-white/30" 
        style={{ top: '60%', left: '20%', animation: 'float-slow 7s ease-in-out infinite', animationDelay: '2s' }} 
      />
      <div 
        className="absolute w-5 h-5 bg-white/30" 
        style={{ top: '75%', left: '70%', animation: 'float-slow 8s ease-in-out infinite', animationDelay: '3s' }} 
      />