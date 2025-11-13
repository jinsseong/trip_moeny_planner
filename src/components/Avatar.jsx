import React from 'react';
import { getInitials, getAvatarStyle } from '../utils/avatar';

function Avatar({ name, size = 32 }) {
  const style = {
    ...getAvatarStyle(name),
    width: `${size}px`,
    height: `${size}px`,
    fontSize: size <= 24 ? '10px' : '12px',
  };

  return (
    <div className="avatar" style={style}>
      {getInitials(name)}
    </div>
  );
}

export default Avatar;

