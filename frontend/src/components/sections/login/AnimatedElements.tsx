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
      {/* Cod binar - 101, 010, 110, 001 */}
      <div 
        className="absolute text-white/40 font-mono text-sm font-bold" 
        style={{ top: '20%', left: '40%', animation: 'fade-slide 4s ease-in-out infinite' }}
      >
        101
      </div>
      <div 
        className="absolute text-white/40 font-mono text-sm font-bold" 
        style={{ top: '60%', left: '70%', animation: 'fade-slide 4s ease-in-out infinite', animationDelay: '1s' }}
      >
        010
      </div>
      <div 
        className="absolute text-white/40 font-mono text-sm font-bold" 
        style={{ top: '80%', left: '30%', animation: 'fade-slide 4s ease-in-out infinite', animationDelay: '2s' }}
      >
        110
      </div>
      <div 
        className="absolute text-white/40 font-mono text-sm font-bold" 
        style={{ top: '45%', left: '10%', animation: 'fade-slide 4s ease-in-out infinite', animationDelay: '3s' }}
      >
        001
      </div>