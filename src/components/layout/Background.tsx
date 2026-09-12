limport React from 'react';

const Background: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/background.jpg')",
      }}
    />
  );
};

export default Background;
