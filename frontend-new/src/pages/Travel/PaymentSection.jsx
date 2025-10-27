import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Checkbox,
  Paper,
  Button,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { syncManager } from "../../sync/syncManager";

const PaymentSection = ({ onClose, packageData }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Listen to syncManager for payment step changes
  useEffect(() => {
    const unsubscribe = syncManager.onStateChange((state) => {
      if (state.metadata?.paymentStep !== undefined) {
        setActiveStep(state.metadata.paymentStep);
      }
    });
    return unsubscribe;
  }, []);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });
  const [errors, setErrors] = useState({});
  
  const steps = ["Order Summary", "Payment Details", "Confirmation"];

  // Sample package data if not provided
  const defaultPackage = {
    title: "Bali Premium Retreat",
    location: "Bali, Indonesia",
    duration: "8D/7N",
    price: "£1,650",
    adults: 2,
    children: 0,
  };

  const pkg = packageData || defaultPackage;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;
    let fieldError = "";

    if (name === "cardNumber") {
      if (/\D/.test(value.replace(/\s/g, ""))) {
        fieldError = "Only numbers are allowed in card number.";
      }
      val = value.replace(/\D/g, "").slice(0, 16);
      val = val.replace(/(.{4})/g, "$1 ").trim();
    }

    if (name === "expiry") {
      val = val.replace(/\D/g, "").slice(0, 4);
      if (val.length >= 3) {
        val = `${val.slice(0, 2)}/${val.slice(2)}`;
      }
    }

    if (name === "cvv") {
      if (/\D/.test(value)) {
        fieldError = "Only numbers are allowed in CVV.";
      }
      val = val.replace(/\D/g, "").slice(0, 3);
    }

    setPaymentDetails((prev) => ({ ...prev, [name]: val }));
    setErrors((prevErrors) => {
      const updated = { ...prevErrors };
      if (fieldError) {
        updated[name] = fieldError;
      } else {
        delete updated[name];
      }
      return updated;
    });
  };

  const validate = () => {
    const newErrors = {};
    const { cardHolderName, cardNumber, expiry, cvv } = paymentDetails;

    if (!cardHolderName.trim()) {
      newErrors.cardHolderName = "Card Holder name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(cardHolderName)) {
      newErrors.cardHolderName = "Name must contain only letters.";
    }

    const cleanedCardNumber = cardNumber.replace(/\s+/g, "");
    if (!cleanedCardNumber) {
      newErrors.cardNumber = "Card number is required.";
    } else if (cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }

    if (!expiry) {
      newErrors.expiry = "Expiration date is required.";
    } else {
      const [monthStr, yearStr] = expiry.split("/");
      const month = parseInt(monthStr, 10);
      const year = parseInt(`20${yearStr}`, 10);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (
        !/^\d{2}\/\d{2}$/.test(expiry) ||
        month < 1 ||
        month > 12 ||
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiry = "Enter a valid future date in MM/YY format.";
      }
    }

    if (!cvv) {
      newErrors.cvv = "CVV is required.";
    } else if (cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const newStep = 2;
      setActiveStep(newStep);
      syncManager.paymentStep(newStep);
    }
  };

  const handleContinueToPayment = () => {
    const newStep = 1;
    setActiveStep(newStep);
    syncManager.paymentStep(newStep);
  };

  const handleBack = () => {
    const newStep = activeStep - 1;
    setActiveStep(newStep);
    syncManager.paymentStep(newStep);
  };

  // Calculate totals
  const basePrice = parseInt(pkg.price?.replace(/[£,]/g, "") || "1650");
  const numberOfAdults = pkg.adults || 2;
  const numberOfChildren = pkg.children || 0;
  const subtotal = basePrice * numberOfAdults + basePrice * 0.7 * numberOfChildren;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Container sx={{ py: 3 }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fafafa",
        }}
      >
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Order Summary */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review your booking details before proceeding to payment
            </Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {pkg.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {pkg.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: {pkg.duration}
              </Typography>
            </Paper>

            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={`Adults (${numberOfAdults})`}
                  secondary={`£${basePrice.toLocaleString()} per person`}
                />
                <Typography variant="body1" fontWeight="600">
                  £{(basePrice * numberOfAdults).toLocaleString()}
                </Typography>
              </ListItem>
              {numberOfChildren > 0 && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={`Children (${numberOfChildren})`}
                    secondary={`£${(basePrice * 0.7).toLocaleString()} per child`}
                  />
                  <Typography variant="body1" fontWeight="600">
                    £{(basePrice * 0.7 * numberOfChildren).toLocaleString()}
                  </Typography>
                </ListItem>
              )}
              <Divider sx={{ my: 2 }} />
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">£{subtotal.toLocaleString()}</Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Taxes & Fees (10%)" />
                <Typography variant="body1">£{tax.toFixed(2)}</Typography>
              </ListItem>
              <Divider sx={{ my: 2 }} />
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      Total Amount
                    </Typography>
                  }
                />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  £{total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleContinueToPayment}
              sx={{ mt: 3, fontWeight: "bold" }}
            >
              Continue to Payment
            </Button>
          </Box>
        )}

        {/* Step 2: Payment Details */}
        {activeStep === 1 && (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              Payment Details
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              Total: £{total.toFixed(2)}
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Pay With:
              </FormLabel>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="Card"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              required
              label="Card Holder Name"
              name="cardHolderName"
              placeholder="John Doe"
              value={paymentDetails.cardHolderName}
              onChange={handleChange}
              error={!!errors.cardHolderName}
              helperText={errors.cardHolderName}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              required
              label="Card Number"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={paymentDetails.cardNumber}
              onChange={handleChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber || "Test card: 4242 4242 4242 4242"}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box display="flex" gap={2} mb={2}>
              <TextField
                required
                label="Expiry Date"
                name="expiry"
                placeholder="MM/YY"
                value={paymentDetails.expiry}
                onChange={handleChange}
                error={!!errors.expiry}
                helperText={errors.expiry}
                fullWidth
              />
              <TextField
                required
                label="CVV"
                name="cvv"
                placeholder="123"
                value={paymentDetails.cvv}
                onChange={handleChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                type="password"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="saveCard"
                  checked={paymentDetails.saveCard}
                  onChange={handleChange}
                />
              }
              label="Save card details for future bookings"
              sx={{ mb: 3 }}
            />

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ flex: 1 }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                sx={{ flex: 2, fontWeight: "bold" }}
              >
                Pay £{total.toFixed(2)}
              </Button>
            </Box>
          </>
        )}

        {/* Step 3: Thank You Page */}
        {activeStep === 2 && (
          <Box textAlign="center">
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: "success.main",
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for your payment. Your booking has been confirmed.
            </Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: "left" }}>
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" gutterBottom>
                <strong>Package:</strong> {pkg.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Location:</strong> {pkg.location}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Duration:</strong> {pkg.duration}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Travelers:</strong> {numberOfAdults} Adults
                {numberOfChildren > 0 && `, ${numberOfChildren} Children`}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Total Paid:</strong> £{total.toFixed(2)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Payment Method:</strong> Card ending in{" "}
                {paymentDetails.cardNumber.slice(-4)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                A confirmation email has been sent to your registered email
                address.
              </Typography>
            </Paper>

            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              onClick={onClose}
              sx={{ fontWeight: "bold" }}
            >
              Close
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentSection;
