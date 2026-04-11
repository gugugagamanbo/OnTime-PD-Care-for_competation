import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import CtaButton from './CtaButton';

interface LoginScreenProps {
  onContinue: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onContinue }) => {
  const { t, lang, setLang } = useI18n();
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (phone.length >= 8) {
      setCodeSent(true);
      setCountdown(60);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const otpFilled = otp.every(d => d !== '');

  return (
    <div className="min-h-screen flex justify-center" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="w-full max-w-[390px] min-h-screen flex flex-col px-5">
        {/* Language Switcher */}
        <div className="flex justify-end pt-4">
          <div className="flex rounded-full overflow-hidden border" style={{ borderColor: '#E0E0E0' }}>
            <button
              onClick={() => setLang('zh')}
              className="px-3 py-1 text-xs font-heading font-bold transition-colors"
              style={{
                backgroundColor: lang === 'zh' ? '#2D6A4F' : 'white',
                color: lang === 'zh' ? 'white' : '#1A1A1A',
              }}
            >
              中文
            </button>
            <button
              onClick={() => setLang('en')}
              className="px-3 py-1 text-xs font-heading font-bold transition-colors"
              style={{
                backgroundColor: lang === 'en' ? '#2D6A4F' : 'white',
                color: lang === 'en' ? 'white' : '#1A1A1A',
              }}
            >
              EN
            </button>
          </div>
        </div>

        {/* Top space */}
        <div className="flex-1 max-h-[20vh]" />

        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: '#2D6A4F' }}>
            🌿
          </div>
          <h1 className="font-heading font-bold text-2xl mt-4" style={{ color: '#1A1A1A' }}>
            {t('appName')}
          </h1>
          <p className="text-sm mt-2 text-center" style={{ color: '#6B7280' }}>
            {t('tagline')}
          </p>
        </div>

        <div className="h-8" />

        {/* Phone input */}
        <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: '#E0E0E0' }}>
          <div className="flex items-center px-3 border-r" style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}>
            <span className="text-sm whitespace-nowrap">🇨🇳 +86</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder={lang === 'zh' ? '手机号码' : 'Phone number'}
            className="flex-1 px-3 py-3.5 text-sm outline-none bg-transparent"
            style={{ color: '#1A1A1A' }}
          />
        </div>

        <div className="h-4" />

        {/* Get Code button */}
        <button
          onClick={handleSendCode}
          disabled={phone.length < 8 || countdown > 0}
          className="w-full h-12 rounded-full font-heading font-bold text-sm transition-colors disabled:opacity-50"
          style={{
            backgroundColor: phone.length >= 8 ? '#4CAF50' : '#E0E0E0',
            color: phone.length >= 8 ? 'white' : '#9E9E9E',
          }}
        >
          {t('getCode')}
        </button>

        {/* OTP */}
        {codeSent && (
          <>
            <div className="h-4" />
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-bold rounded-lg border outline-none focus:border-2"
                  style={{ borderColor: digit ? '#2D6A4F' : '#E0E0E0', color: '#1A1A1A', backgroundColor: 'white' }}
                />
              ))}
            </div>
            <p className="text-xs text-center mt-2" style={{ color: '#6B7280' }}>
              {countdown > 0
                ? `${countdown}${t('resendIn')}`
                : (lang === 'zh' ? '重新发送验证码' : 'Resend code')}
            </p>
          </>
        )}

        <div className="h-6" />

        <CtaButton
          label={t('login')}
          onClick={onContinue}
          color="#2D6A4F"
          textColor="white"
          disabled={!otpFilled && codeSent}
        />

        <p className="text-xs text-center mt-6" style={{ color: '#6B7280' }}>
          {t('loginDisclaimer')}
        </p>

        <div className="flex-1" />
      </div>
    </div>
  );
};

export default LoginScreen;
