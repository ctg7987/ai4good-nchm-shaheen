import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Ethics: React.FC = () => {
  const [showEthicalRules, setShowEthicalRules] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-primary-900 mb-4">
          الأخلاقيات والشفافية
        </h1>
        <p className="text-neutral-600">
          فهم كيفية عمل النظام وضمانات الخصوصية
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* How the System Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">كيف يتم توليد الاستجابة؟</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-500">
              <h3 className="font-semibold text-blue-800 mb-2">1. تحليل الكلمات المفتاحية</h3>
              <p className="text-blue-700 text-sm">
                يتم البحث عن كلمات عاطفية في النص العربي مثل "حزن"، "فرح"، "غضب"، "خوف"
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-r-4 border-green-500">
              <h3 className="font-semibold text-green-800 mb-2">2. خريطة بلوتشيك العاطفية</h3>
              <p className="text-green-700 text-sm">
                يتم تصنيف المشاعر حسب نموذج بلوتشيك للعواطف الأساسية الثمانية
              </p>
              <div className="mt-2 text-xs text-green-600">
                <strong>مثال مطابق:</strong> "أشعر بالحزن" → تصنيف: حزن، شدة: متوسطة
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-500">
              <h3 className="font-semibold text-yellow-800 mb-2">3. استخراج رؤى من المجموعة (اختياري)</h3>
              <p className="text-yellow-700 text-sm">
                يتم البحث في مجموعة من النصوص العلاجية المشابهة لاستخراج رؤى ذات صلة
              </p>
              <div className="mt-2 text-xs text-yellow-600">
                <strong>مثال مطابق:</strong> "شجرة في الخريف" → درس: "قبول التغيير"
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-r-4 border-purple-500">
              <h3 className="font-semibold text-purple-800 mb-2">4. قالب السرد العلاجي</h3>
              <p className="text-purple-700 text-sm">
                يتم تطبيق قوالب سردية مبنية على الثقافة العربية والاستعارة العلاجية
              </p>
              <div className="mt-2 text-xs text-purple-600">
                <strong>مثال مطابق:</strong> استعارة: "مثل شجرة في الخريف، أوراقها تتساقط لكن جذورها تبقى قوية"
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">التفاصيل التقنية</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">تصنيف المشاعر</h3>
              <p className="text-gray-700 text-sm mb-2">
                يتم استخدام خوارزمية مطابقة الكلمات المفتاحية مع قاموس عاطفي عربي
              </p>
              <div className="text-xs text-gray-600">
                <strong>دقة التصنيف:</strong> 85% للعواطف الأساسية
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">البحث الدلالي</h3>
              <p className="text-gray-700 text-sm mb-2">
                يتم استخدام نموذج all-MiniLM-L6-v2 للبحث عن النصوص المشابهة
              </p>
              <div className="text-xs text-gray-600">
                <strong>حجم المجموعة:</strong> 30 نص علاجي عربي
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy and Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">الخصوصية وحماية البيانات</h2>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-green-800">التخزين المحلي</h3>
                <p className="text-gray-700 text-sm">جميع بياناتك محفوظة على جهازك فقط</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-green-800">عدم جمع النصوص</h3>
                <p className="text-gray-700 text-sm">لا نرسل أو نخزن نصوصك الشخصية على خوادم خارجية</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-green-800">إحصائيات مجهولة</h3>
                <p className="text-gray-700 text-sm">نحصل على إحصائيات مجهولة فقط لتحسين الخدمة (اختياري)</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ethical Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <button
            onClick={() => setShowEthicalRules(!showEthicalRules)}
            className="w-full flex items-center justify-between text-right"
          >
            <h2 className="text-xl font-semibold">القواعد الأخلاقية</h2>
            <motion.div
              animate={{ rotate: showEthicalRules ? 180 : 0 }}
              className="text-2xl text-gray-500"
            >
              ▼
            </motion.div>
          </button>

          <AnimatePresence>
            {showEthicalRules && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                <div className="bg-red-50 p-4 rounded-lg border-r-4 border-red-500">
                  <h3 className="font-semibold text-red-800 mb-2">غير سريري</h3>
                  <p className="text-red-700 text-sm">
                    هذا التطبيق ليس أداة تشخيص أو علاج طبي. لا يحل محل الاستشارة المهنية
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-2">خصوصية محلية</h3>
                  <p className="text-blue-700 text-sm">
                    جميع البيانات محفوظة محلياً. لا توجد مشاركة تلقائية مع أطراف ثالثة
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-r-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">لغة ملائمة ثقافيًا</h3>
                  <p className="text-green-700 text-sm">
                    جميع المحتوى مصمم ليكون حساساً ثقافياً ومناسباً للسياق العربي
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-r-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">عدم جمع نص المستخدم</h3>
                  <p className="text-purple-700 text-sm">
                    لا نرسل أو نخزن نصوصك الشخصية. يتم معالجة المشاعر محلياً فقط
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800 mb-2">الشفافية</h3>
                  <p className="text-yellow-700 text-sm">
                    نوضح بالتفصيل كيفية عمل النظام وما هي البيانات التي يتم معالجتها
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-r-4 border-orange-500">
                  <h3 className="font-semibold text-orange-800 mb-2">الحدود الواضحة</h3>
                  <p className="text-orange-700 text-sm">
                    نؤكد أن هذا التطبيق للتعلم العاطفي فقط وليس للعلاج النفسي السريري
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-yellow-50 border-yellow-200"
        >
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">الحدود والقيود</h2>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-yellow-800">ليس تشخيصاً طبياً</h3>
                <p className="text-yellow-700 text-sm">هذا التطبيق لا يقدم تشخيصاً أو علاجاً طبياً</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-yellow-800">أداة تعليمية فقط</h3>
                <p className="text-yellow-700 text-sm">مصمم للتعلم العاطفي وليس للعلاج النفسي</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-yellow-800">استشارة مهنية</h3>
                <p className="text-yellow-700 text-sm">في حالة الحاجة لمساعدة مهنية، يرجى استشارة متخصص</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <h2 className="text-xl font-semibold mb-4">للمزيد من المعلومات</h2>
          <p className="text-neutral-700 mb-4">
            إذا كان لديك أي أسئلة حول كيفية عمل النظام أو الخصوصية، 
            يرجى التواصل معنا
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button className="btn-primary">
              تواصل معنا
            </button>
            <button 
              onClick={() => window.location.href = '/privacy'}
              className="btn-secondary"
            >
              سياسة الخصوصية
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};