import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pill, Mail, Phone, ChevronDown, Eye, EyeOff } from 'lucide-react';

const countryCodes = [
  { code: '+86', flag: '🇨🇳', label: '中国大陆', maxLen: 11 },
  { code: '+852', flag: '🇭🇰', label: '香港', maxLen: 8 },
  { code: '+853', flag: '🇲🇴', label: '澳门', maxLen: 8 },
  { code: '+886', flag: '🇹🇼', label: '台湾', maxLen: 10 },
  { code: '+1', flag: '🇺🇸', label: '美国/加拿大', maxLen: 10 },
  { code: '+44', flag: '🇬🇧', label: '英国', maxLen: 10 },
  { code: '+81', flag: '🇯🇵', label: '日本', maxLen: 11 },
  { code: '+82', flag: '🇰🇷', label: '韩国', maxLen: 11 },
  { code: '+65', flag: '🇸🇬', label: '新加坡', maxLen: 8 },
  { code: '+61', flag: '🇦🇺', label: '澳大利亚', maxLen: 9 },
];

type AuthMode = 'email' | 'phone';
type EmailStep = 'login' | 'signup';

const Auth = () => {
  const { signInWithPhone, verifyOtp, signUpWithEmail, signInWithEmail, enterGuestMode } = useAuth();

  // Mode toggle
  const [mode, setMode] = useState<AuthMode>('email');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailStep, setEmailStep] = useState<EmailStep>('login');

  // Phone state
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [countdown, setCountdown] = useState(0);

  // Shared
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fullPhone = `${selectedCountry.code}${phone.replace(/\D/g, '')}`;

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // --- Email handlers ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码');
      return;
    }

    // Guest bypass
    if (email === 'guest@demo.com' && password === '676767') {
      enterGuestMode();
      return;
    }

    setLoading(true);
    if (emailStep === 'login') {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
    } else {
      if (password.length < 6) {
        setError('密码至少6位');
        setLoading(false);
        return;
      }
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg('注册成功！请查收验证邮件后登录。');
        setEmailStep('login');
      }
    }
    setLoading(false);
  };

  // --- Phone handlers ---
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 6 || digits.length > selectedCountry.maxLen) {
      setError(`请输入${selectedCountry.maxLen}位手机号`);
      return;
    }
    setLoading(true);
    const { error } = await signInWithPhone(fullPhone);
    setLoading(false);
    if (error) setError(error.message);
    else { setPhoneStep('otp'); startCountdown(); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp)) { setError('请输入6位数字验证码'); return; }
    setLoading(true);
    const { error } = await verifyOtp(fullPhone, otp);
    setLoading(false);
    if (error) setError(error.message);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setLoading(true);
    const { error } = await signInWithPhone(fullPhone);
    setLoading(false);
    if (error) setError(error.message);
    else startCountdown();
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[390px] px-5 pt-16 pb-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Pill size={28} className="text-gray-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OnTime PD Care</h1>
          <p className="text-sm text-gray-500 mt-1">帕金森照护助手</p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode('email'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-colors ${
              mode === 'email' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <Mail size={15} /> 邮箱登录
          </button>
          <button
            onClick={() => { setMode('phone'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-colors ${
              mode === 'phone' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <Phone size={15} /> 手机号登录
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          {mode === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  {emailStep === 'login' ? '邮箱登录' : '注册新账号'}
                </h2>
                <p className="text-xs text-gray-500">
                  {emailStep === 'login' ? '使用邮箱和密码登录' : '创建新账号，注册后需验证邮箱'}
                </p>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-gray-500">邮箱</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-gray-500">密码</span>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={emailStep === 'signup' ? '至少6位' : '输入密码'}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {successMsg && <p className="text-xs text-green-600">{successMsg}</p>}
              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {loading ? '处理中...' : emailStep === 'login' ? '登录' : '注册'}
              </button>

              <button
                type="button"
                onClick={() => { setEmailStep(emailStep === 'login' ? 'signup' : 'login'); setError(''); setSuccessMsg(''); }}
                className="w-full text-xs text-gray-500 text-center"
              >
                {emailStep === 'login' ? '没有账号？注册' : '已有账号？登录'}
              </button>
            </form>
          ) : phoneStep === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-1">手机号登录 / 注册</h2>
                <p className="text-xs text-gray-500">首次使用将自动创建账号</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">手机号</span>
                <div className="mt-1 flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="flex items-center gap-1 h-[42px] px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 whitespace-nowrap"
                    >
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.code}</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {showCountryPicker && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                        {countryCodes.map(c => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 ${c.code === selectedCountry.code ? 'bg-gray-50 font-semibold' : ''}`}
                          >
                            <span>{c.flag}</span>
                            <span className="flex-1 text-left text-gray-900">{c.label}</span>
                            <span className="text-gray-400">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxLen))}
                    placeholder="请输入手机号"
                    maxLength={selectedCountry.maxLen}
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {loading ? '发送中...' : '获取验证码'}
              </button>
              <p className="text-xs text-amber-600 text-center">⚠️ 手机验证码登录需要配置 SMS 服务</p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-1">输入验证码</h2>
                <p className="text-xs text-gray-500">验证码已发送至 {selectedCountry.code} {phone}</p>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-gray-500">6位验证码</span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 text-center text-lg tracking-[0.5em] placeholder:text-gray-400 placeholder:tracking-[0.5em] focus:outline-none focus:border-gray-400"
                />
              </label>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {loading ? '验证中...' : '验证并登录'}
              </button>
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => { setPhoneStep('phone'); setOtp(''); setError(''); }} className="text-xs text-gray-500">更换手机号</button>
                <button type="button" onClick={handleResend} disabled={countdown > 0} className="text-xs text-gray-900 font-medium disabled:text-gray-400">
                  {countdown > 0 ? `${countdown}s 后重发` : '重新发送'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={enterGuestMode}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 text-center"
            >
              先参观一下（访客模式）
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
            患者和家属可以共用一个账号，共同管理用药和照护信息。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
