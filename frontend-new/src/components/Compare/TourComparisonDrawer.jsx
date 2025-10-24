import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Alert,
    Button,
    Divider,
    Tooltip,
    Collapse,
    Slide,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Close as CloseIcon,
    Compare as CompareIcon,
    Star as StarIcon,
    AttachMoney as MoneyIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    Delete as DeleteIcon,
    EmojiEvents as TrophyIcon,
    TrendingUp as TrendingUpIcon,
    LocalOffer as OfferIcon
} from '@mui/icons-material';
import { useUnifiedScrollSync } from '../../hooks/useUnifiedScrollSync';

const TourComparisonDrawer = ({
    open,
    onClose,
    compareList,
    onRemoveFromCompare,
    onClearComparison,
    userType = 'agent',
    sendComparisonAction = null
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Use the unified scroll sync hook (enabled only when drawer is open)
    const { scrollRef } = useUnifiedScrollSync(userType, open, 'comparison');

    // Effect to handle bidirectional actions (clear comparison and close drawer) (handled by parent)
    // Signal listening is now handled by parent components

    // Function to send clear comparison signal to other party (handled by parent)
    const handleClearComparison = () => {
        console.log(`🎭 [${userType}] Sending clear comparison signal`);

        if (sendComparisonAction) {
            sendComparisonAction('clear-comparison');
        }

        // Call the original clear comparison function
        onClearComparison();
    };

    // Function to send close comparison signal to other party (handled by parent)
    const handleCloseComparison = () => {
        console.log(`🎭 [${userType}] Sending close comparison signal`);

        if (sendComparisonAction) {
            sendComparisonAction('close-comparison');
        }

        // Call the original close function
        onClose();
    };

    // Helper function to get best priced package
    const getBestPricedPackage = () => {
        if (compareList.length === 0) return null;
        return compareList.reduce((best, current) => {
            const bestPrice = best.price?.discounted || best.price;
            const currentPrice = current.price?.discounted || current.price;
            return currentPrice < bestPrice ? current : best;
        });
    };

    const bestPricedPackage = getBestPricedPackage();

    // Helper function to calculate savings
    const getSavings = (pkg) => {
        if (!bestPricedPackage || pkg.id === bestPricedPackage.id) return 0;
        const pkgPrice = pkg.price?.discounted || pkg.price;
        const bestPrice = bestPricedPackage.price?.discounted || bestPricedPackage.price;
        return pkgPrice - bestPrice;
    };

    // Helper function to calculate discount percentage
    const getDiscountPercentage = (pkg) => {
        if (!bestPricedPackage || pkg.id === bestPricedPackage.id) return 0;
        const pkgPrice = pkg.price?.discounted || pkg.price;
        const bestPrice = bestPricedPackage.price?.discounted || bestPricedPackage.price;
        return Math.round(((pkgPrice - bestPrice) / pkgPrice) * 100);
    };

    // Helper functions
    const getPackageDuration = (packageData) => {
        if (packageData.duration) return packageData.duration;
        if (packageData.days) return `${packageData.days} days`;
        return 'Duration not specified';
    };

    const getPackageHighlights = (packageData) => {
        const highlightsMap = {
            'Adventure': ['Professional guides', 'Safety equipment', 'Mountain views'],
            'Cultural': ['Local guides', 'Historical sites', 'Traditional experiences'],
            'Relaxation': ['Luxury accommodation', 'Spa access', 'Beach activities'],
            'Party': ['Nightlife access', 'DJ events', 'Premium drinks'],
            'Trekking': ['Expert guides', 'Mountain gear', 'Scenic trails']
        };
        return highlightsMap[packageData.type] || ['Guided tours', 'Local experiences', 'Quality accommodation'];
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            variant="temporary"
            sx={{
                zIndex: 9999, // Ensure it appears above all other modals
                '& .MuiBackdrop-root': {
                    zIndex: 9998, // Backdrop should be below the drawer but above other content
                },
                '& .MuiDrawer-paper': {
                    width: isMobile ? '100vw' : 600,
                    maxWidth: '90vw',
                    bgcolor: 'background.paper',
                    boxShadow: theme.shadows[24],
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    zIndex: 9999, // Ensure drawer paper is on top
                },
            }}
            transitionDuration={300}
            ModalProps={{
                keepMounted: true, // Better for performance
                disablePortal: false, // Allow proper stacking
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${theme.palette.primary.dark}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CompareIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userType === 'customer' ? 'Package Comparison' : 'Package Comparison'}
                    </Typography>
                    {compareList.length > 0 && (
                        <Chip
                            label={`${compareList.length}/3`}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 600,
                            }}
                        />
                    )}
                    {/* Scroll Sync Indicator */}
                    <Chip
                        label="Scroll Sync"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '20px',
                        }}
                    />
                    {/* Debug Info */}
                    <Chip
                        label={`${compareList.length} items`}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '20px',
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {compareList.length > 0 && userType === 'agent' && (
                        <Tooltip title="Clear all comparisons">
                            <IconButton
                                onClick={handleClearComparison}
                                sx={{ color: 'white' }}
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {/* Test Scroll Sync Button */}
                    <Tooltip title="Test scroll sync">
                        <IconButton
                            onClick={() => { }} // No longer needed for test
                            sx={{ color: 'white' }}
                            size="small"
                        >
                            <CompareIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={handleCloseComparison} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Content */}
            <Box
                ref={scrollRef}
                id={`comparison-scroll-${userType}`}
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    scrollBehavior: 'smooth',
                    position: 'relative',
                    minHeight: '400px', // Ensure minimum height for scrolling
                    maxHeight: 'calc(100vh - 200px)', // Ensure it doesn't exceed viewport
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                    },
                }}
            // onScroll={handleScroll} // No longer needed for scroll sync
            >
                {compareList.length === 0 ? (
                    // Empty State
                    <Fade in={true} timeout={500}>
                        <Box
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <CompareIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary">
                                No packages to compare
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Select up to 3 packages to compare their features and prices
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    // Comparison Content
                    <Box sx={{ p: 3 }}>
                        {/* Best Value Alert */}
                        {bestPricedPackage && compareList.length > 1 && (
                            <Slide direction="down" in={true} timeout={600}>
                                <Alert
                                    icon={<TrophyIcon />}
                                    severity="success"
                                    sx={{
                                        mb: 3,
                                        '& .MuiAlert-message': {
                                            fontWeight: 600,
                                        },
                                    }}
                                >
                                    <strong>Best Value:</strong> {bestPricedPackage.name} at ${(bestPricedPackage.price?.discounted || bestPricedPackage.price)?.toLocaleString()}
                                </Alert>
                            </Slide>
                        )}

                        {/* Package Comparison Grid */}
                        <Grid container spacing={3}>
                            {compareList.map((pkg, index) => {
                                const isBestPrice = bestPricedPackage?.id === pkg.id;
                                const savings = getSavings(pkg);
                                const discountPercentage = getDiscountPercentage(pkg);

                                return (
                                    <Grid sx={{ width: "250px" }} item xs={3} lg={3} md={3} key={pkg.id}>
                                        <Slide direction="up" in={true} timeout={300 + index * 200}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    position: 'relative',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: theme.shadows[8],
                                                    },
                                                    border: isBestPrice ? `3px solid ${theme.palette.success.main}` : '1px solid',
                                                    borderColor: isBestPrice ? theme.palette.success.main : theme.palette.divider,
                                                    boxShadow: isBestPrice ? '0 8px 25px rgba(76, 175, 80, 0.25)' : '0 2px 8px rgba(0,0,0,0.1)',
                                                    background: isBestPrice ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(46, 125, 50, 0.1))' : 'background.paper',
                                                }}
                                            >
                                                {/* Best Price Badge */}
                                                {isBestPrice && compareList.length > 1 && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            zIndex: 3,
                                                        }}
                                                    >
                                                        <Chip
                                                            icon={<TrophyIcon />}
                                                            label="BEST VALUE"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'success.main',
                                                                color: 'white',
                                                                fontWeight: 'bold',
                                                                fontSize: '0.7rem',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                                                            }}
                                                        />
                                                    </Box>
                                                )}

                                                {/* Remove Button */}
                                                {userType === 'agent' && (
                                                    <IconButton
                                                        onClick={() => onRemoveFromCompare(pkg.id)}
                                                        sx={{
                                                            position: "absolute",
                                                            top: 8,
                                                            left: 8,
                                                            zIndex: 2,
                                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                            '&:hover': {
                                                                bgcolor: 'error.main',
                                                                color: 'white',
                                                            },
                                                        }}
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}

                                                {/* Package Image */}
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={pkg.image}
                                                    alt={pkg.name}
                                                    sx={{
                                                        objectFit: 'cover',
                                                        position: 'relative',
                                                    }}
                                                />

                                                <CardContent sx={{ p: 2 }}>
                                                    {/* Package Name */}
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            mb: 1,
                                                            lineHeight: 1.2,
                                                            minHeight: '2.4rem',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            color: isBestPrice ? 'success.main' : 'text.primary',
                                                        }}
                                                    >
                                                        {pkg.name}
                                                    </Typography>

                                                    {/* Package Type */}
                                                    <Chip
                                                        label={pkg.type}
                                                        size="small"
                                                        sx={{
                                                            mb: 2,
                                                            bgcolor: isBestPrice ? 'success.light' : 'primary.light',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                        }}
                                                    />

                                                    {/* Enhanced Price Display */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mb: 2,
                                                        p: isBestPrice ? 1.5 : 0,
                                                        bgcolor: isBestPrice ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                                                        borderRadius: isBestPrice ? 1 : 0,
                                                        border: isBestPrice ? '2px solid #c8e6c9' : 'none',
                                                    }}>
                                                        <MoneyIcon color={isBestPrice ? "success" : "primary"} />
                                                        <Box>
                                                            <Typography
                                                                variant="h5"
                                                                color={isBestPrice ? "success.main" : "primary.main"}
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize: isBestPrice ? '1.5rem' : '1.25rem',
                                                                }}
                                                            >
                                                                ${(pkg.price?.discounted || pkg.price)?.toLocaleString()}
                                                            </Typography>
                                                            {isBestPrice && (
                                                                <Typography
                                                                    variant="caption"
                                                                    color="success.main"
                                                                    sx={{ fontWeight: 'bold' }}
                                                                >
                                                                    LOWEST PRICE
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>

                                                    {/* Savings Display for non-best packages */}
                                                    {!isBestPrice && savings > 0 && (
                                                        <Box sx={{
                                                            mb: 2,
                                                            p: 1,
                                                            bgcolor: 'warning.light',
                                                            borderRadius: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                        }}>
                                                            <OfferIcon color="warning" fontSize="small" />
                                                            <Typography variant="body2" color="warning.dark" fontWeight="bold">
                                                                Save ${savings.toLocaleString()} ({discountPercentage}% more)
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {/* Duration */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                        <TimeIcon color="action" />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {getPackageDuration(pkg)}
                                                        </Typography>
                                                    </Box>

                                                    <Divider sx={{ my: 2 }} />

                                                    {/* Highlights */}
                                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                                        Highlights:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        {getPackageHighlights(pkg).map((highlight, idx) => (
                                                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {highlight}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>

                                                    {/* Description */}
                                                    <Collapse in={true} timeout={800}>
                                                        <Box sx={{ mt: 2 }}>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    lineHeight: 1.5,
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                }}
                                                            >
                                                                {pkg.description}
                                                            </Typography>
                                                        </Box>
                                                    </Collapse>
                                                </CardContent>
                                            </Card>
                                        </Slide>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Action Buttons */}
                        {compareList.length > 0 && (
                            <Fade in={true} timeout={1000}>
                                <Box
                                    sx={{
                                        mt: 3,
                                        pt: 2,
                                        borderTop: `1px solid ${theme.palette.divider}`,
                                        display: 'flex',
                                        gap: 2,
                                        justifyContent: 'center',
                                    }}
                                >
                                    {userType === 'agent' && (
                                        <Button
                                            variant="outlined"
                                            onClick={handleClearComparison}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseComparison}
                                    >
                                        Close Comparison
                                    </Button>
                                </Box>
                            </Fade>
                        )}
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default TourComparisonDrawer; 