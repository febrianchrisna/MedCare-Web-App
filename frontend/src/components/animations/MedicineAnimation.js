import React, { useEffect, useState } from 'react';
import { FaPills, FaTablets } from 'react-icons/fa';
import { RiMedicineBottleFill, RiCapsuleFill } from 'react-icons/ri';
import { GiMedicinePills, GiPill } from 'react-icons/gi';

const MedicineAnimation = () => {
  const [rotation, setRotation] = useState(0);
  
  // Animation effect for continuous rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Define medicine icons and their properties
  const medicines = [
    {
      Icon: RiMedicineBottleFill,
      color: '#4d79ff',
      size: 60,
      position: { x: 20, y: 30, z: 50 },
      rotation: rotation * 0.7
    },
    {
      Icon: FaPills,
      color: '#ff6b6b',
      size: 45,
      position: { x: 100, y: 80, z: 20 },
      rotation: rotation * 0.8
    },
    {
      Icon: GiMedicinePills,
      color: '#00c9a7',
      size: 55,
      position: { x: 60, y: 140, z: 40 },
      rotation: rotation * 0.6
    },
    {
      Icon: RiCapsuleFill,
      color: '#ffc145',
      size: 50,
      position: { x: 140, y: 40, z: 30 },
      rotation: rotation * 0.9
    },
    {
      Icon: GiPill,
      color: '#a66bff',
      size: 40,
      position: { x: 40, y: 180, z: 60 },
      rotation: rotation * 0.75
    },
    {
      Icon: FaTablets,
      color: '#4da6ff',
      size: 35,
      position: { x: 160, y: 180, z: 10 },
      rotation: rotation * 0.65
    }
  ];

  return (
    <div className="medicine-animation-container" style={{ position: 'relative', width: '300px', height: '300px' }}>
      {/* Animated circle container */}
      <div 
        className="animation-circle" 
        style={{ 
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77,121,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          top: '10px',
          left: '10px',
          animation: 'pulse 3s infinite ease-in-out',
        }}
      ></div>
      
      {/* Render each medicine with 3D transforms */}
      {medicines.map((medicine, index) => {
        const { Icon, color, size, position, rotation } = medicine;
        const zIndex = position.z;
        const scale = 0.7 + (position.z / 100);
        
        return (
          <div 
            key={index}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              zIndex,
              transform: `rotateY(${rotation}deg) scale(${scale})`,
              transition: 'transform 0.1s ease-out',
              filter: `drop-shadow(2px 4px 6px rgba(0,0,0,0.2))`,
            }}
          >
            <Icon 
              size={size} 
              color={color} 
              style={{ 
                animation: `float ${2 + index * 0.5}s infinite ease-in-out alternate`,
                animationDelay: `${index * 0.2}s`
              }} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default MedicineAnimation;
