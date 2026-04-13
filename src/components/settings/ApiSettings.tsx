import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Check, Cpu, Camera, FileText, Activity } from 'lucide-react';

interface Props {
  onBack: () => void;
}

interface ApiConfig {
  provider: 'openai' | 'gemini' | 'custom';
  apiKey: string;
  baseUrl: string;
  model: string;
}

const providerDefaults: Record<string, { baseUrl: string; model: string; label: string }> = {
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o', label: 'OpenAI' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-2.5-flash', label: 'Google Gemini' },
  custom: { baseUrl: '', model: '', label: '自定义' },
};

const aiFeatures = [
  { icon: Camera, label: '处方扫描识别', desc: '拍照后 AI 提取药物名称、剂量和服药时间' },
  { icon: FileText, label: '近期报告 / 就诊信息', desc: 'AI 总结用药依从性、症状趋势和照护者状态' },
  { icon: Activity, label: 'Apple Watch 数据分析', desc: 'AI 解读震颤、步态、睡眠等趋势变化' },
];

const ApiSettings = ({ onBack }: Props) => {
  const [config, setConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('pd_care_api_config');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { provider: 'openai', apiKey: '', baseUrl: providerDefaults.openai.baseUrl, model: providerDefaults.openai.model };
  });
  const [showKey, setShowKey] = useState(false);
  const [toast, setToast] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleProviderChange = (provider: 'openai' | 'gemini' | 'custom') => {
    const defaults = providerDefaults[provider];
    setConfig(prev => ({
      ...prev,
      provider,
      baseUrl: defaults.baseUrl,
      model: defaults.model,
    }));
    setTestResult(null);
  };

  const handleSave = () => {
    localStorage.setItem('pd_care_api_config', JSON.stringify(config));
    showToast('API 配置已保存');
  };

  const handleTest = async () => {
    if (!config.apiKey.trim()) {
      showToast('请先填写 API Key');
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      // Simple connectivity test
      const isGemini = config.provider === 'gemini';
      let url: string;
      let headers: Record<string, string>;
      let body: string;

      if (isGemini) {
        url = `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;
        headers = { 'Content-Type': 'application/json' };
        body = JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] });
      } else {
        url = `${config.baseUrl}/chat/completions`;
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        };
        body = JSON.stringify({ model: config.model, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 5 });
      }

      const resp = await fetch(url, { method: 'POST', headers, body });
      if (resp.ok) {
        setTestResult('success');
        showToast('连接测试成功 ✓');
      } else {
        setTestResult('error');
        const text = await resp.text();
        showToast(`连接失败: ${resp.status}`);
        console.error('API test failed:', text);
      }
    } catch (err) {
      setTestResult('error');
      showToast('连接失败，请检查网络和配置');
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('pd_care_api_config');
    setConfig({ provider: 'openai', apiKey: '', baseUrl: providerDefaults.openai.baseUrl, model: providerDefaults.openai.model });
    setTestResult(null);
    showToast('API 配置已清除');
  };

  const maskedKey = config.apiKey
    ? config.apiKey.slice(0, 6) + '••••••••' + config.apiKey.slice(-4)
    : '';

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
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI 服务配置</h1>
          <p className="text-xs text-gray-500 mt-0.5">配置 AI 接口以启用智能功能</p>
        </div>
      </div>

      {/* AI Features overview */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">需要 AI 的功能</h3>
        <div className="space-y-3">
          {aiFeatures.map(feat => {
            const Icon = feat.icon;
            return (
              <div key={feat.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{feat.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Provider selection */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">选择服务商</h3>
        <div className="grid grid-cols-3 gap-2">
          {(['openai', 'gemini', 'custom'] as const).map(p => (
            <button
              key={p}
              onClick={() => handleProviderChange(p)}
              className={`py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                config.provider === p
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {providerDefaults[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">接口配置</h3>

        <label className="block">
          <span className="text-xs font-medium text-gray-500">API Key</span>
          <div className="mt-1 relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={e => { setConfig(prev => ({ ...prev, apiKey: e.target.value })); setTestResult(null); }}
              placeholder={config.provider === 'gemini' ? 'AIza...' : 'sk-...'}
              className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-gray-500">Base URL</span>
          <input
            value={config.baseUrl}
            onChange={e => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
            placeholder="https://api.example.com/v1"
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 font-mono"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-gray-500">模型名称</span>
          <input
            value={config.model}
            onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
            placeholder="gpt-4o / gemini-2.5-flash"
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 font-mono"
          />
        </label>

        {/* Test result indicator */}
        {testResult && (
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${
            testResult === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {testResult === 'success' ? <Check size={14} /> : <Cpu size={14} />}
            {testResult === 'success' ? '连接正常' : '连接失败，请检查配置'}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleTest}
            disabled={testing || !config.apiKey.trim()}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            {testing ? '测试中...' : '测试连接'}
          </button>
          <button
            onClick={handleSave}
            disabled={!config.apiKey.trim()}
            className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            保存配置
          </button>
        </div>
        {config.apiKey && (
          <button
            onClick={handleClear}
            className="w-full py-2.5 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm font-semibold"
          >
            清除 API 配置
          </button>
        )}
      </div>

      {/* Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-800 leading-relaxed">
          API Key 仅存储在您的设备本地，不会上传到服务器。如需在多设备间同步，请在每台设备上分别配置。
        </p>
      </div>
    </div>
  );
};

export default ApiSettings;
