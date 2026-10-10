# قلعة مغامرات الرياضيات

لعبة تعليمية عربية ثلاثية الأبعاد لطلاب الصف الرابع الأساسي في سلطنة عُمان، مبنية باستخدام React وVite وReact Three Fiber وThree.js.

## التشغيل والمعاينة

تحتاج إلى Node.js 22.12 أو أحدث (تم التحقق باستخدام Node.js 24).

```bash
npm ci
npm run dev
```

افتح `http://localhost:5173` في متصفح حديث على جهازك. في بيئة سحابية، استخدم تحويل المنفذ 5173 أو أداة معاينة المنفذ التي توفرها منصتك؛ عنوان localhost يخص الجهاز الذي يشغّل الخادم. يحتاج المتصفح إلى دعم WebGL وتسريع الرسومات.

## طريقة اللعب

اضغط «لنبدأ المغامرة»، وتحرك بالأسهم أو WASD أو أزرار الشاشة. اقترب من الدائرة أمام كل باب للإجابة عن سؤال ضرب في ١٠ أو ١٠٠. الإجابة الصحيحة تفتح الباب وتمنحك ١٠ نجوم؛ الإجابة الخاطئة تسمح بإعادة المحاولة. بعد فتح الأبواب الخمسة يظهر الكنز ولقب «بطل الرياضيات». اختر «استكشف الكنز» لمتابعة الحركة أو «العب من جديد» لإعادة اللعبة.

## التحقق ونسخة الإنتاج

```bash
npm test
npm run build
npm run preview
```

مخرجات الإنتاج في `dist/`، ويمكن نشرها في استضافة مواقع ثابتة. لا تحتاج اللعبة إلى خدمات خلفية أو مفاتيح سرية. الخط الخارجي اختياري؛ يُستخدم خط النظام عند تعذر تحميله. النموذج الأولي يستخدم رسومات هندسية مولدة، والأسئلة ثابتة، ولا يحفظ التقدم بعد إعادة تحميل الصفحة.

## حفظ التغييرات في GitHub

```bash
git add .gitignore README.md package.json package-lock.json index.html vite.config.js src tests
git commit -m "Add Arabic 3D math castle adventure"
git push origin main
```

## النشر على GitHub Pages

يتضمن المشروع workflow في `.github/workflows/pages.yml` يختبر المشروع ويبنيه وينشر `dist` عند رفع تغييرات إلى `main`، أو يدويًا من تبويب Actions.

في GitHub افتح **Settings → Pages → Build and deployment → Source** واختر **GitHub Actions**. إذا طُلب تفعيل Actions، فعّله. بعدها افتح **Actions → Deploy math castle to GitHub Pages → Run workflow**، وانتظر نجاح مرحلتي build وdeploy. إذا كانت بيئة `github-pages` تتطلب موافقة، وافق على عملية النشر من صفحة التشغيل.

الرابط المتوقع بعد نجاح النشر: https://nooralabri99-hue.github.io/math-castle-adventure/

ضُبط `base` في Vite على `/math-castle-adventure/` لضمان تحميل ملفات JavaScript وCSS من المسار الصحيح. لا توجد نماذج أو خامات ثلاثية الأبعاد خارجية؛ تُولّد داخل Three.js. للمعاينة المحلية استخدم المسار `/math-castle-adventure/` الذي يعرضه Vite.
