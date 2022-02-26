import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, CreditCard, Smartphone, Building2, Mail, MapPin, Phone, User, Lock } from 'lucide-react';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { RadioGroup, RadioGroupItem } from '@components/ui/RadioGroup';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/Tabs';
import { formatPrice } from '@utils/format'
import { cn } from '@utils/cn';
import { useToastHelpers } from '@components/ui/Toast';

const steps = [
  { id: 'info', label: 'Information', icon: Mail },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

import { Truck } from 'lucide-react';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated, login } = useAuthStore();
  const { success, error } = useToastHelpers();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center py-16">
        <div className="text-center">
          <h2 className="heading-2 mb-2">Your cart is empty</h2>
          <Button asChild variant="primary" size="lg" className="mt-4">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal >= 200000 ? 0 : 9900;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }

    if (step === 1) {
      if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    }

    if (step === 2) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
        else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number';
        if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
        if (!formData.cardCvv) newErrors.cardCvv = 'CVV is required';
      }
      if (formData.paymentMethod === 'upi' && !formData.upiId) {
        newErrors.upiId = 'UPI ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate order creation
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    setIsProcessing(false);

    success('Order Placed!', `Your order ${orderId} has been confirmed.`);
    navigate(`/order-success/${orderId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={cn(
                  'relative w-12 h-12 rounded-full flex items-center justify-center text-body-sm font-medium transition-all',
                  index < currentStep
                    ? 'bg-sage-600 text-cream-50'
                    : index === currentStep
                      ? 'bg-olive-950 text-cream-50 ring-4 ring-olive-950/20'
                      : 'bg-olive-100 text-olive-400'
                )}>
                  {index < currentStep ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                </div>
                <span className={cn('mt-2 text-caption font-medium', index <= currentStep ? 'text-olive-900' : 'text-olive-400')}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'absolute top-6 left-1/2 w-full h-1',
                    index < currentStep ? 'bg-sage-600' : 'bg-olive-100'
                  )} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <form onSubmit={handleSubmit}>
              {/* Step 1: Information */}
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card padding="lg">
                      <h3 className="heading-3 mb-6 flex items-center gap-2">
                        <Mail className="w-6 h-6 text-sage-600" />
                        Contact Information
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <Input
                          label="First Name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          error={errors.firstName}
                          placeholder="John"
                          required
                        />
                        <Input
                          label="Last Name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          error={errors.lastName}
                          placeholder="Doe"
                          required
                        />
                      </div>

                      <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        placeholder="john@example.com"
                        required
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        error={errors.phone}
                        placeholder="+91 98765 43210"
                        required
                      />

                      {!isAuthenticated && (
                        <div className="mt-4 p-4 bg-olive-50 rounded-lg border border-olive-200">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="mt-1 w-4 h-4 text-sage-600 border-olive-300 rounded focus:ring-sage-500"
                            />
                            <div>
                              <p className="font-medium text-olive-900 text-body-sm">Create an account</p>
                              <p className="text-caption text-olive-600 mt-0.5">
                                Save your information for faster checkout next time
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </Card>

                    <div className="flex justify-end mt-6">
                      <Button size="lg" onClick={handleNext} disabled={isProcessing}>
                        Continue to Shipping
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 2: Shipping */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card padding="lg">
                      <h3 className="heading-3 mb-6 flex items-center gap-2">
                        <Truck className="w-6 h-6 text-sage-600" />
                        Shipping Address
                      </h3>

                      <Input
                        label="Address Line 1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        error={errors.addressLine1}
                        placeholder="House/Flat No, Building, Street"
                        required
                      />

                      <Input
                        label="Address Line 2 (Optional)"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                        placeholder="Landmark, Area"
                      />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="City"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          error={errors.city}
                          placeholder="Mumbai"
                          required
                        />
                        <Input
                          label="State"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          error={errors.state}
                          placeholder="Maharashtra"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="Postal Code"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          error={errors.postalCode}
                          placeholder="400001"
                          required
                        />
                        <Input
                          label="Country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          disabled
                        />
                      </div>

                      <div className="mt-6">
                        <h4 className="font-medium text-olive-900 text-body-sm mb-3">Shipping Method</h4>
                        <RadioGroup value={formData.shippingMethod} onChange={(v) => handleInputChange('shippingMethod', v)}>
                          <div className="space-y-3">
                            <RadioGroupItem
                              value="standard"
                              label="Standard Shipping"
                              description={shipping === 0 ? 'Free (5-7 business days)' : `₹${shipping/100} (5-7 business days)`}
                            />
                            <RadioGroupItem
                              value="express"
                              label="Express Shipping"
                              description={`₹${199} (2-3 business days)`}
                            />
                          </div>
                        </RadioGroup>
                      </div>
                    </Card>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" size="lg" onClick={handleBack}>
                        <ArrowRight className="w-5 h-5 rotate-180" />
                        Back
                      </Button>
                      <Button size="lg" onClick={handleNext} disabled={isProcessing}>
                        Continue to Payment
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Payment */}
              <AnimatePresence mode="wait">
                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card padding="lg">
                      <h3 className="heading-3 mb-6 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-sage-600" />
                        Payment Method
                      </h3>

                      <RadioGroup value={formData.paymentMethod} onChange={(v) => handleInputChange('paymentMethod', v)}>
                        <div className="space-y-3">
                          <RadioGroupItem
                            value="cod"
                            label="Cash on Delivery"
                            description="Pay when you receive your order"
                            icon={<Mail className="w-5 h-5" />}
                          />
                          <RadioGroupItem
                            value="card"
                            label="Credit / Debit Card"
                            description="Visa, Mastercard, RuPay, Amex"
                            icon={<CreditCard className="w-5 h-5" />}
                          />
                          <RadioGroupItem
                            value="upi"
                            label="UPI"
                            description="PhonePe, Google Pay, Paytm, BHIM"
                            icon={<Smartphone className="w-5 h-5" />}
                          />
                          <RadioGroupItem
                            value="netbanking"
                            label="Net Banking"
                            description="All major Indian banks"
                            icon={<Building2 className="w-5 h-5" />}
                          />
                        </div>
                      </RadioGroup>

                      {formData.paymentMethod === 'card' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 space-y-4"
                        >
                          <Input
                            label="Card Number"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                            error={errors.cardNumber}
                            placeholder="1234 5678 9012 3456"
                            leftIcon={<Lock className="w-5 h-5" />}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Expiry (MM/YY)"
                              value={formData.cardExpiry}
                              onChange={(e) => handleInputChange('cardExpiry', e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2'))}
                              error={errors.cardExpiry}
                              placeholder="12/25"
                            />
                            <Input
                              label="CVV"
                              type="password"
                              value={formData.cardCvv}
                              onChange={(e) => handleInputChange('cardCvv', e.target.value.replace(/\D/g, ''))}
                              error={errors.cardCvv}
                              placeholder="123"
                            />
                          </div>
                        </motion.div>
                      )}

                      {formData.paymentMethod === 'upi' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6"
                        >
                          <Input
                            label="UPI ID"
                            value={formData.upiId}
                            onChange={(e) => handleInputChange('upiId', e.target.value)}
                            error={errors.upiId}
                            placeholder="yourname@upi"
                            leftIcon={<Smartphone className="w-5 h-5" />}
                          />
                        </motion.div>
                      )}

                      {formData.paymentMethod === 'netbanking' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6"
                        >
                          <p className="text-olive-600 text-body-sm mb-3">
                            You will be redirected to your bank's secure payment page after placing the order.
                          </p>
                          <select
                            value=""
                            onChange={(e) => handleInputChange('bank', e.target.value)}
                            className="input"
                          >
                            <option value="">Select Your Bank</option>
                            <option>State Bank of India</option>
                            <option>HDFC Bank</option>
                            <option>ICICI Bank</option>
                            <option>Axis Bank</option>
                            <option>Kotak Mahindra Bank</option>
                            <option>Punjab National Bank</option>
                            <option>Bank of Baroda</option>
                            <option>Other Bank</option>
                          </select>
                        </motion.div>
                      )}
                    </Card>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" size="lg" onClick={handleBack}>
                        <ArrowRight className="w-5 h-5 rotate-180" />
                        Back
                      </Button>
                      <Button size="lg" onClick={handleNext} disabled={isProcessing}>
                        Continue to Review
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 4: Review */}
              <AnimatePresence mode="wait">
                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card padding="lg">
                      <h3 className="heading-3 mb-6 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-sage-600" />
                        Review Your Order
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-olive-900 text-body-sm mb-3">Contact</h4>
                          <p className="text-olive-600 text-body-sm">{formData.email}</p>
                          <p className="text-olive-600 text-body-sm">{formData.phone}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-olive-900 text-body-sm mb-3">Shipping Address</h4>
                          <p className="text-olive-600 text-body-sm">
                            {formData.firstName} {formData.lastName}<br />
                            {formData.addressLine1}<br />
                            {formData.addressLine2 && `${formData.addressLine2}<br />`}
                            {formData.city}, {formData.state} {formData.postalCode}<br />
                            {formData.country}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-olive-900 text-body-sm mb-3">Payment Method</h4>
                          <p className="text-olive-600 text-body-sm capitalize">{formData.paymentMethod.replace('cod', 'Cash on Delivery').replace('upi', 'UPI').replace('netbanking', 'Net Banking')}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-olive-900 text-body-sm mb-3">Order Items</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {cart.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-body-sm py-2 border-b border-olive-100">
                                <span className="text-olive-600">{item.product.name} × {item.quantity}</span>
                                <span className="font-medium text-olive-900">{formatPrice(item.variant.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" size="lg" onClick={handleBack}>
                        <ArrowRight className="w-5 h-5 rotate-180" />
                        Back
                      </Button>
                      <Button size="lg" onClick={handleSubmit} isLoading={isProcessing} disabled={isProcessing} className="w-full sm:w-auto">
                        {isProcessing ? 'Processing...' : 'Place Order'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="sticky top-24" padding="lg">
              <h3 className="heading-3 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-olive-900 text-body-sm truncate">{item.product.name}</p>
                      <p className="text-caption text-olive-500">{Object.values(item.variant.attributes).join(' / ')}</p>
                      <p className="font-medium text-olive-900 text-body-sm">{formatPrice(item.variant.price * item.quantity)}</p>
                    </div>
                    <span className="text-caption text-olive-500 self-center">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-olive-200 pt-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Subtotal</span>
                  <span className="font-medium text-olive-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Shipping</span>
                  <span className="font-medium text-olive-900">
                    {shipping === 0 ? <span className="text-sage-600 flex items-center gap-1"><Truck className="w-4 h-4" /> Free</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Tax (18% GST)</span>
                  <span className="font-medium text-olive-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-heading-sm font-display font-medium text-olive-950 pt-2 border-t border-olive-200">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}