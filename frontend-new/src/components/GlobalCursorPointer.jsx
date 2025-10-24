import React, { useState, useEffect, useRef } from 'react';
import { Box, Avatar, Typography, Fade } from '@mui/material';
import { syncManager } from '../sync/syncManager';

/**
 * Global cursor pointer component that shows remote user's cursor position
 * Works across the entire application, not just specific components
 */
const GlobalCursorPointer = ({ userType, enabled = true }) => {
  const [remotePointer, setRemotePointer] = useState(null);
  const pointerTimeout = useRef();
  const lastSent = useRef(0);
  const pointerId = userType; // 'agent' or 'customer'

  // Debug: Log cursor pointer initialization
  console.log(`🖱️ [${userType}] GlobalCursorPointer initialized - enabled: ${enabled}`);

  // Send pointer position to other user
  const sendPointerMove = (evt) => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastSent.current < 16) return; // ~60fps throttle
    lastSent.current = now;
    syncManager.cursor(document.documentElement, evt.clientX, evt.clientY);
  };

  // Listen for remote pointer-move events
  useEffect(() => {
    if (!enabled) {
      setRemotePointer(null);
      return;
    }

    const unsubscribe = syncManager.onStateChange(state => {
      const cursors = state.cursors || {};
      // pick first remote cursor not ours
      const remoteEntries = Object.entries(cursors).filter(([uid]) => uid !== syncManager.localUserId);
      if (!remoteEntries.length) {
        setRemotePointer(null);
        return;
      }
      const [uid, cur] = remoteEntries[0];
      const x = cur.xPercent * window.innerWidth;
      const y = cur.yPercent * window.innerHeight;
      setRemotePointer({ x, y, userType: 'agent', sender: uid, timestamp: cur.ts });
      if (pointerTimeout.current) clearTimeout(pointerTimeout.current);
      pointerTimeout.current = setTimeout(() => setRemotePointer(null), 2000);
    });

    // Add global mousemove listener
    document.addEventListener('mousemove', sendPointerMove, { passive: true });

    console.log(`🖱️ [${userType}] Cursor pointer setup complete`);

    return () => {
  unsubscribe();
      document.removeEventListener('mousemove', sendPointerMove);
      if (pointerTimeout.current) {
        clearTimeout(pointerTimeout.current);
      }
    };
  }, [enabled, userType, pointerId, sendPointerMove]);

  // Don't render if no remote pointer or if it's too old
  if (!remotePointer || !enabled) {
    return null;
  }

  const isRecent = Date.now() - remotePointer.timestamp < 2000;
  if (!isRecent) {
    return null;
  }

  return (
    <Fade in={true} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          left: remotePointer.x,
          top: remotePointer.y,
          zIndex: 9999,
          pointerEvents: 'none',
          transform: 'translate(-8px, -8px)', // Offset to center the pointer
          transition: 'all 0.1s ease-out',
        }}
      >
        {/* Cursor pointer with user identification */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* Main cursor pointer */}
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: remotePointer.userType === 'agent' ? 'primary.main' : 'secondary.main',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: `6px solid ${remotePointer.userType === 'agent' ? '#1976d2' : '#dc004e'}`,
                transform: 'translate(-50%, -50%) rotate(45deg)',
                transformOrigin: 'center',
              }
            }}
          />
          
          {/* User label */}
          <Box
            sx={{
              bgcolor: remotePointer.userType === 'agent' ? 'primary.main' : 'secondary.main',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}
          >
            {remotePointer.userType}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default GlobalCursorPointer;
