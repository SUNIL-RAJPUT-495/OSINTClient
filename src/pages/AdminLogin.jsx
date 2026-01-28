import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from "../common/SummeryApi";

import { Eye, EyeOff, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

export const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await Axios({
          url: SummaryApi.CreateUser.url,
          method: SummaryApi.CreateUser.method,
          data: { ...formData, role: 'admin' }
        });

        if (res.data.success) {
          setSuccess("Account created! Redirecting to login...");
          setTimeout(() => {
            setIsSignUp(false);
            setSuccess('');
            setFormData(prev => ({ ...prev, password: '' }));
          }, 1500);
        }

      } else {
        const res = await Axios({
          url: SummaryApi.verifyUser.url,
          method: SummaryApi.verifyUser.method,
          data: {
            email: formData.email,
            password: formData.password,
            role: "admin"
          }
        });


        if (res.data.success && res.data.token) {
          localStorage.clear();

          localStorage.setItem('access_token', res.data.token);
          localStorage.setItem('user_data', JSON.stringify({
            email: formData.email,
            role: "admin"
          }));
          setSuccess("Access Granted. Initializing...");

         setTimeout(() => {
        navigate("/admin"); 
    }, 1000)
        } else {

          setError("Login Failed: No Token Received from Server");
          setIsLoading(false);
        }
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Connection Error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen matrix-bg flex items-center justify-center p-4">
      <div className="terminal-card max-w-md w-full">
        {/* Header */}
        <div className="border-b border-border p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-display text-2xl text-destructive">RESTRICTED ACCESS</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Admin authentication required
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">FULL NAME</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="flag-input"
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">MOBILE NUMBER</label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange('mobileNumber', e.target.value)}
                  className="flag-input"
                  placeholder="+1234567890"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs text-muted-foreground block mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="flag-input"
              placeholder="agent@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="flag-input pr-10"
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>



          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded border border-destructive/30">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-success text-sm p-3 bg-success/10 rounded border border-success/30">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-terminal-filled w-full">
            {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            Unauthorized access attempts will be logged
          </p>
        </div>
      </div>
    </div>
  );
};