import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pill } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) setError(error.message);
      else setMessage('注册成功！请检查邮箱确认链接。');
    }
    setLoading(false);
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
          <div className="flex mb-5">
            <button
              onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl ${isLogin ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
            >
              登录
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl ${!isLogin ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <label className="block">
                <span className="text-xs font-medium text-gray-500">显示名称</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="例如：周慧兰与家人"
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
              </label>
            )}
            <label className="block">
              <span className="text-xs font-medium text-gray-500">邮箱</span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500">密码</span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                minLength={6}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
              />
            </label>

            {error && <p className="text-xs text-red-600">{error}</p>}
            {message && <p className="text-xs text-green-600">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {loading ? '请稍候...' : isLogin ? '登录' : '注册'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
            患者和家属可以共用一个账号，共同管理用药和照护信息。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
