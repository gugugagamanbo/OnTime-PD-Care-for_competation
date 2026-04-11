import { useState } from 'react';
import { Plus, UtensilsCrossed, X, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const initialPosts = [
  {
    id: 1,
    initials: 'SM', name: 'Sarah M.', time: { zh: '2小时前', en: '2h ago' },
    tag: '#PeanutAllergy',
    body: {
      zh: '终于找到一家认真对待过敏的拉面店！他们有完全独立的备餐区域。强烈推荐去试试',
      en: 'Finally found a ramen place in downtown that takes allergies seriously! They have a completely separate prep area. Highly recommend checking it out.',
    },
    likes: 24, comments: 8,
  },
  {
    id: 2,
    initials: 'MT', name: 'Mike T.', time: { zh: '5小时前', en: '5h ago' },
    tag: '#GlutenFree',
    body: {
      zh: '提醒：Brand X的新款燕麦棒更换了配方——现在含有小麦成分。即使是"安全"的产品也要重新扫描！',
      en: "PSA: The new granola bars from Brand X changed their recipe — now contains wheat derivatives. Always re-scan even your 'safe' products!",
    },
    likes: 67, comments: 23,
  },
  {
    id: 3,
    initials: 'EL', name: 'Emma L.', time: { zh: '1天前', en: '1d ago' },
    tag: '#DairyFree',
    body: {
      zh: '昨晚用云餐桌功能安排了家庭聚餐。6个人，4种不同的忌口——应用帮我们找到了每个人都能吃的菜。绝对的救星',
      en: 'Used the Cloud Table feature for my family dinner last night. 6 people, 4 different restrictions — the app found dishes everyone could eat. Absolute lifesaver.',
    },
    likes: 112, comments: 34,
  },
];

const tagSuggestions = ['#花生过敏', '#无麸质', '#纯素', '#无乳制品', '#贝类过敏', '#其他'];

const CommunityTab = () => {
  const { t, lang } = useLanguage();
  const filters = [t('community.all'), t('allergy.peanut'), t('allergy.dairy'), t('allergy.gluten'), t('allergy.shellfish'), t('community.other')];
  const [activeFilter, setActiveFilter] = useState(0);
  const [posts, setPosts] = useState(initialPosts);

  // Post composer state
  const [showComposer, setShowComposer] = useState(false);
  const [postBody, setPostBody] = useState('');
  const [postTag, setPostTag] = useState('');
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    if (!postBody.trim()) return;
    const newPost = {
      id: Date.now(),
      initials: 'AC',
      name: 'Alex Chen',
      time: { zh: '刚刚', en: 'Just now' },
      tag: postTag || '#过敏日记',
      body: { zh: postBody, en: postBody },
      likes: 0,
      comments: 0,
    };
    setPosts(prev => [newPost, ...prev]);
    setPostBody('');
    setPostTag('');
    setShowComposer(false);
    setPublished(true);
    setTimeout(() => setPublished(false), 2500);
  };

  // Post composer overlay
  if (showComposer) {
    return (
      <div className="px-5 pt-6 pb-28 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowComposer(false)} className="p-1">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t('community.post.title')}</h1>
        </div>

        {/* Author line */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
            AC
          </div>
          <span className="text-sm font-medium text-gray-900">Alex Chen</span>
        </div>

        {/* Body input */}
        <textarea
          value={postBody}
          onChange={e => setPostBody(e.target.value)}
          placeholder={t('community.post.placeholder')}
          autoFocus
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
        />

        {/* Tag input */}
        <div>
          <p className="text-xs text-gray-500 mb-2">选择标签</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tagSuggestions.map(tag => (
              <button
                key={tag}
                onClick={() => setPostTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  postTag === tag
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={postTag}
            onChange={e => setPostTag(e.target.value)}
            placeholder={t('community.post.tag.placeholder')}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handlePublish}
            disabled={!postBody.trim()}
            className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:opacity-40"
          >
            {t('community.post.publish')}
          </button>
          <button
            onClick={() => setShowComposer(false)}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500"
          >
            {t('community.post.cancel')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-28 space-y-5 relative">
      <h1 className="text-2xl font-bold text-gray-900">{t('community.title')}</h1>

      {/* Published toast */}
      {published && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          {t('community.post.published')}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {filters.map((f, i) => (
          <button
            key={f}
            onClick={() => setActiveFilter(i)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              i === activeFilter
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cloud Table banner — prominent identifier with icon */}
      <div className="border-2 border-gray-300 rounded-2xl p-5 bg-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed size={22} className="text-gray-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">{t('community.cloudtable')}</h3>
              <span className="text-xs font-semibold border border-gray-400 text-gray-600 px-1.5 py-0.5 rounded-md leading-none">
                NEW
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('community.cloudtable.subtitle')}</p>
            <button className="mt-3 border-2 border-gray-400 rounded-lg px-4 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
              {t('community.cloudtable.button')} →
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                {post.initials}
              </div>
              <div>
                <span className="font-medium text-sm text-gray-900">{post.name}</span>
                <span className="text-xs text-gray-400 ml-2">{post.time[lang]}</span>
              </div>
            </div>
            <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mb-2">
              {post.tag}
            </span>
            <p className="text-sm text-gray-800 leading-relaxed">{post.body[lang]}</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-400">
              <span>{post.likes} {t('community.likes')}</span>
              <span>{post.comments} {t('community.comments')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FAB — opens composer */}
      <button
        onClick={() => setShowComposer(true)}
        className="fixed bottom-24 right-1/2 translate-x-[175px] w-11 h-11 bg-gray-900 text-white rounded-full shadow-md flex items-center justify-center z-40"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};

export default CommunityTab;
