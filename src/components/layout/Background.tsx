import React from 'react';

const Background: React.FC = () => {
return (
<>
<div
aria-hidden="true"
className="fixed inset-0 pointer-events-none z-0 bg-[#060b09] bg-cover bg-center bg-no-repeat"
style={{
backgroundImage: "url('/assets/background.jpg')",
}}
/>

  <div
    aria-hidden="true"
    className="fixed inset-0 pointer-events-none z-0 app-bg-overlay"
  />
</>

);
};

export default Background;
