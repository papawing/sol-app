// Cast Profile Checkbox Options and Translations
// Based on Japanese companion service forms

export interface OptionTranslation {
  value: string
  label: {
    en: string
    zh: string
    ja: string
  }
}

// ========== PERSONALITY TYPES (性格) ==========

export const PERSONALITY_OPTIONS: OptionTranslation[] = [
  {
    value: "bright_energetic",
    label: {
      en: "Bright & Energetic",
      zh: "开朗活力",
      ja: "明るい・元気タイプ",
    },
  },
  {
    value: "healing_calm",
    label: {
      en: "Healing & Calm",
      zh: "治愈温和",
      ja: "癒し・おっとりタイプ",
    },
  },
  {
    value: "reliable",
    label: {
      en: "Reliable & Dependable",
      zh: "可靠坚定",
      ja: "しっかり・頼れるタイプ",
    },
  },
  {
    value: "free_spirited",
    label: {
      en: "Free-spirited",
      zh: "随性自由",
      ja: "マイペース・自由タイプ",
    },
  },
  {
    value: "sexy_mature",
    label: {
      en: "Sexy & Mature",
      zh: "性感成熟",
      ja: "セクシー・大人タイプ",
    },
  },
  {
    value: "other",
    label: {
      en: "Other",
      zh: "其他",
      ja: "その他",
    },
  },
]

// ========== APPEARANCE TYPES (見た目の特徴) ==========

export const APPEARANCE_OPTIONS: OptionTranslation[] = [
  {
    value: "beautiful_elegant",
    label: {
      en: "Beautiful & Elegant",
      zh: "美丽优雅",
      ja: "キレイ系",
    },
  },
  {
    value: "cute",
    label: {
      en: "Cute",
      zh: "可爱",
      ja: "カワイイ系",
    },
  },
  {
    value: "sexy",
    label: {
      en: "Sexy",
      zh: "性感",
      ja: "セクシー系",
    },
  },
  {
    value: "pure_natural",
    label: {
      en: "Pure & Natural",
      zh: "清纯自然",
      ja: "清楚・ナチュラル系",
    },
  },
  {
    value: "glamorous",
    label: {
      en: "Glamorous & Stylish",
      zh: "华丽时尚",
      ja: "ギャル・華やか系",
    },
  },
  {
    value: "model_like",
    label: {
      en: "Model-like",
      zh: "模特般",
      ja: "モデル系",
    },
  },
  {
    value: "small_animal",
    label: {
      en: "Small Animal-like",
      zh: "小动物般",
      ja: "小動物系",
    },
  },
  {
    value: "mature_sister",
    label: {
      en: "Mature Sister Type",
      zh: "成熟姐姐",
      ja: "お姉さん系",
    },
  },
  {
    value: "younger_sister",
    label: {
      en: "Younger Sister Type",
      zh: "清纯妹妹",
      ja: "妹系",
    },
  },
  {
    value: "unique",
    label: {
      en: "Unique & Individual",
      zh: "独特个性",
      ja: "個性派",
    },
  },
  {
    value: "other",
    label: {
      en: "Other",
      zh: "其他",
      ja: "その他",
    },
  },
]

// ========== SERVICE TYPES (得意な接客) ==========

export const SERVICE_OPTIONS: OptionTranslation[] = [
  {
    value: "energetic_lively",
    label: {
      en: "Energetic & Lively",
      zh: "活力四射",
      ja: "盛り上げ",
    },
  },
  {
    value: "healing_listener",
    label: {
      en: "Healing & Good Listener",
      zh: "治愈倾听",
      ja: "癒し・聞き上手",
    },
  },
  {
    value: "cute_younger",
    label: {
      en: "Cute & Younger Sister",
      zh: "可爱撒娇",
      ja: "甘えんぼ・妹",
    },
  },
  {
    value: "mature_older",
    label: {
      en: "Mature & Older Sister",
      zh: "成熟姐姐",
      ja: "大人・お姉さん",
    },
  },
  {
    value: "talkative_funny",
    label: {
      en: "Talkative & Funny",
      zh: "健谈幽默",
      ja: "トーク・お笑い",
    },
  },
  {
    value: "romantic_gfe",
    label: {
      en: "Romantic & GFE",
      zh: "浪漫女友",
      ja: "恋人気分",
    },
  },
  {
    value: "good_drinker",
    label: {
      en: "Good with Alcohol",
      zh: "善饮酒",
      ja: "お酒強い",
    },
  },
  {
    value: "intellectual",
    label: {
      en: "Intellectual & Cultured",
      zh: "知性教养",
      ja: "知的・教養",
    },
  },
  {
    value: "attentive",
    label: {
      en: "Attentive & Considerate",
      zh: "细心体贴",
      ja: "気配り",
    },
  },
  {
    value: "unique_free",
    label: {
      en: "Unique & Free-spirited",
      zh: "独特自由",
      ja: "個性派・自由",
    },
  },
  {
    value: "other",
    label: {
      en: "Other",
      zh: "其他",
      ja: "その他",
    },
  },
]

// ========== PREFERRED MEMBER TYPES (好きな男性のタイプ) ==========

export const PREFERRED_MEMBER_OPTIONS: OptionTranslation[] = [
  {
    value: "kind",
    label: {
      en: "Kind Person",
      zh: "温柔的人",
      ja: "優しい人",
    },
  },
  {
    value: "funny",
    label: {
      en: "Funny Person",
      zh: "有趣的人",
      ja: "面白い人",
    },
  },
  {
    value: "reliable",
    label: {
      en: "Reliable Person",
      zh: "可靠的人",
      ja: "頼れる人",
    },
  },
  {
    value: "devoted",
    label: {
      en: "Devoted Person",
      zh: "专一的人",
      ja: "一途な人",
    },
  },
  {
    value: "understanding",
    label: {
      en: "Understanding Person",
      zh: "包容的人",
      ja: "包容力ある人",
    },
  },
  {
    value: "fashionable",
    label: {
      en: "Fashionable Person",
      zh: "时尚的人",
      ja: "おしゃれな人",
    },
  },
  {
    value: "good_listener",
    label: {
      en: "Good Listener",
      zh: "善于倾听",
      ja: "聞き上手",
    },
  },
  {
    value: "conversational",
    label: {
      en: "Likes to Talk",
      zh: "健谈的人",
      ja: "話聞いてくれる人",
    },
  },
  {
    value: "fun_drinking",
    label: {
      en: "Fun Drinking Partner",
      zh: "喝酒有趣",
      ja: "一緒に飲んで楽しい人",
    },
  },
  {
    value: "natural",
    label: {
      en: "Natural Person",
      zh: "自然的人",
      ja: "自然体な人",
    },
  },
  {
    value: "other",
    label: {
      en: "Other",
      zh: "其他",
      ja: "その他",
    },
  },
]

// ========== ENHANCED HOBBIES (趣味) ==========

export const ENHANCED_HOBBY_OPTIONS: OptionTranslation[] = [
  {
    value: "gourmet_food",
    label: {
      en: "Gourmet & Food Tours",
      zh: "美食探店",
      ja: "グルメ・食べ歩き",
    },
  },
  {
    value: "drinking_bars",
    label: {
      en: "Drinking & Bar Hopping",
      zh: "喝酒泡吧",
      ja: "お酒・飲み歩き",
    },
  },
  {
    value: "beauty_fashion",
    label: {
      en: "Beauty & Fashion",
      zh: "美容时尚",
      ja: "美容・ファッション",
    },
  },
  {
    value: "music_live",
    label: {
      en: "Music & Live Shows",
      zh: "音乐现场",
      ja: "音楽・ライブ",
    },
  },
  {
    value: "movies_anime",
    label: {
      en: "Movies/Drama/Anime",
      zh: "影视动漫",
      ja: "映画・ドラマ・アニメ",
    },
  },
  {
    value: "sports_outdoor",
    label: {
      en: "Sports & Outdoor",
      zh: "运动户外",
      ja: "スポーツ・アウトドア",
    },
  },
  {
    value: "travel_trips",
    label: {
      en: "Travel & Trips",
      zh: "旅行出游",
      ja: "旅行・おでかけ",
    },
  },
  {
    value: "gaming_indoor",
    label: {
      en: "Gaming & Indoor",
      zh: "游戏宅家",
      ja: "ゲーム・インドア",
    },
  },
  {
    value: "animals_pets",
    label: {
      en: "Animals & Pets",
      zh: "动物宠物",
      ja: "動物・ペット",
    },
  },
  {
    value: "creative",
    label: {
      en: "Creative Hobbies",
      zh: "创意爱好",
      ja: "クリエイティブ",
    },
  },
  {
    value: "other",
    label: {
      en: "Other",
      zh: "其他",
      ja: "その他",
    },
  },
]

// ========== ENHANCED HOLIDAY STYLE (休日の過ごし方) ==========

export const ENHANCED_HOLIDAY_OPTIONS: OptionTranslation[] = [
  {
    value: "relaxing_home",
    label: {
      en: "Relaxing at Home",
      zh: "在家放松",
      ja: "おうちまったり",
    },
  },
  {
    value: "active_outdoor",
    label: {
      en: "Active & Outdoor",
      zh: "积极户外",
      ja: "アクティブ・アウトドア",
    },
  },
  {
    value: "gourmet_cafes",
    label: {
      en: "Gourmet & Café Tours",
      zh: "美食咖啡",
      ja: "グルメ・カフェ巡り",
    },
  },
  {
    value: "shopping_fashion",
    label: {
      en: "Shopping & Fashion",
      zh: "购物时尚",
      ja: "ショッピング・おしゃれ",
    },
  },
  {
    value: "sports_watching",
    label: {
      en: "Watching Sports",
      zh: "观看体育",
      ja: "スポーツ観戦",
    },
  },
  {
    value: "travel_outings",
    label: {
      en: "Travel & Outings",
      zh: "旅行外出",
      ja: "旅行・おでかけ",
    },
  },
  {
    value: "learning_self",
    label: {
      en: "Learning & Self-improvement",
      zh: "学习提升",
      ja: "習い事・自己啓発",
    },
  },
  {
    value: "friends_social",
    label: {
      en: "Friends & Socializing",
      zh: "朋友社交",
      ja: "友達・社交",
    },
  },
  {
    value: "pets_animals",
    label: {
      en: "With Pets & Animals",
      zh: "宠物陪伴",
      ja: "ペット・動物と過ごす",
    },
  },
  {
    value: "creative_hobbies",
    label: {
      en: "Creative Hobbies",
      zh: "创意爱好",
      ja: "クリエイティブ趣味",
    },
  },
  {
    value: "other",
    label: {
      en: "Other",
      zh: "其他",
      ja: "その他",
    },
  },
]

// ========== HELPER FUNCTIONS ==========

export function getOptionLabel(
  options: OptionTranslation[],
  value: string,
  locale: string = "en"
): string {
  const option = options.find((opt) => opt.value === value)
  if (!option) return value

  const localeKey = locale as "en" | "zh" | "ja"
  return option.label[localeKey] || option.label.en || value
}

export function getPersonalityTypeLabel(type: string, locale: string = "en"): string {
  return getOptionLabel(PERSONALITY_OPTIONS, type, locale)
}

export function getAppearanceTypeLabel(type: string, locale: string = "en"): string {
  return getOptionLabel(APPEARANCE_OPTIONS, type, locale)
}

export function getServiceTypeLabel(type: string, locale: string = "en"): string {
  return getOptionLabel(SERVICE_OPTIONS, type, locale)
}

export function getPreferredMemberTypeLabel(type: string, locale: string = "en"): string {
  return getOptionLabel(PREFERRED_MEMBER_OPTIONS, type, locale)
}

export function getEnhancedHobbyLabel(hobby: string, locale: string = "en"): string {
  return getOptionLabel(ENHANCED_HOBBY_OPTIONS, hobby, locale)
}

export function getEnhancedHolidayStyleLabel(style: string, locale: string = "en"): string {
  return getOptionLabel(ENHANCED_HOLIDAY_OPTIONS, style, locale)
}
