import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  Star,
  X,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { api } from '@services/api';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Modal } from '@components/ui/Modal';
import { Skeleton } from '@components/ui/Skeleton';
import { useToastHelpers } from '@components/ui/Toast';
import { cn } from '@utils/cn';
import type { Address, Order } from '@app-types';

type AccountTab = 'profile' | 'addresses';

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

export function AccountPage() {
  const { user, logout, updateUser, isAuthenticated } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { success, error: toastError } = useToastHelpers();
  const navigate = useNavigate();

  const [tab, setTab] = useState<AccountTab>('profile');

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);

  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const loadAddresses = useCallback(async () => {
    try {
      const response = await api.getAddresses();
      setAddresses(response.data ?? []);
    } catch {
      setAddresses([]);
    }
  }, []);

  useEffect(() => {
    document.title = 'My Account | SabaiCraft';
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    setProfileForm({ name: user?.name ?? '', phone: user?.phone ?? '' });
    api
      .getOrders({ limit: 50 })
      .then((response) => setOrders(response.data ?? []))
      .catch(() => setOrders([]));
    loadAddresses();
  }, [isAuthenticated, user?.name, user?.phone, loadAddresses]);

  const handleLogout = async () => {
    await logout();
    useCartStore.getState().disableBackendSync();
    useWishlistStore.getState().disableBackendSync();
    success('Logged out', 'You have been successfully logged out');
    navigate('/');
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!profileForm.name.trim()) errors.name = 'Name is required';
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSavingProfile(true);
    try {
      await api.updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim() || undefined,
      });
      updateUser({ name: profileForm.name.trim(), phone: profileForm.phone.trim() });
      success('Profile updated', 'Your details have been saved.');
    } catch (err) {
      toastError('Update failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!passwordForm.current) errors.current = 'Current password is required';
    if (!passwordForm.next) errors.next = 'New password is required';
    else if (passwordForm.next.length < 8) errors.next = 'Password must be at least 8 characters';
    if (passwordForm.next !== passwordForm.confirm) errors.confirm = 'Passwords do not match';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSavingPassword(true);
    try {
      await api.changePassword(passwordForm.current, passwordForm.next);
      setPasswordForm({ current: '', next: '', confirm: '' });
      success('Password changed', 'Your password has been updated.');
    } catch (err) {
      toastError('Password change failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const openAddressModal = (address?: Address) => {
    setEditingAddress(address ?? null);
    setAddressForm(
      address
        ? {
            name: address.name,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 ?? '',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          }
        : emptyAddressForm
    );
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!addressForm.name.trim()) errors.name = 'Full name is required';
    if (!addressForm.phone.trim()) errors.phone = 'Phone is required';
    if (!addressForm.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.state.trim()) errors.state = 'State is required';
    if (!/^\d{6}$/.test(addressForm.postalCode.trim())) errors.postalCode = 'Enter a valid 6-digit PIN code';
    setAddressErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSavingAddress(true);
    try {
      const payload = {
        name: addressForm.name.trim(),
        phone: addressForm.phone.trim(),
        addressLine1: addressForm.addressLine1.trim(),
        addressLine2: addressForm.addressLine2.trim() || undefined,
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        postalCode: addressForm.postalCode.trim(),
        country: addressForm.country,
      };
      if (editingAddress) {
        await api.updateAddress(editingAddress.id, payload);
      } else {
        await api.createAddress(payload);
      }
      await loadAddresses();
      setIsAddressModalOpen(false);
      success(editingAddress ? 'Address updated' : 'Address added');
    } catch (err) {
      toastError('Could not save address', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleAddressDelete = async (address: Address) => {
    try {
      await api.deleteAddress(address.id);
      await loadAddresses();
      success('Address removed');
    } catch (err) {
      toastError('Could not remove address', err instanceof Error ? err.message : 'Please try again.');
    }
  };

  const handleSetDefaultAddress = async (address: Address) => {
    try {
      await api.updateAddress(address.id, { isDefault: true });
      await loadAddresses();
    } catch (err) {
      toastError('Could not update address', err instanceof Error ? err.message : 'Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <User className="w-20 h-20 mx-auto text-olive-200" aria-hidden="true" />
            <h1 className="heading-1">Welcome to SabaiCraft</h1>
            <p className="text-olive-600 text-body-lg">
              Sign in to access your orders, wishlist, and personalized experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="primary" size="lg">
                <Link to="/login?redirect=/account">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register?redirect=/account">Create Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const totalOrders = orders?.length ?? 0;
  const totalSpent = (orders ?? [])
    .filter((o) => !['CANCELLED', 'REFUNDED'].includes(String(o.status).toUpperCase()))
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-1">My Account</h1>
              <p className="text-olive-600 text-body-lg mt-1">Manage your profile and preferences</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 lg:sticky lg:top-24"
          >
            <Card className="space-y-1" padding="none">
              <div className="p-6 border-b border-olive-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-sage-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-medium text-olive-950 text-heading-md truncate">{user?.name}</p>
                    <p className="text-olive-500 text-body-sm truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2" aria-label="Account navigation">
                <button
                  type="button"
                  onClick={() => setTab('profile')}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
                    tab === 'profile' ? 'bg-sage-50 text-olive-950' : 'text-olive-600 hover:bg-olive-50 hover:text-olive-900'
                  )}
                  aria-current={tab === 'profile' ? 'page' : undefined}
                >
                  <Pencil className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium text-body-sm">Profile & Security</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('addresses')}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
                    tab === 'addresses' ? 'bg-sage-50 text-olive-950' : 'text-olive-600 hover:bg-olive-50 hover:text-olive-900'
                  )}
                  aria-current={tab === 'addresses' ? 'page' : undefined}
                >
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium text-body-sm">Addresses</span>
                </button>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-olive-600 hover:bg-olive-50 hover:text-olive-900 transition-colors"
                >
                  <Package className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium text-body-sm">My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-olive-600 hover:bg-olive-50 hover:text-olive-900 transition-colors"
                >
                  <Heart className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium text-body-sm">Wishlist</span>
                </Link>
              </nav>

              <div className="p-4 border-t border-olive-100">
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                  Logout
                </Button>
              </div>
            </Card>
          </motion.aside>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">{totalOrders}</p>
                <p className="caption text-olive-500 mt-1">Total Orders</p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">
                  {totalSpent > 0 ? `₹${Math.round(totalSpent / 100).toLocaleString('en-IN')}` : '₹0'}
                </p>
                <p className="caption text-olive-500 mt-1">Total Spent</p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">{wishlistCount}</p>
                <p className="caption text-olive-500 mt-1">Wishlist Items</p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">{addresses?.length ?? '—'}</p>
                <p className="caption text-olive-500 mt-1">Saved Addresses</p>
              </Card>
            </div>

            {tab === 'profile' && (
              <>
                <Card padding="lg">
                  <h2 className="heading-3 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileSave} className="space-y-4" noValidate>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                        error={profileErrors.name}
                        autoComplete="name"
                        required
                      />
                      <Input
                        label="Email"
                        value={user?.email ?? ''}
                        disabled
                        hint="Email cannot be changed"
                      />
                    </div>
                    <Input
                      label="Phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                    />
                    <div className="flex items-center gap-3">
                      <Button type="submit" isLoading={isSavingProfile} disabled={isSavingProfile}>
                        Save Changes
                      </Button>
                      <span className="caption text-olive-500">
                        Member since{' '}
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                          : '—'}
                      </span>
                    </div>
                  </form>
                </Card>

                <Card padding="lg">
                  <h2 className="heading-3 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordSave} className="space-y-4" noValidate>
                    <Input
                      label="Current Password"
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                      error={passwordErrors.current}
                      autoComplete="current-password"
                      required
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="New Password"
                        type="password"
                        value={passwordForm.next}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
                        error={passwordErrors.next}
                        autoComplete="new-password"
                        hint="At least 8 characters"
                        required
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                        error={passwordErrors.confirm}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <Button type="submit" variant="secondary" isLoading={isSavingPassword} disabled={isSavingPassword}>
                      Update Password
                    </Button>
                  </form>
                </Card>
              </>
            )}

            {tab === 'addresses' && (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-3">Saved Addresses</h2>
                  <Button variant="primary" size="sm" onClick={() => openAddressModal()}>
                    <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                    Add Address
                  </Button>
                </div>

                {addresses === null ? (
                  <div className="space-y-3">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-10">
                    <MapPin className="w-12 h-12 mx-auto text-olive-200 mb-3" aria-hidden="true" />
                    <p className="text-olive-600 text-body-sm mb-4">
                      No saved addresses yet. Add one for faster checkout.
                    </p>
                    <Button variant="outline" onClick={() => openAddressModal()}>
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={cn(
                          'relative p-4 rounded-xl border-2',
                          address.isDefault ? 'border-sage-600 bg-sage-50' : 'border-olive-200'
                        )}
                      >
                        {address.isDefault && (
                          <span className="absolute top-3 right-3 badge bg-sage-600 text-cream-50 text-[10px] gap-1">
                            <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                            Default
                          </span>
                        )}
                        <p className="font-medium text-olive-900 text-body-sm pr-16">{address.name}</p>
                        <address className="not-italic text-olive-600 text-body-sm mt-1 leading-relaxed">
                          {address.addressLine1}
                          {address.addressLine2 && <>, {address.addressLine2}</>}
                          <br />
                          {address.city}, {address.state} {address.postalCode}
                          <br />
                          {address.phone}
                        </address>
                        <div className="flex items-center gap-1 mt-3">
                          <Button variant="ghost" size="xs" onClick={() => openAddressModal(address)}>
                            <Pencil className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                            Edit
                          </Button>
                          {!address.isDefault && (
                            <>
                              <Button variant="ghost" size="xs" onClick={() => handleSetDefaultAddress(address)}>
                                <Star className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                                Set Default
                              </Button>
                              <Button
                                variant="ghost"
                                size="xs"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleAddressDelete(address)}
                                aria-label={`Delete ${address.name}'s address`}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Address modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddress ? 'Edit Address' : 'Add Address'}
        size="md"
      >
        <form onSubmit={handleAddressSave} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            value={addressForm.name}
            onChange={(e) => setAddressForm((p) => ({ ...p, name: e.target.value }))}
            error={addressErrors.name}
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={addressForm.phone}
            onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))}
            error={addressErrors.phone}
            required
          />
          <Input
            label="Address Line 1"
            value={addressForm.addressLine1}
            onChange={(e) => setAddressForm((p) => ({ ...p, addressLine1: e.target.value }))}
            error={addressErrors.addressLine1}
            placeholder="House/Flat No, Building, Street"
            required
          />
          <Input
            label="Address Line 2 (Optional)"
            value={addressForm.addressLine2}
            onChange={(e) => setAddressForm((p) => ({ ...p, addressLine2: e.target.value }))}
            placeholder="Landmark, Area"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="City"
              value={addressForm.city}
              onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
              error={addressErrors.city}
              required
            />
            <Input
              label="State"
              value={addressForm.state}
              onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
              error={addressErrors.state}
              required
            />
            <Input
              label="PIN Code"
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value.replace(/\D/g, '') }))}
              error={addressErrors.postalCode}
              inputMode="numeric"
              maxLength={6}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsAddressModalOpen(false)} disabled={isSavingAddress}>
              <X className="w-4 h-4 mr-1" aria-hidden="true" />
              Cancel
            </Button>
            <Button type="submit" isLoading={isSavingAddress} disabled={isSavingAddress}>
              {editingAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
