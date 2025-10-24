import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { useUnifiedScrollSync } from '../hooks/useUnifiedScrollSync';

/**
 * Demo component showcasing scroll synchronization across multiple containers
 */
const ScrollSyncDemo = ({ userType = 'agent' }) => {
  // Initialize unified scroll sync hooks for different container types
  const catalogScroll = useUnifiedScrollSync(userType, true, 'catalog');
  const comparisonScroll = useUnifiedScrollSync(userType, true, 'comparison');
  const detailsScroll = useUnifiedScrollSync(userType, true, 'details');
  const modalScroll = useUnifiedScrollSync(userType, true, 'modal');

  // Generate demo content
  const generateDemoContent = (count = 50) => {
    return Array.from({ length: count }, (_, i) => (
      <Card key={i} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">Item {i + 1}</Typography>
        <Typography variant="body2" color="text.secondary">
          This is demo content for scroll synchronization testing. 
          Item {i + 1} contains sample text to demonstrate bi-directional scroll sync.
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip 
            label={`Demo ${i + 1}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
      </Card>
    ));
  };

  const renderScrollContainer = (scrollHook, containerType, title) => {
    const { scrollRef, isActiveController } = scrollHook;
    return (
      <Paper 
        elevation={2} 
        sx={(theme) => ({
          p: 2, 
          height: '400px',
          border: isActiveController
            ? `2px solid ${theme.palette.success.main}`
            : `1px solid ${theme.palette.divider}`,
          transition: 'border-color 0.3s ease'
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          {isActiveController && (
            <Chip 
              label="Active Controller" 
              size="small" 
              color="success" 
            />
          )}
          {!isActiveController && (
            <Chip 
              label="Synced" 
              size="small" 
              color="info" 
              variant="outlined"
            />
          )}
        </Box>
        <Box
          ref={scrollRef}
          sx={(theme) => ({
            height: '320px',
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: 1,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.background.paper,
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[300],
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.palette.grey[400],
            },
          })}
        >
          {generateDemoContent(30)}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Scroll Synchronization Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        User Type: <Chip label={userType} size="small" color="primary" />
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderScrollContainer(catalogScroll, 'catalog', 'Catalog Container')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderScrollContainer(comparisonScroll, 'comparison', 'Comparison Container')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderScrollContainer(detailsScroll, 'details', 'Details Container')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderScrollContainer(modalScroll, 'modal', 'Modal Container')}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          How to Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          1. Open this demo in two browser windows (agent and customer)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          2. Scroll in any container on one side
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          3. Watch the corresponding container sync on the other side
        </Typography>
        <Typography variant="body2" color="text.secondary">
          4. Each container type has independent scroll synchronization
        </Typography>
      </Box>
    </Box>
  );
};

export default ScrollSyncDemo;