import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Button,
  Chip,
  Stack,
  Avatar,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  DirectionsRun as ActivityIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { openTokSessionSingleton } from '../services/OpenTokSessionManager';

const ActivitiesModal = ({ 
  open, 
  onClose, 
  activities = [], 
  packageTitle = '',
  packageLocation = '',
  userType = 'customer',
  onActivitiesSelected = () => {}, // Callback for when activities are selected
  initialSelectedActivities = [] // Pre-selected activities
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProcessingIncomingAction, setIsProcessingIncomingAction] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState(initialSelectedActivities);

  // Sample activities data with images - you can replace this with actual data
  const sampleActivities = [
    {
      id: 1,
      name: "Taj Mahal Sunrise Tour",
      description: "Experience the magical sunrise at the iconic Taj Mahal, one of the Seven Wonders of the World. This early morning tour offers the best lighting for photography and a peaceful atmosphere.",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      duration: "3 hours",
      difficulty: "Easy",
      included: true
    },
    {
      id: 2,
      name: "Amber Fort Visit",
      description: "Explore the magnificent Amber Fort, a UNESCO World Heritage Site. Ride an elephant up to the fort entrance and discover the rich history and stunning architecture of this royal palace.",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      duration: "4 hours",
      difficulty: "Moderate",
      included: true
    },
    {
      id: 3,
      name: "Chandni Chowk Food Walk",
      description: "Embark on a culinary journey through Delhi's oldest and busiest market. Taste authentic street food, visit historic spice markets, and learn about the city's rich food culture.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      duration: "2.5 hours",
      difficulty: "Easy",
      included: true
    }
  ];

  // Use sample data if no activities provided
  const displayActivities = activities.length > 0 ? activities : sampleActivities;

  // Co-browsing signal handlers
  const sendActivityImageChange = useCallback((imageIndex) => {
    if (isProcessingIncomingAction) return;

    console.log(`🎯 [${userType}] Sending activity image change:`, imageIndex);
    const session = openTokSessionSingleton.getSession();
    if (session) {
      session.signal({
        type: 'activities-modal-image-change',
        data: JSON.stringify({
          imageIndex,
          userType,
          timestamp: Date.now()
        })
      });
    }
  }, [userType, isProcessingIncomingAction]);

  const sendActivitySelectionChange = useCallback((activityId) => {
    if (isProcessingIncomingAction) return;

    console.log(`🎯 [${userType}] Sending activity selection change:`, activityId);
    const session = openTokSessionSingleton.getSession();
    if (session) {
      session.signal({
        type: 'activities-modal-selection-change',
        data: JSON.stringify({
          activityId,
          userType,
          timestamp: Date.now()
        })
      });
    }
  }, [userType, isProcessingIncomingAction]);

  const handleActivityImageChange = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Ignore signals from same user type
      if (data.userType === userType) return;
      
      console.log(`🎯 [${userType}] Received activity image change:`, data.imageIndex);
      
      setIsProcessingIncomingAction(true);
      setCurrentImageIndex(data.imageIndex);
      
      // Reset flag after a short delay
      setTimeout(() => {
        setIsProcessingIncomingAction(false);
      }, 100);
    } catch (err) {
      console.error('Failed to parse activity image change signal:', err);
    }
  }, [userType]);

  const handleActivitySelectionChange = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Ignore signals from same user type
      if (data.userType === userType) return;
      
      console.log(`🎯 [${userType}] Received activity selection change:`, data.activityId);
      
      setIsProcessingIncomingAction(true);
      setSelectedActivities(prev => {
        if (prev.includes(data.activityId)) {
          return prev.filter(id => id !== data.activityId);
        } else {
          return [...prev, data.activityId];
        }
      });
      
      // Reset flag after a short delay
      setTimeout(() => {
        setIsProcessingIncomingAction(false);
      }, 100);
    } catch (err) {
      console.error('Failed to parse activity selection change signal:', err);
    }
  }, [userType]);

  // Set up signal listeners
  useEffect(() => {
    if (!open) return;

    const session = openTokSessionSingleton.getSession();
    if (session) {
      session.on('signal:activities-modal-image-change', handleActivityImageChange);
      session.on('signal:activities-modal-selection-change', handleActivitySelectionChange);
      
      return () => {
        session.off('signal:activities-modal-image-change', handleActivityImageChange);
        session.off('signal:activities-modal-selection-change', handleActivitySelectionChange);
      };
    }
  }, [open, handleActivityImageChange, handleActivitySelectionChange]);

  // Reset image index and load initial selections when modal opens
  useEffect(() => {
    if (open) {
      setCurrentImageIndex(0);
      setSelectedActivities(initialSelectedActivities);
    }
  }, [open, initialSelectedActivities]);

  const handlePreviousImage = () => {
    const newIndex = currentImageIndex === 0 ? displayActivities.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    sendActivityImageChange(newIndex);
  };

  const handleNextImage = () => {
    const newIndex = currentImageIndex === displayActivities.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    sendActivityImageChange(newIndex);
  };

  const handleToggleActivity = (activityId) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
    
    // Sync activity selection
    sendActivitySelectionChange(activityId);
  };

  const handleSaveActivities = () => {
    const selected = displayActivities.filter(activity => selectedActivities.includes(activity.id));
    onActivitiesSelected(selected);
    onClose();
  };

  const currentActivity = displayActivities[currentImageIndex];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'hidden',
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image Section */}
        <Box sx={{ position: 'relative', height: '60vh', minHeight: 400 }}>
          <CardMedia
            component="img"
            image={currentActivity?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
            alt={currentActivity?.name || 'Activity'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Navigation Arrows */}
          <IconButton
            onClick={handlePreviousImage}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            <NavigateNextIcon />
          </IconButton>

          {/* Image Counter */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            {currentImageIndex + 1} / {displayActivities.length}
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 3, height: '40vh', overflow: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                sx={{
                  bgcolor: 'success.main',
                  width: 48,
                  height: 48,
                }}
              >
                <ActivityIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {packageTitle || 'Package Activities'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {packageLocation || 'Explore amazing activities'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Current Activity Details */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {currentActivity?.name}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {currentActivity?.description}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Chip
                  label={`Duration: ${currentActivity?.duration}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Difficulty: ${currentActivity?.difficulty}`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
                {currentActivity?.included && (
                  <Chip
                    label="Included in Package"
                    color="success"
                    variant="filled"
                    size="small"
                  />
                )}
              </Stack>

              {/* Selection checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedActivities.includes(currentActivity?.id)}
                    onChange={() => handleToggleActivity(currentActivity?.id)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" fontWeight="bold">
                    {selectedActivities.includes(currentActivity?.id) 
                      ? '✓ Activity Selected' 
                      : 'Select this Activity'}
                  </Typography>
                }
              />
            </Box>
          </Card>

          {/* All Activities List */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            All Activities ({displayActivities.length})
          </Typography>
          
          <Stack spacing={2}>
            {displayActivities.map((activity, index) => (
              <Card
                key={activity.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: currentImageIndex === index ? '2px solid' : '1px solid',
                  borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                  bgcolor: selectedActivities.includes(activity.id) ? 'success.50' : 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => {
                  setCurrentImageIndex(index);
                  sendActivityImageChange(index);
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Checkbox
                    checked={selectedActivities.includes(activity.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleActivity(activity.id);
                    }}
                    color="primary"
                    icon={<Box sx={{ width: 24, height: 24, border: '2px solid', borderColor: 'divider', borderRadius: '4px' }} />}
                    checkedIcon={<CheckCircleIcon />}
                  />
                  <CardMedia
                    component="img"
                    image={activity.image}
                    alt={activity.name}
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: 1,
                      objectFit: 'cover',
                    }}
                  />
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {activity.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {activity.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={activity.duration}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={activity.difficulty}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>
      </DialogContent>

      {/* Action buttons */}
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveActivities}
            variant="contained"
            color="primary"
            disabled={selectedActivities.length === 0}
            startIcon={<CheckCircleIcon />}
          >
            Save Activities
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ActivitiesModal;
