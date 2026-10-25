import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Leaf,
  ShieldAlert,
  HeartHandshake,
  CheckCircle2,
  Recycle,
  Sparkles,
  ArrowRight,
  Droplets,
  AlertOctagon,
  Award,
  Globe2,
  Flame,
  FileCheck2,
  TreePine,
  Share2,
  CheckSquare,
  Square
} from 'lucide-react';
import { BackButton } from '../components/BackButton';

interface AwarenessPageProps {
  setCurrentTab?: (tab: string) => void;
  onBack?: () => void;
}

export const AwarenessPage: React.FC<AwarenessPageProps> = ({ setCurrentTab, onBack }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'5r' | 'hazards' | 'workers' | 'habits'>('5r');
  const [completedHabits, setCompletedHabits] = useState<string[]>(['h1', 'h2']);

  const toggleHabit = (id: string) => {
    setCompletedHabits(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Text resources for English, Kannada, and Hindi
  const content = {
    en: {
      badge: 'Karnataka Environmental Awareness Mission',
      title: 'Environmental Awareness & Sustainable Living',
      subtitle:
        'Understanding the environmental impact of municipal waste, embracing the 5R circular economy, and standing up for sanitation worker dignity across Karnataka.',
      tab5R: '5R Sustainability Hierarchy',
      tabHazards: 'Plastic Pollution & Landfill Impact',
      tabWorkers: 'Pourakarmika Safety & Dignity',
      tabHabits: 'Daily Green Habits Checklist',
      
      fiveRTitle: 'The 5R Hierarchy: Beyond Traditional Recycling',
      fiveRDesc:
        'Recycling is only the last resort. The most effective environmental strategy is to refuse and reduce consumption before waste is even generated.',
      
      hazardsTitle: 'The Real Cost of Unsegregated Waste in Karnataka',
      hazardsDesc:
        'When mixed waste enters landfills like Mandur, Mittaganahalli, and Mavallipura, it triggers toxic fires, groundwater poisoning, and greenhouse methane leaks.',
      
      workersTitle: 'Protecting Our Pourakarmikas (Sanitation Champions)',
      workersDesc:
        'Over 35,000 sanitation workers serve Karnataka daily. Unsegregated medical syringes, broken glass, and chemicals cause severe injuries and infections.',

      habitsTitle: 'Citizen Green Action Checklist',
      habitsSubtitle: 'Check off your sustainable habits today and earn your Clean Karnataka badge!',
      habitsProgress: 'Habits Completed',
      
      quizCtaTitle: 'Test Your Environmental Knowledge',
      quizCtaDesc: 'Take the Karnataka Waste & Sustainability Quiz to test your awareness and earn citizen badges.',
      btnQuiz: 'Take Sustainability Quiz',
      btnSegregation: 'View Segregation Standards',
      btnReport: 'Report Waste Blackspot'
    },
    kn: {
      badge: 'ಕರ್ನಾಟಕ ಪರಿಸರ ಜಾಗೃತಿ ಅಭಿಯಾನ',
      title: 'ಪರಿಸರ ಜಾಗೃತಿ ಮತ್ತು ಸುಸ್ಥಿರ ಜೀವನ ಶೈಲಿ',
      subtitle:
        'ಪುರಸಭೆಯ ತ್ಯಾಜ್ಯದ ಪರಿಸರ ಪರಿಣಾಮಗಳನ್ನು ಅರಿತುಕೊಳ್ಳುವುದು, 5R ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕತೆಯನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳುವುದು ಮತ್ತು ಪೌರಕಾರ್ಮಿಕರ ಘನತೆಯನ್ನು ರಕ್ಷಿಸುವುದು.',
      tab5R: '5R ಸುಸ್ಥಿರತೆಯ ಕ್ರಮಾನುಗತ',
      tabHazards: 'ಪ್ಲಾಸ್ಟಿಕ್ ಮಾಲಿನ್ಯ & ಲ್ಯಾಂಡ್‌ಫಿಲ್ ಅನಾಹುತ',
      tabWorkers: 'ಪೌರಕಾರ್ಮಿಕರ ಸುರಕ್ಷತೆ & ಘನತೆ',
      tabHabits: 'ದೈನಂದಿನ ಹಸಿರು ಅಭ್ಯಾಸಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
      
      fiveRTitle: '5R ಸಿದ್ಧಾಂತ: ಮರುಬಳಕೆಗಿಂತಲೂ ಮಿಗಿಲಾದುದು',
      fiveRDesc:
        'ಮರುಬಳಕೆಯು ಕೊನೆಯ ಹಂತ ಮಾತ್ರ. ತ್ಯಾಜ್ಯ ಉತ್ಪತ್ತಿಯಾಗುವುದಕ್ಕಿಂತ ಮುಂಚೆಯೇ ಅದನ್ನು ನಿರಾಕರಿಸುವುದು ಮತ್ತು ಕಡಿಮೆ ಮಾಡುವುದು ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ ಪರಿಸರ ತಂತ್ರವಾಗಿದೆ.',
      
      hazardsTitle: 'ವಿಂಗಡಿಸದ ತ್ಯಾಜ್ಯದ ದುಷ್ಪರಿಣಾಮಗಳು',
      hazardsDesc:
        'ಮಿಶ್ರ ತ್ಯಾಜ್ಯವು ಲ್ಯಾಂಡ್‌ಫಿಲ್‌ಗಳಿಗೆ ಹೋದಾಗ, ಅದು ವಿಷಕಾರಿ ಬೆಂಕಿ, ಅಂತರ್ಜಲ ಮಾಲಿನ್ಯ ಮತ್ತು ಮಿಥೇನ್ ಅನಿಲ ಸೋರಿಕೆಗೆ ಕಾರಣವಾಗುತ್ತದೆ.',
      
      workersTitle: 'ನಮ್ಮ ಪೌರಕಾರ್ಮಿಕರ ಸುರಕ್ಷತೆ ಮತ್ತು ಗೌರವ',
      workersDesc:
        'ಕರ್ನಾಟಕದಲ್ಲಿ 35,000ಕ್ಕೂ ಹೆಚ್ಚು ಪೌರಕಾರ್ಮಿಕರು ಪ್ರತಿದಿನ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಾರೆ. ವಿಂಗಡಿಸದ ಚುಚ್ಚುಮದ್ದುಗಳು, ಒಡೆದ ಗಾಜು ಮತ್ತು ರಾಸಾಯನಿಕಗಳು ಅವರಿಗೆ ತೀವ್ರ ಗಾಯಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತವೆ.',

      habitsTitle: 'ನಾಗರಿಕರ ಹಸಿರು ಅಭ್ಯಾಸಗಳ ಪಟ್ಟಿ',
      habitsSubtitle: 'ನಿಮ್ಮ ಸುಸ್ಥಿರ ಅಭ್ಯಾಸಗಳನ್ನು ಗುರುತಿಸಿ ಮತ್ತು ಸ್ವಚ್ಛ ಕರ್ನಾಟಕ ಬ್ಯಾಡ್ಜ್ ಪಡೆಯಿರಿ!',
      habitsProgress: 'ಪೂರ್ಣಗೊಂಡ ಅಭ್ಯಾಸಗಳು',
      
      quizCtaTitle: 'ನಿಮ್ಮ ಪರಿಸರ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ',
      quizCtaDesc: 'ಕರ್ನಾಟಕ ತ್ಯಾಜ್ಯ ಮತ್ತು ಸುಸ್ಥಿರತೆ ರಸಪ್ರಶ್ನೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿ ನಾಗರಿಕ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಗಳಿಸಿ.',
      btnQuiz: 'ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ',
      btnSegregation: 'ವಿಂಗಡಣೆ ಮಾರ್ಗದರ್ಶಿ ವೀಕ್ಷಿಸಿ',
      btnReport: 'ಕಸದ ತಾಣ ವರದಿ ಮಾಡಿ'
    },
    hi: {
      badge: 'कर्नाटक पर्यावरण जागरूकता अभियान',
      title: 'पर्यावरण जागरूकता एवं सतत जीवनशैली',
      subtitle:
        'नगर निगम अपशिष्ट के पर्यावरणीय प्रभावों को समझना, 5R चक्रीय अर्थव्यवस्था को अपनाना, और स्वच्छता योद्धाओं (पौराणिक श्रमिकों) के सम्मान की रक्षा करना।',
      tab5R: '5R स्थिरता पदानुक्रम',
      tabHazards: 'प्लास्टिक प्रदूषण एवं लैंडफिल प्रभाव',
      tabWorkers: 'स्वच्छता कर्मियों की सुरक्षा एवं गरिमा',
      tabHabits: 'दैनिक हरित आदतों की सूची',
      
      fiveRTitle: '5R पदानुक्रम: केवल पुनर्चक्रण से परे',
      fiveRDesc:
        'रीसाइक्लिंग केवल अंतिम चरण है। कचरा पैदा होने से पहले ही एकल-उपयोग प्लास्टिक से इनकार करना और खपत कम करना सबसे प्रभावी रणनीति है।',
      
      hazardsTitle: 'मिश्रित कचरे के गंभीर पर्यावरणीय दुष्परिणाम',
      hazardsDesc:
        'जब बिना छांटा हुआ कचरा लैंडफिल में जाता है, तो जहरीली आग, भूजल का जहरीला होना और मीथेन गैस का रिसाव होता है।',
      
      workersTitle: 'हमारे स्वच्छता कर्मियों का सम्मान और सुरक्षा',
      workersDesc:
        'कर्नाटक में प्रतिदिन 35,000 से अधिक स्वच्छता कर्मी सेवा करते हैं। बिना छांटी गई सीरिंज, कांच और रसायनों से उन्हें गंभीर चोटें और संक्रमण होते हैं।',

      habitsTitle: 'नागरिक हरित संकल्प सूची',
      habitsSubtitle: 'आज ही अपनी पर्यावरण-अनुकूल आदतों को चिह्नित करें और स्वच्छ कर्नाटक बैज अर्जित करें!',
      habitsProgress: 'पूरी की गई आदतें',
      
      quizCtaTitle: 'अपने पर्यावरण ज्ञान का परीक्षण करें',
      quizCtaDesc: 'कचरा प्रबंधन और स्थिरता प्रश्नोत्तरी में भाग लें और नागरिक सम्मान बैज प्राप्त करें।',
      btnQuiz: 'प्रश्नोत्तरी प्रारंभ करें',
      btnSegregation: 'पृथक्करण नियम देखें',
      btnReport: 'कचरा स्थल की रिपोर्ट करें'
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  const fiveRItems = [
    {
      num: '1',
      title: language === 'kn' ? 'ನಿರಾಕರಿಸಿ (Refuse)' : language === 'hi' ? 'इनकार करें (Refuse)' : 'Refuse',
      tag: language === 'kn' ? 'ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ' : language === 'hi' ? 'सर्वाधिक प्रभावी' : 'Most Effective',
      color: 'from-emerald-600 to-green-700',
      desc:
        language === 'kn'
          ? 'ಏಕ-ಬಳಕೆಯ ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲಗಳು, ಪ್ಲಾಸ್ಟಿಕ್ ಕಟ್ಲರಿ, ಸ್ಟ್ರಾಗಳು ಮತ್ತು ಅನಗತ್ಯ ಪ್ರಚಾರ ವಸ್ತುಗಳನ್ನು ನಿರಾಕರಿಸಿ. ಬಟ್ಟೆಯ ಚೀಲವನ್ನು ಸದಾ ಜೊತೆಯಲ್ಲಿಡಿ.'
          : language === 'hi'
          ? 'एकल-उपयोग प्लास्टिक की थैलियों, स्ट्रॉ, प्लास्टिक के बर्तनों और अनावश्यक पैकेजिंग को विनम्रता से मना करें। अपना कपड़े का बैग साथ रखें।'
          : 'Refuse single-use plastic bags, disposable cutlery, plastic straws, and non-essential promotional items. Always carry your own cloth bag.'
    },
    {
      num: '2',
      title: language === 'kn' ? 'ಕಡಿಮೆ ಮಾಡಿ (Reduce)' : language === 'hi' ? 'कम करें (Reduce)' : 'Reduce',
      tag: language === 'kn' ? 'ಮೂಲದಲ್ಲಿ ತಡೆ' : language === 'hi' ? 'खपत में कटौती' : 'Prevent at Source',
      color: 'from-teal-600 to-emerald-700',
      desc:
        language === 'kn'
          ? 'ಅತಿಯಾದ ಪ್ಯಾಕೇಜಿಂಗ್ ಹೊಂದಿರುವ ವಸ್ತುಗಳನ್ನು ಕೊಳ್ಳುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿ. ಬಲ್ಕ್ ಆಗಿ ಖರೀದಿಸಿ ಮತ್ತು ಆಹಾರ ಪೋಲಾಗದಂತೆ ಎಚ್ಚರವಹಿಸಿ.'
          : language === 'hi'
          ? 'अत्यधिक पैकेजिंग वाले उत्पादों को खरीदने से बचें। भोजन की बर्बादी रोकें और टिकाऊ, गुणवत्तापूर्ण वस्तुएं चुनें।'
          : 'Buy in bulk to cut packaging waste, choose products with minimal wrapping, and prevent food waste by planning household meals.'
    },
    {
      num: '3',
      title: language === 'kn' ? 'ಮರುಬಳಕೆ ಮಾಡಿ (Reuse)' : language === 'hi' ? 'पुनः उपयोग (Reuse)' : 'Reuse',
      tag: language === 'kn' ? 'ವಸ್ತುಗಳ ಜೀವಿತಾವಧಿ' : language === 'hi' ? 'जीवनकाल बढ़ाएं' : 'Extend Life Cycle',
      color: 'from-blue-600 to-teal-700',
      desc:
        language === 'kn'
          ? 'ಗಾಜಿನ ಜಾಡಿಗಳು, ಸ್ಟೀಲ್ ಬಾಟಲಿಗಳು, ರಟ್ಟಿನ ಪೆಟ್ಟಿಗೆಗಳನ್ನು ಮರುಬಳಸಿ. ಹಳೆಯ ಬಟ್ಟೆಗಳನ್ನು ಬ್ಯಾಗ್‌ಗಳು ಅಥವಾ ಕ್ಲೀನಿಂಗ್ ಬಟ್ಟೆಯಾಗಿ ಬಳಸಿ.'
          : language === 'hi'
          ? 'कांच के जार, धातु के डिब्बे और कार्डबोर्ड बक्सों का दोबारा उपयोग करें। इलेक्ट्रॉनिक उपकरणों की मरम्मत कराएं।'
          : 'Repurpose glass jars for kitchen storage, use refillable steel water bottles, and repair home appliances instead of discarding them.'
    },
    {
      num: '4',
      title: language === 'kn' ? 'ರೂಪಾಂತರಿಸಿ (Repurpose)' : language === 'hi' ? 'नया रूप दें (Repurpose)' : 'Repurpose',
      tag: language === 'kn' ? 'ಮನೆಯಲ್ಲೇ ಗೊಬ್ಬರ' : language === 'hi' ? 'सृजनात्मक उपयोग' : 'Creative Upcycle',
      color: 'from-amber-600 to-orange-700',
      desc:
        language === 'kn'
          ? 'ಅಡುಗೆಮನೆಯ ಹಸಿ ಕಸವನ್ನು ಹೋಮ್ ಕಂಪೋಸ್ಟಿಂಗ್ ಮೂಲಕ ಕಪ್ಪು ಚಿನ್ನವಾಗಿ (ಗೊಬ್ಬರ) ಪರಿವರ್ತಿಸಿ. ಹಳೆಯ ಟೈರ್‌ಗಳನ್ನು ಗಿಡ ನೆಡಲು ಬಳಸಿ.'
          : language === 'hi'
          ? 'रसोई के गीले कचरे को खाद में बदलें। पुराने बर्तनों और बक्सों को बालकनी के पौधों के गमलों में बदलें।'
          : 'Turn kitchen peels into rich organic compost for terrace gardens. Convert old wooden crates into planters or shoe racks.'
    },
    {
      num: '5',
      title: language === 'kn' ? 'ಮರುಸಂಸ್ಕರಣೆ (Recycle)' : language === 'hi' ? 'पुनर्चक्रण (Recycle)' : 'Recycle',
      tag: language === 'kn' ? 'ಸ್ವಚ್ಛ ಒಣ ಕಸ' : language === 'hi' ? 'शुद्ध रीसाइक्लिंग' : 'Last Resort',
      color: 'from-indigo-600 to-blue-700',
      desc:
        language === 'kn'
          ? 'ಹಾಳೆ, ರಟ್ಟು, ಪ್ಲಾಸ್ಟಿಕ್ ಬಾಟಲಿ ಮತ್ತು ಲೋಹಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿ, ಒಣಗಿಸಿ ನೀಲಿ ಬಿನ್‌ಗೆ ಅಥವಾ ಒಣ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹ ಕೇಂದ್ರಕ್ಕೆ (DWCC) ನೀಡಿ.'
          : language === 'hi'
          ? 'कागज, प्लास्टिक की बोतलें और धातु के डिब्बे धोकर और सुखाकर नीले डिब्बे या ड्राई वेस्ट कलेक्शन सेंटर को सौंपें।'
          : 'Clean, wash, and dry recyclables before putting them into the blue bin or handing them over to Dry Waste Collection Centers (DWCC).'
    }
  ];

  const habitsList = [
    {
      id: 'h1',
      title: language === 'kn' ? 'ಶಾಪಿಂಗ್‌ಗೆ ಬಟ್ಟೆ ಚೀಲ ತೆಗೆದುಕೊಂಡು ಹೋಗುವುದು' : language === 'hi' ? 'खरीदारी के लिए हमेशा कपड़े का थैला साथ रखना' : 'Carry reusable cloth bags for shopping',
      impact: 'Saves ~300 plastic bags per year'
    },
    {
      id: 'h2',
      title: language === 'kn' ? 'ಮನೆಯಲ್ಲಿ ಹಸಿ ಮತ್ತು ಒಣ ಕಸವನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿಡುವುದು' : language === 'hi' ? 'घर में गीला और सूखा कचरा 100% अलग रखना' : 'Maintain strict 2-bin 1-bag segregation at home',
      impact: 'Enables 100% scientific composting'
    },
    {
      id: 'h3',
      title: language === 'kn' ? 'ನೈರ್ಮಲ್ಯ ತ್ಯಾಜ್ಯವನ್ನು ಕೆಂಪು ಕ್ರಾಸ್ ಗುರುತಿನೊಂದಿಗೆ ಕಾಗದದಲ್ಲಿ ಸುತ್ತಿಡುವುದು' : language === 'hi' ? 'सैनिटरी कचरे को अखबार में लपेटकर लाल क्रॉस (X) से चिह्नित करना' : 'Wrap sanitary pads/diapers in paper marked with a Red Cross',
      impact: 'Protects sanitation workers from biohazards'
    },
    {
      id: 'h4',
      title: language === 'kn' ? 'ಏಕ-ಬಳಕೆಯ ಪ್ಲಾಸ್ಟಿಕ್ ಕಟ್ಲರಿ ಮತ್ತು ಸ್ಟ್ರಾಗಳನ್ನು ನಿರಾಕರಿಸುವುದು' : language === 'hi' ? 'एकल-उपयोग प्लास्टिक चम्मच और स्ट्रॉ का उपयोग बंद करना' : 'Refuse single-use disposable cups and plastic cutlery',
      impact: 'Prevents non-recyclable microplastic pollution'
    },
    {
      id: 'h5',
      title: language === 'kn' ? 'ಹಳೆಯ ಬ್ಯಾಟರಿ ಮತ್ತು ಇ-ತ್ಯಾಜ್ಯವನ್ನು ಸಾಮಾನ್ಯ ಕಸದೊಂದಿಗೆ ಬೆರೆಸದಿರುವುದು' : language === 'hi' ? 'इलेक्ट्रॉनिक कचरे और पुरानी बैटरियों को अलग ई-कचरा केंद्र पर देना' : 'Never mix dead batteries or electronics into household bins',
      impact: 'Stops toxic lead & cadmium groundwater leaks'
    },
    {
      id: 'h6',
      title: language === 'kn' ? 'ಬಾಲ್ಕನಿ ಅಥವಾ ಕೈತೋಟದಲ್ಲಿ ಅಡುಗೆಮನೆ ತ್ಯಾಜ್ಯದಿಂದ ಗೊಬ್ಬರ ತಯಾರಿಕೆ' : language === 'hi' ? 'ರसोई के कचरे से बालकनी या बगीचे में होम कम्पोस्टिंग करना' : 'Practice home composting with earthen pots / aerobic bin',
      impact: 'Diverts 60% of household waste from landfills'
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
          <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            Karnataka Environmental Mission
          </span>
        </div>
        
        {/* Top Header Banner */}
        <div className="rounded-3xl bg-linear-to-r from-[#0B2545] via-[#081628] to-[#043328] text-white p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl border border-[#123B5D]">
          {/* Subtle eco leaf background pattern */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <TreePine className="w-96 h-96 text-[#34D399]" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#34D399]/20 border border-[#34D399]/40 text-[#34D399] text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5" />
              <span>{t.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {t.subtitle}
            </p>

            {/* Quick Metrics of Karnataka Waste Challenge */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/10">
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-[#34D399] font-mono block">14,000+ TPD</span>
                <span className="text-[11px] text-slate-300">Daily Waste Generated in Karnataka</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-[#38BDF8] font-mono block">60%</span>
                <span className="text-[11px] text-slate-300">Organic Compostable Waste Share</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-xl sm:text-2xl font-black text-[#FBBF24] font-mono block">35,000+</span>
                <span className="text-[11px] text-slate-300">Sanitation Champions (Pourakarmikas)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Awareness Topics */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          <button
            onClick={() => setActiveTab('5r')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === '5r'
                ? 'bg-[#059669] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Recycle className="w-4 h-4" />
            <span>{t.tab5R}</span>
          </button>

          <button
            onClick={() => setActiveTab('hazards')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'hazards'
                ? 'bg-[#059669] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{t.tabHazards}</span>
          </button>

          <button
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'workers'
                ? 'bg-[#059669] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.tabWorkers}</span>
          </button>

          <button
            onClick={() => setActiveTab('habits')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'habits'
                ? 'bg-[#059669] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.tabHabits}</span>
          </button>
        </div>

        {/* TAB 1: 5R HIERARCHY */}
        {activeTab === '5r' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.fiveRTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {t.fiveRDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {fiveRItems.map(item => (
                <div
                  key={item.num}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${item.color} text-white font-black flex items-center justify-center text-sm shadow-xs`}>
                        {item.num}R
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Circular Economy Summary Card */}
              <div className="bg-linear-to-br from-[#0B2545] to-[#123B5D] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#34D399] flex items-center justify-center">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {language === 'kn' ? 'ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕತೆ' : language === 'hi' ? 'चक्रीय अर्थव्यवस्था' : 'Circular Economy in Action'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'kn'
                      ? 'ತ್ಯಾಜ್ಯವನ್ನು ಕಸವೆಂದು ಭಾವಿಸದೆ ಸಂಪನ್ಮೂಲವಾಗಿ ಮರುಬಳಸಿದಾಗ ನಗರಗಳು ಸ್ವಚ್ಛವಾಗಿ ಉಳಿಯುತ್ತವೆ, ಹೊಸ ಉದ್ಯೋಗಗಳು ಸೃಷ್ಟಿಯಾಗುತ್ತವೆ.'
                      : language === 'hi'
                      ? 'कचरे को बेकार न मानकर संसाधन के रूप में पुनः उपयोग करने से शहर स्वच्छ रहते हैं और पर्यावरण सुरक्षित रहता है।'
                      : 'By transforming biological waste into nutrient compost and non-biological waste into recycled industrial commodities, Karnataka closes the loop.'}
                  </p>
                </div>
                {setCurrentTab && (
                  <button
                    onClick={() => setCurrentTab('segregation')}
                    className="text-xs font-semibold text-[#34D399] hover:text-white flex items-center gap-1.5 cursor-pointer pt-2"
                  >
                    <span>{t.btnSegregation}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HAZARDS & PLASTIC BAN */}
        {activeTab === 'hazards' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.hazardsTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {t.hazardsDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Groundwater Leachate */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'kn' ? 'ಅಂತರ್ಜಲ ವಿಷಮಯತೆ (Leachate)' : language === 'hi' ? 'भूजल में लीचेट प्रदूषण' : 'Landfill Leachate & Water Contamination'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'kn'
                    ? 'ಮಿಶ್ರ ಕಸ ಕೊಳೆತಾಗ ಉತ್ಪತ್ತಿಯಾಗುವ ಕಪ್ಪು ದ್ರವವು (ಲೀಚೇಟ್) ಮಣ್ಣಿನಲ್ಲಿ ಇಳಿದು ಬೋರ್‌ವೆಲ್ ನೀರು ಮತ್ತು ಕೆರೆಗಳನ್ನು ವಿಷಮಯಗೊಳಿಸುತ್ತದೆ.'
                    : language === 'hi'
                    ? 'गीले और रासायनिक कचरे के सड़ने से बनने वाला जहरीला काला तरल (लीचेट) जमीन में रिसकर पीने के पानी को दूषित करता है।'
                    : 'When wet waste mixes with batteries and plastic in unlined open dumps, rainwater extracts heavy metals into a toxic black liquid (leachate) that pollutes surrounding borewells.'}
                </p>
              </div>

              {/* Card 2: Landfill Fires & Methane */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'kn' ? 'ಮಿಥೇನ್ ಬೆಂಕಿ & ವಾಯು ಮಾಲಿನ್ಯ' : language === 'hi' ? 'मीथेन आग और वायु प्रदूषण' : 'Methane Explosions & Toxic Smoke'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'kn'
                    ? 'ಆಮ್ಲಜನಕರಹಿತ ಕಸದ ರಾಶಿಯಲ್ಲಿ ಮಿಥೇನ್ ಅನಿಲ ಉತ್ಪತ್ತಿಯಾಗಿ ಆಕಸ್ಮಿಕ ಬೆಂಕಿ ಹತ್ತಿಕೊಳ್ಳುತ್ತದೆ. ಇದು ಡಯಾಕ್ಸಿನ್ ಮತ್ತು ಫ್ಯೂರಾನ್‌ಗಳಂತಹ ಕ್ಯಾನ್ಸರ್ ಕಾರಕ ಹೊಗೆ ಬಿಡುಗಡೆ ಮಾಡುತ್ತದೆ.'
                    : language === 'hi'
                    ? 'कचरे के ढेर में मीथेन गैस बनने से स्वतः आग लग जाती है, जिससे जहरीला धुआं आसपास के गांवों में श्वसन संबंधी बीमारियां फैलाता है।'
                    : 'Trapped decaying organic waste produces volatile methane gas. Under summer heat, dumps catch fire for weeks, emitting carcinogens like dioxins and furans.'}
                </p>
              </div>

              {/* Card 3: Karnataka Plastic Ban Rules */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'kn' ? 'ಕರ್ನಾಟಕ ಏಕ-ಬಳಕೆಯ ಪ್ಲಾಸ್ಟಿಕ್ ನಿಷೇಧ' : language === 'hi' ? 'कर्नाटक एकल-उपयोग प्लास्टिक प्रतिबंध' : 'Karnataka Single-Use Plastic Ban'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'kn'
                    ? 'ಕರ್ನಾಟಕ ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ ಮಂಡಳಿ (KSPCB) ನಿಯಮಗಳ ಪ್ರಕಾರ, 120 ಮೈಕ್ರಾನ್‌ಗಿಂತ ಕಡಿಮೆ ಇರುವ ಪ್ಲಾಸ್ಟಿಕ್ ಕ್ಯಾರಿ ಬ್ಯಾಗ್‌ಗಳು, ಪ್ಲಾಸ್ಟಿಕ್ ಬ್ಯಾನರ್‌ಗಳು ಮತ್ತು ಥರ್ಮೋಕೋಲ್ ನಿಷೇಧಿಸಲಾಗಿದೆ.'
                    : language === 'hi'
                    ? 'केएसपीसीबी नियमों के तहत 120 माइक्रोन से कम के प्लास्टिक कैरी बैग, प्लास्टिक झंडे और थर्माकोल कटलरी पूर्णतः प्रतिबंधित हैं।'
                    : 'Under KSPCB and Karnataka Municipal notifications, plastic bags below 120 microns, plastic flags, earbuds with plastic sticks, and thermocol decoration are strictly banned.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POURAKARMIKA SAFETY */}
        {activeTab === 'workers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.workersTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {t.workersDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Worker Protocol 1: Sanitary Red Cross */}
              <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">X</span>
                  <h4>{language === 'kn' ? 'ಕೆಂಪು ಕ್ರಾಸ್ (Red Cross) ನೈರ್ಮಲ್ಯ ಪ್ರೋಟೋಕಾಲ್' : language === 'hi' ? 'लाल क्रॉस (Red Cross) सैनिटरी प्रोटोकॉल' : 'The Red Cross (X) Sanitary Protocol'}</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {language === 'kn'
                    ? 'ಬಳಸಿದ ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್‌ಗಳು, ಡೈಪರ್‌ಗಳನ್ನು ಪತ್ರಿಕೆಯಲ್ಲಿ ಸುತ್ತಿ ಕೆಂಪು ಮಾರ್ಕರ್‌ನಿಂದ (X) ಗುರುತು ಹಾಕಿ. ಇದು ಪೌರಕಾರ್ಮಿಕರಿಗೆ ಅದನ್ನು ಮುಟ್ಟದೆ ನೇರವಾಗಿ ಇನ್ಸಿನರೇಟರ್‌ಗೆ ಕಳುಹಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.'
                    : language === 'hi'
                    ? 'इस्तेमाल किए गए सैनिटरी पैड और डायपर को अखबार में लपेटकर लाल मार्कर से (X) का निशान लगाएं ताकि कार्यकर्ता उसे बिना छुए सुरक्षित रूप से अलग कर सकें।'
                    : 'Wrap used sanitary napkins and baby/adult diapers securely in newspaper and clearly mark it with a Red Cross (X). This alerts sanitation workers to handle it with dedicated hygiene tools.'}
                </p>
              </div>

              {/* Worker Protocol 2: Broken Glass & Sharps */}
              <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                  <AlertOctagon className="w-5 h-5 text-amber-600" />
                  <h4>{language === 'kn' ? 'ಒಡೆದ ಗಾಜು ಮತ್ತು ಬ್ಲೇಡ್‌ಗಳ ವಿಲೇವಾರಿ' : language === 'hi' ? 'टूटे हुए कांच और ब्लेड का सुरक्षित निस्तारण' : 'Broken Glass, Needles & Sharps Rule'}</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {language === 'kn'
                    ? 'ಒಡೆದ ಗಾಜಿನ ಚೂರುಗಳು, ಶೇವಿಂಗ್ ಬ್ಲೇಡ್‌ಗಳು ಮತ್ತು ಸಿರಿಂಜ್‌ಗಳನ್ನು ಎಂದಿಗೂ ತೆರೆದ ಚೀಲದಲ್ಲಿ ಹಾಕಬೇಡಿ. ಅವುಗಳನ್ನು ಗಟ್ಟಿಯಾದ ರಟ್ಟಿನ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಹಾಕಿ "SHARP" ಎಂದು ಲೇಬಲ್ ಮಾಡಿ.'
                    : language === 'hi'
                    ? 'टूटे कांच, ब्लेड या सुइयों को कभी भी खुले कचरे में न फेंकें। उन्हें मजबूत कार्डबोर्ड के डिब्बे में रखकर सुरक्षित टेप से बंद करें।'
                    : 'Never place broken mirrors, lightbulbs, or blades directly into waste bags. Seal them inside rigid puncture-proof cardboard boxes labeled "DANGER: SHARP GLASS".'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CITIZEN HABITS CHECKLIST */}
        {activeTab === 'habits' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t.habitsTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t.habitsSubtitle}
                </p>
              </div>

              {/* Score pill */}
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block leading-none">{t.habitsProgress}</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    {completedHabits.length} / {habitsList.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habitsList.map(h => {
                const isDone = completedHabits.includes(h.id);
                return (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <button type="button" className="mt-0.5 shrink-0 text-emerald-700">
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div className="space-y-1">
                      <p className={`text-xs sm:text-sm font-semibold ${isDone ? 'text-slate-900' : 'text-slate-700'}`}>
                        {h.title}
                      </p>
                      <span className="text-[11px] text-emerald-700 font-medium block">
                        🌱 {h.impact}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Call to Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Knowledge Check</span>
              <h3 className="text-base font-bold text-slate-900">{t.quizCtaTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.quizCtaDesc}</p>
            </div>
            {setCurrentTab && (
              <button
                onClick={() => setCurrentTab('quiz')}
                className="w-full py-2.5 px-4 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>{t.btnQuiz}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Standard Rules</span>
              <h3 className="text-base font-bold text-slate-900">14-Stream Waste Segregation Guide</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check exact bin color codes, preparation protocols, and common items for domestic waste.
              </p>
            </div>
            {setCurrentTab && (
              <button
                onClick={() => setCurrentTab('segregation')}
                className="w-full py-2.5 px-4 bg-[#081628] hover:bg-[#051326] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>{t.btnSegregation}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Civic Grievance</span>
              <h3 className="text-base font-bold text-slate-900">Report Waste Blackspot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notice an uncollected garbage pile or illegal dumping in your ward? Report it with GPS & photo.
              </p>
            </div>
            {setCurrentTab && (
              <button
                onClick={() => setCurrentTab('report')}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>{t.btnReport}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
