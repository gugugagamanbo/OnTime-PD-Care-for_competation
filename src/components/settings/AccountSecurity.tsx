import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
  onBack: () => void;
}

const AccountSecurity = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [toast, setToast] = useState('');
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleGetCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
  };

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [countdown]);

  const handleVerify = () => {
    showToast(t('settings.security.verified'));
    setShowChangePhone(false);
    setPhone('');
    setCode('');
  };

  return (
    <div className="px-5 pt-6 pb-28 space-y-4">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t('settings.security.title')}</h1>
      </div>

      {/* Bound Phone */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('settings.security.boundPhone')}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">021-5555-0197</span>
          <button
            onClick={() => setShowChangePhone(!showChangePhone)}
            className="text-xs text-gray-900 font-medium border border-gray-200 rounded-lg px-3 py-1"
          >
            {t('settings.security.changePhone')}
          </button>
        </div>

        {showChangePhone && (
          <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('settings.security.changePhone')}</p>
              <Input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="请输入新手机号"
                className="text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={t('settings.security.inputCode')}
                className="text-sm flex-1"
                maxLength={6}
              />
              <button
                onClick={handleGetCode}
                disabled={countdown > 0}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium whitespace-nowrap disabled:opacity-40"
              >
                {countdown > 0 ? `${countdown}s` : t('settings.security.getCode')}
              </button>
            </div>

            <button
              onClick={handleVerify}
              disabled={!phone || !code}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-40"
            >
              {t('settings.security.verifyAndSave')}
            </button>
          </div>
        )}
      </div>

      {/* Device Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('settings.security.deviceInfo')}</h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Smartphone size={20} className="text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">{t('settings.security.currentDevice')}</p>
            <p className="text-xs text-gray-500">演示手机 · iOS Demo</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('settings.security.lastLogin')}：2026-04-12 08:30</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="w-full py-2.5 border border-red-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
            {t('settings.security.logout')}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.security.logout')}</AlertDialogTitle>
            <AlertDialogDescription>{t('settings.security.logoutConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('settings.privacy.cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              {t('settings.security.logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountSecurity;
