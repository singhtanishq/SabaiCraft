import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building2,
  MapPin,
  Lock,
  Truck,
  LogIn,
  User,
} from 'lucide-react';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { api } from '@services/api';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { RadioGroup, RadioGroupItem } from '@components/ui/RadioGroup';
import { Skeleton } from '@components/ui/Skeleton';
import { formatPrice } from '@utils/format';
import { cn } from '@utils/cn';
import { useToastHelpers } from '@components/ui';
import type { Address } from '@types/index';

const steps = [
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: CheckCircle },
] as const;

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', description: 'Pay in cash when your order arrives', icon: <Truck className="w-5 h-5" /> },
  { value: 'CARD', label: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay, Amex', icon: <CreditCard className="w-5 h-5" /> },
  { value: 'UPI', label: 'UPI', description: 'PhonePe, Google Pay, Paytm, BHIM', icon: <Smartphone className="w-5 h-5" /> },
  { value: 'NETBANKING', label: 'Net Banking', description: 'All major Indian banks', icon: <Building2 className="w-5 h-5" /> },
] as const;

const paymentMethodLabel = (value: string) =>
  PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value;

const emptyAddressForm = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { success, error: toastError } = useToastHelpers();

  // Hooks must run unconditionally (before any early returns).
  const [currentStep, setCurrentStep] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [paymentMethod, setPaymentMethod] = useState<string>('COD');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const hasItems = !!cart && cart.items.length > 0;

  useEffect(() => {
    document.title = 'Checkout | SabaiCraft';
  }, []);

  // Load saved addresses for signed-in users.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    setAddressesLoading(true);
    api
      .getAddresses()
      .then((response) => {
        if (cancelled) return;
        const addresses: Address[] = response.data ?? [];
        setSavedAddresses(addresses);
        const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
        if (preferred) {
          setSelectedAddressId((current) => current ?? preferred.id);
          setShowAddressForm(addresses.length === 0);
        } else {
          setShowAddressForm(true);
        }
      })
      .catch(() => {
        if (!cancelled) setShowAddressForm(true);
      })
      .finally(() => {
        if (!cancelled) setAddressesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 200000 ? 0 : 9900;
  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const total = subtotal + shipping + tax;

  const setField = (field: string, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  };

  const validateAddressForm = (): boolean => {
    const next: Record<string, string> = {};
    if (!addressForm.name.trim()) next.name = 'Full name is required';
    if (!addressForm.phone.trim()) next.phone = 'Phone number is required';
    else if (!/^[\d+\-\s()]{10,15}$/.test(addressForm.phone.trim())) next.phone = 'Enter a valid phone number';
    if (!addressForm.addressLine1.trim()) next.addressLine1 = 'Address is required';
    if (!addressForm.city.trim()) next.city = 'City is required';
    if (!addressForm.state.trim()) next.state = 'State is required';
    if (!addressForm.postalCode.trim()) next.postalCode = 'Postal code is required';
    else if (!/^\d{6}$/.test(addressForm.postalCode.trim())) next.postalCode = 'Enter a valid 6-digit PIN code';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = async () => {
    let addressId = selectedAddressId;

    if (showAddressForm || !addressId) {
      if (!validateAddressForm()) {
        setCurrentStep(0);
        return;
      }
    }

    setIsProcessing(true);
    try {
      if (showAddressForm || !addressId) {
        const addressResponse = await api.createAddress({
          name: addressForm.name.trim(),
          phone: addressForm.phone.trim(),
          addressLine1: addressForm.addressLine1.trim(),
          addressLine2: addressForm.addressLine2.trim() || undefined,
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          postalCode: addressForm.postalCode.trim(),
          country: addressForm.country,
          type: 'shipping',
        });
        addressId = addressResponse.data.id;
      }

      const orderResponse = await api.createOrder({
        shippingAddressId: addressId!,
        paymentMethod: paymentMethod as 'COD' | 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET',
      });

      await clearCart();
      success('Order placed!', `Your order ${orderResponse.data.orderNumber} has been confirmed.`);
      navigate(`/order-success/${orderResponse.data.id}`, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      toastError('Order failed', message);
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- Gate: not signed in ----
  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-cream-50 flex items-center justify-center py-16 px-4">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-sage-600" />
          </div>
          <h1 className="heading-3 mb-2">Sign in to checkout</h1>
          <p className="body-sm text-olive-600 mb-8">
            Sign in or create an account to place your order, track shipments, and reorder your favourites.
          </p>
          <div className="space-y-3">
            <Button asChild variant="primary" size="lg" className="w-full">
              <Link to="/login?redirect=/checkout">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/register?redirect=/checkout">Create Account</Link>
            </Button>
          </div>
          {hasItems && (
            <p className="caption text-olive-500 mt-6">
              Your cart ({cart!.items.length} item{cart!.items.length !== 1 ? 's' : ''}) will be waiting for you.
            </p>
          )}
        </Card>
      </div>
    );
  }

  // ---- Gate: empty cart ----
  if (!hasItems) {
    return (
      <div className="flex-1 bg-cream-50 flex items-center justify-center py-16 px-4">
        <div className="text-center">
          <h1 className="heading-2 mb-2">Your cart is empty</h1>
          <p className="body text-olive-600 mb-6">Add some treasures before heading to checkout.</p>
          <Button asChild variant="primary" size="lg">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="heading-1 mb-2">Checkout</h1>
          <p className="text-olive-600 text-body-lg">
            {cart!.items.length} item{cart!.items.length !== 1 ? 's' : ''} · {formatPrice(total)}
          </p>
        </div>

        {/* Progress steps */}
        <nav aria-label="Checkout progress" className="mb-10">
          <ol className="flex items-center">
            {steps.map((step, index) => {
              const isComplete = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <li key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2 flex-none">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-body-sm font-medium transition-all',
                        isComplete
                          ? 'bg-sage-600 text-cream-50'
                          : isCurrent
                            ? 'bg-olive-950 text-cream-50 ring-4 ring-olive-950/10'
                            : 'bg-olive-100 text-olive-400'
                      )}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      {isComplete ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span
                      className={cn(
                        'text-caption font-medium whitespace-nowrap',
                        isComplete || isCurrent ? 'text-olive-900' : 'text-olive-400'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-3 mb-6 rounded-full" aria-hidden="true">
                      <div className={cn('h-full rounded-full transition-all', isComplete ? 'bg-sage-600' : 'bg-olive-100')} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Form column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping */}
            {currentStep === 0 && (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-3 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-sage-600" />
                    Shipping Address
                  </h2>
                  {savedAddresses.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => { setShowAddressForm((v) => !v); setErrors({}); }}>
                      {showAddressForm ? 'Use saved address' : '+ New address'}
                    </Button>
                  )}
                </div>

                {addressesLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : !showAddressForm && savedAddresses.length > 0 ? (
                  <RadioGroup
                    value={selectedAddressId ?? ''}
                    onChange={(v) => setSelectedAddressId(v)}
                  >
                    {savedAddresses.map((address) => (
                      <RadioGroupItem
                        key={address.id}
                        value={address.id}
                        label={`${address.name}${address.isDefault ? ' · Default' : ''}`}
                        description={`${address.addressLine1}${address.addressLine2 ? `, ${address.addressLine2}` : ''}, ${address.city}, ${address.state} ${address.postalCode} · ${address.phone}`}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={addressForm.name}
                        onChange={(e) => setField('name', e.target.value)}
                        error={errors.name}
                        placeholder={user?.name || 'John Doe'}
                        autoComplete="name"
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                        error={errors.phone}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        required
                      />
                    </div>
                    <Input
                      label="Address Line 1"
                      value={addressForm.addressLine1}
                      onChange={(e) => setField('addressLine1', e.target.value)}
                      error={errors.addressLine1}
                      placeholder="House/Flat No, Building, Street"
                      autoComplete="address-line1"
                      required
                    />
                    <Input
                      label="Address Line 2 (Optional)"
                      value={addressForm.addressLine2}
                      onChange={(e) => setField('addressLine2', e.target.value)}
                      placeholder="Landmark, Area"
                      autoComplete="address-line2"
                    />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={addressForm.city}
                        onChange={(e) => setField('city', e.target.value)}
                        error={errors.city}
                        placeholder="Mumbai"
                        autoComplete="address-level2"
                        required
                      />
                      <Input
                        label="State"
                        value={addressForm.state}
                        onChange={(e) => setField('state', e.target.value)}
                        error={errors.state}
                        placeholder="Maharashtra"
                        autoComplete="address-level1"
                        required
                      />
                      <Input
                        label="PIN Code"
                        inputMode="numeric"
                        maxLength={6}
                        value={addressForm.postalCode}
                        onChange={(e) => setField('postalCode', e.target.value.replace(/\D/g, ''))}
                        error={errors.postalCode}
                        placeholder="400001"
                        autoComplete="postal-code"
                        required
                      />
                    </div>
                    <Input
                      label="Country"
                      value={addressForm.country}
                      onChange={(e) => setField('country', e.target.value)}
                      autoComplete="country-name"
                    />
                  </div>
                )}

                <div className="flex justify-end mt-8">
                  <Button
                    size="lg"
                    onClick={() => {
                      if (showAddressForm && !validateAddressForm()) return;
                      if (!showAddressForm && !selectedAddressId) {
                        toastError('Select an address', 'Choose a saved address or add a new one.');
                        return;
                      }
                      setCurrentStep(1);
                    }}
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <Card padding="lg">
                <h2 className="heading-3 mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-sage-600" />
                  Payment Method
                </h2>

                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                  {PAYMENT_METHODS.map((method) => (
                    <RadioGroupItem
                      key={method.value}
                      value={method.value}
                      label={method.label}
                      description={method.description}
                      icon={method.icon}
                    />
                  ))}
                </RadioGroup>

                {paymentMethod === 'CARD' && (
                  <p className="mt-4 p-3 bg-sabai-50 border border-sabai-200 rounded-lg text-caption text-olive-700">
                    You will be redirected to a secure payment gateway to complete your card payment after placing the order.
                  </p>
                )}
                {paymentMethod === 'UPI' && (
                  <p className="mt-4 p-3 bg-sabai-50 border border-sabai-200 rounded-lg text-caption text-olive-700">
                    You will receive a payment request on your UPI app after placing the order.
                  </p>
                )}
                {paymentMethod === 'NETBANKING' && (
                  <p className="mt-4 p-3 bg-sabai-50 border border-sabai-200 rounded-lg text-caption text-olive-700">
                    You will be redirected to your bank's secure page after placing the order.
                  </p>
                )}

                <div className="flex justify-between mt-8">
                  <Button variant="outline" size="lg" onClick={() => setCurrentStep(0)}>
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    Back
                  </Button>
                  <Button size="lg" onClick={() => setCurrentStep(2)}>
                    Review Order
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === 2 && (
              <Card padding="lg">
                <h2 className="heading-3 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-sage-600" />
                  Review Your Order
                </h2>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-olive-900 text-body-sm mb-2">Shipping Address</h3>
                      {selectedAddress ? (
                        <address className="not-italic text-olive-600 text-body-sm leading-relaxed">
                          {selectedAddress.name}
                          <br />
                          {selectedAddress.addressLine1}
                          {selectedAddress.addressLine2 && (
                            <>
                              <br />
                              {selectedAddress.addressLine2}
                            </>
                          )}
                          <br />
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                          <br />
                          {selectedAddress.phone}
                        </address>
                      ) : (
                        <address className="not-italic text-olive-600 text-body-sm leading-relaxed">
                          {addressForm.name}
                          <br />
                          {addressForm.addressLine1}
                          {addressForm.addressLine2 && (
                            <>
                              <br />
                              {addressForm.addressLine2}
                            </>
                          )}
                          <br />
                          {addressForm.city}, {addressForm.state} {addressForm.postalCode}
                          <br />
                          {addressForm.phone}
                        </address>
                      )}
                      <Button variant="ghost" size="sm" className="mt-2 px-0 text-sage-600 hover:text-sage-700" onClick={() => setCurrentStep(0)}>
                        Edit
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-medium text-olive-900 text-body-sm mb-2">Payment Method</h3>
                      <p className="text-olive-600 text-body-sm">{paymentMethodLabel(paymentMethod)}</p>
                      <Button variant="ghost" size="sm" className="mt-2 px-0 text-sage-600 hover:text-sage-700" onClick={() => setCurrentStep(1)}>
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-olive-900 text-body-sm mb-3">Order Items</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {cart!.items.map((item) => (
                        <div key={item.id} className="flex justify-between gap-4 text-body-sm py-2 border-b border-olive-100 last:border-b-0">
                          <span className="text-olive-600 truncate">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="font-medium text-olive-900 flex-shrink-0">
                            {formatPrice(item.variant.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                  <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)} disabled={isProcessing}>
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePlaceOrder}
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Placing order…' : 'Place Order'}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order summary */}
          <Card className="sticky top-24" padding="lg" aria-label="Order summary">
            <h2 className="heading-3 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
              {cart!.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product.images[0]?.url}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-olive-50"
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
                <span className="font-medium text-olive-900 flex items-center gap-1">
                  {shipping === 0 ? (
                    <>
                      <Truck className="w-4 h-4 text-sage-600" /> Free
                    </>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-olive-600">Tax (18% GST)</span>
                <span className="font-medium text-olive-900">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-heading-sm font-display font-medium text-olive-950 pt-3 border-t border-olive-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mt-4 p-3 bg-sabai-50 rounded-lg border border-sabai-200">
                <p className="text-caption text-olive-700 flex items-center gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  Add {formatPrice(200000 - subtotal)} more for free shipping
                </p>
                <div className="mt-2 h-1.5 bg-olive-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sabai-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / 200000) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <p className="caption text-olive-500 mt-4 flex items-center justify-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Signed in as {user?.email}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
