import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, Pill } from 'lucide-react';

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

const Auth = () => {
  const { signInWithPhone, verifyOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

    if (error) {
      setError(error.message);
    } else {
      setStep('otp');
      startCountdown();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('请输入6位数字验证码');
      return;
    }

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
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Pill size={28} className="text-gray-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OnTime PD Care</h1>
          <p className="text-sm text-gray-500 mt-1">帕金森照护助手</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          {step === 'phone' ? (
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
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {loading ? '验证中...' : '验证并登录'}
              </button>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                  className="text-xs text-gray-500"
                >
                  更换手机号
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className="text-xs text-gray-900 font-medium disabled:text-gray-400"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '重新发送'}
                </button>
              </div>
            </form>
          )}

          <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
            患者和家属可以共用一个账号，共同管理用药和照护信息。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
