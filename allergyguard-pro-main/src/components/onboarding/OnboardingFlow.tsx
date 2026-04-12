import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

/**
 * Legacy-safe onboarding shell.
 *
 * The current app enters the main Parkinson care experience directly from
 * `src/pages/Index.tsx`, so this component is not part of the active flow.
 * Keep it small and Parkinson-specific in case onboarding is re-enabled later.
 */
const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[390px] px-5 pt-10 pb-8 flex flex-col">
        <div className="flex-1 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
            PD
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">帕金森照护助手</h1>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              患者和家人共同使用一个账号，管理用药提醒、症状记录、Apple Watch 数据和就诊信息。
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-gray-500">手机号</span>
              <input
                value={phone}
                onChange={event => setPhone(event.target.value)}
                placeholder="输入共同账号手机号"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </label>

            <button
              onClick={() => setCodeSent(true)}
              className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800"
            >
              {codeSent ? '验证码已发送' : '获取验证码'}
            </button>

            <p className="text-xs text-gray-500 leading-relaxed">
              医生和药剂师不会拥有独立端口；报告只会在患者或家属主动导出、复制或就诊时展示。
            </p>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold"
        >
          进入应用
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
