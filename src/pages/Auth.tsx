import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pill } from 'lucide-react';

const Auth = () => {
  const { signInWithPhone, verifyOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!/^\+?\d{10,15}$/.test(cleaned)) {
      setError('请输入有效的手机号（含国际区号，如 +8613800138000）');
      return;
    }

    setLoading(true);
    const { error } = await signInWithPhone(cleaned);
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

    const cleaned = phone.replace(/[^\d+]/g, '');
    setLoading(true);
    const { error } = await verifyOtp(cleaned, otp);
    setLoading(false);

    if (error) setError(error.message);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    const cleaned = phone.replace(/[^\d+]/g, '');
    setLoading(true);
    const { error } = await signInWithPhone(cleaned);
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
              <label className="block">
                <span className="text-xs font-medium text-gray-500">手机号</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+8613800138000"
                  maxLength={20}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </label>
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
                <p className="text-xs text-gray-500">验证码已发送至 {phone}</p>
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
