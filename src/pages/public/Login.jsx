import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { fakeApi } from '../../api/fakeApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const canvasRef = useRef(null);

  const testAccounts = [
    { email: 'admin@pledge.com', password: 'admin123', role: 'Admin' },
    { email: 'sarah.cm@pledge.com', password: 'cm123', role: 'Country Manager' },
    { email: 'mike.commercial@pledge.com', password: 'commercial123', role: 'Commercial' },
    { email: 'alice.dist@pledge.com', password: 'dist123', role: 'Distributor' },
    { email: 'bob.shop@pledge.com', password: 'shop123', role: 'Shop' },
  ];

  // Animated Dots Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 50;
    const maxDistance = 120;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = 'rgba(0, 156, 234, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(0, 156, 234, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const { user, token } = await fakeApi.auth.login(email, password);
    login(user, token);
    
    // Convert role to URL path (remove spaces, lowercase)
    const roleRoute = `/${user.role.toLowerCase().replace(/\s+/g, '')}/dashboard`;
    navigate(roleRoute);
  } catch (err) {
    setError(err.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  const quickLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      <div className="w-full max-w-6xl flex bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden relative z-10">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 p-12 bg-white">
          <div className="max-w-md mx-auto">
            {/* Logo - Blue Water Droplet */}
            <div className="flex items-center justify-center mb-6">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 5C30 5 15 20 15 32C15 40.284 21.716 47 30 47C38.284 47 45 40.284 45 32C45 20 30 5 30 5Z" fill="#0009CEA"/>
                <path d="M30 15C30 15 22 25 22 32C22 36.418 25.582 40 30 40C34.418 40 38 36.418 38 32C38 25 30 15 30 15Z" fill="#4FC3F7"/>
                <circle cx="26" cy="28" r="3" fill="white" opacity="0.6"/>
              </svg>
            </div>

            {/* Title with Gradient Text */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold font-nunito mb-3 gradient-title">
                Login to gaz order
              </h1>
              <p className="text-sm text-gray-600 font-roboto">Sign in to your Pledge account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg font-roboto text-sm">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-roboto text-sm bg-white text-gray-900"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-roboto text-sm bg-white text-gray-900"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-600" />
                  <span className="ml-2 text-gray-600 font-roboto">Remember me</span>
                </label>
                <a href="#" className="text-red-600 hover:text-red-700 font-roboto font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all flex items-center justify-center"
                style={{ height: '46px', borderRadius: '25px' }}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right side - Test Accounts */}
        <div className="hidden lg:block w-1/2 bg-gray-50 p-12">
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 font-nunito mb-2">Quick Access</h2>
            <p className="text-gray-600 text-sm mb-6 font-roboto">
              Click on any account to auto-fill credentials
            </p>

            <div className="space-y-3">
              {testAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => quickLogin(account)}
                  className="w-full text-left bg-white hover:bg-gray-100 border border-gray-200 p-4 rounded-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 font-nunito text-sm">{account.role}</p>
                      <p className="text-xs text-gray-500 font-roboto mt-1">{account.email}</p>
                    </div>
                    <div className="text-xs bg-red-50 text-red-600 px-3 py-1 font-roboto font-medium" style={{ borderRadius: '25px' }}>
                      Try it
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-roboto">
                <strong className="font-nunito text-gray-900">Demo Mode:</strong> This is a demonstration portal. Use any password with the accounts above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
