import React from 'react';
import { motion } from 'framer-motion';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-primary-900 mb-4">
          الخصوصية
        </h1>
        <p className="text-neutral-600">
          كيف نحمي بياناتك ونحترم خصوصيتك
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">البيانات محلية أولاً</h2>
          <p className="text-neutral-700 leading-relaxed">
            جميع بياناتك محفوظة محلياً على جهازك. لا نرسل أي معلومات شخصية إلى خوادم خارجية. 
            بياناتك تبقى تحت سيطرتك الكاملة.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">لا توجد سجلات نصية</h2>
          <p className="text-neutral-700 leading-relaxed">
            لا نحفظ أي سجلات نصية لكتاباتك أو مشاعرك. جميع المعلومات محفوظة محلياً فقط 
            ولا يتم مشاركتها مع أي طرف ثالث.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">عدادات اختيارية</h2>
          <p className="text-neutral-700 leading-relaxed">
            يمكنك اختيار مشاركة إحصائيات مجهولة الهوية لمساعدتنا في تحسين التطبيق. 
            هذه الإحصائيات لا تحتوي على أي معلومات شخصية.
          </p>
          <div className="mt-4">
            <label className="flex items-center">
              <input type="checkbox" className="ml-2" />
              <span className="text-sm text-neutral-600">
                مشاركة إحصائيات مجهولة الهوية
              </span>
            </label>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">البيانات المحذوفة</h2>
          <p className="text-neutral-700 leading-relaxed">
            يمكنك حذف جميع بياناتك في أي وقت من إعدادات التطبيق. 
            عند الحذف، يتم إزالة جميع المعلومات نهائياً من جهازك.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">التشفير</h2>
          <p className="text-neutral-700 leading-relaxed">
            جميع البيانات المحفوظة محلياً مشفرة لحماية خصوصيتك. 
            حتى لو تم الوصول إلى جهازك، ستكون بياناتك محمية.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">لا تتبع</h2>
          <p className="text-neutral-700 leading-relaxed">
            لا نستخدم ملفات تعريف الارتباط أو تقنيات التتبع. 
            لا نراقب نشاطك أو نجمع معلومات عن عاداتك.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            العودة للرئيسية
          </button>
        </div>
      </motion.div>
    </div>
  );
};
