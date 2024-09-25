import React from 'react';

const Loader = () => {
  const style = {
    '--s': '28px',
    '--_g': '#000 90%,#0000',
    '--_g0': 'no-repeat radial-gradient(farthest-side, var(--_g))',
    '--_g1': 'no-repeat radial-gradient(farthest-side at top, var(--_g))',
    '--_g2': 'no-repeat radial-gradient(farthest-side at bottom, var(--_g))',
  };

  return (
    <div
      className="relative h-[var(--s)] w-[calc(var(--s)*2.5)] bg-[var(--_g0),var(--_g1),var(--_g2),var(--_g0),var(--_g1),var(--_g2)] bg-[20%_50%,20%_25%,20%_25%] animate-l45"
      style={style}
    ></div>
  );
};

export default Loader;
