import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { TerminalHeader } from "../component/TerminalHeader";
import Axios from '../utils/Axios';
import SummaryApi from "../common/SummeryApi"; 

export const AuthPage = () => {
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
    accessCode: '', 
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
        // ------------------ REGISTER LOGIC ------------------
        const res = await Axios({
          url: SummaryApi.CreateUser.url,
          method: SummaryApi.CreateUser.method,
          data: { ...formData, role: 'customer' }
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
        // ------------------ LOGIN LOGIC ------------------
        const res = await Axios({
            url: SummaryApi.verifyUser.url, 
            method: SummaryApi.verifyUser.method,
            data: { 
                email: formData.email, 
                password: formData.password,
                accessCode: formData.accessCode
            }
        });

        
        if (res.data.success && res.data.token) {
           
          
           localStorage.setItem('access_token', String(res.data.token));
           
           setSuccess("Access Granted. Initializing...");
           
           setTimeout(() => {
             navigate("/rooms");
           }, 1000);
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
    <div className="min-h-screen matrix-bg flex flex-col">
      <TerminalHeader />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="terminal-card overflow-hidden">
            {/* Header */}
            <div className="border-b border-border p-6 bg-muted/30 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl mb-2">
                {isSignUp ? 'CREATE ACCOUNT' : 'ACCESS PORTAL'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isSignUp ? 'Register to begin your OSINT training' : 'Enter your credentials to continue'}
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

              <div>
                <label className="text-xs text-muted-foreground block mb-1">ACCESS CODE</label>
                <input
                  type="text"
                  value={formData.accessCode}
                  onChange={(e) => handleChange('accessCode', e.target.value)}
                  className="flag-input"
                  placeholder="Enter access code"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">Contact your administrator for access</p>
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
          </div>

          <div className="mt-6 p-4 bg-muted/20 border border-border rounded text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This platform uses fictional identities for educational purposes only.
              No real individuals or accounts are targeted.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};