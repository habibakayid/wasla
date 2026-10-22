import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Language = 'en' | 'ar';

const arabicTranslations: Record<string, string> = {
  'Welcome back': 'مرحبًا بعودتك',
  'Sign in to continue to Wasla.': 'سجّل الدخول لمتابعة استخدام وصلة.',
  'Email': 'البريد الإلكتروني',
  'Password': 'كلمة المرور',
  'Email is required.': 'البريد الإلكتروني مطلوب.',
  'Enter a valid email address.': 'أدخل بريدًا إلكترونيًا صحيحًا.',
  'Password is required.': 'كلمة المرور مطلوبة.',
  'Hide': 'إخفاء',
  'Show': 'إظهار',
  'Sign in': 'تسجيل الدخول',
  'New to Wasla?': 'جديد في وصلة؟',
  'Create an account': 'أنشئ حسابًا',
  'Create account': 'إنشاء حساب',
  'Join Wasla and connect with people.': 'انضم إلى وصلة وتواصل مع الآخرين.',
  'Step': 'الخطوة',
  'of': 'من',
  'Full name': 'الاسم الكامل',
  'Full name is required.': 'الاسم الكامل مطلوب.',
  'Use at least 3 characters.': 'استخدم 3 أحرف على الأقل.',
  'valid email': 'بريد إلكتروني صحيح',
  'Confirm password': 'تأكيد كلمة المرور',
  'passwords match': 'كلمتا المرور متطابقتان',
  'Passwords do not match.': 'كلمتا المرور غير متطابقتين.',
  'Continue': 'متابعة',
  'Username': 'اسم المستخدم',
  'Username is required.': 'اسم المستخدم مطلوب.',
  'Username cannot contain spaces.': 'لا يمكن أن يحتوي اسم المستخدم على مسافات.',
  'Date of birth': 'تاريخ الميلاد',
  'Date of birth is required.': 'تاريخ الميلاد مطلوب.',
  'You must be at least 13 years old.': 'يجب ألا يقل عمرك عن 13 عامًا.',
  'Gender': 'النوع',
  'Male': 'ذكر',
  'Female': 'أنثى',
  'Please choose one.': 'يرجى اختيار أحد الخيارات.',
  'Back': 'رجوع',
  'Already have an account?': 'لديك حساب بالفعل؟',
  'Home': 'الرئيسية',
  'Explore': 'استكشف',
  'Bookmarks': 'المحفوظات',
  'Notifications': 'الإشعارات',
  'Profile': 'الملف الشخصي',
  'Settings': 'الإعدادات',
  'Posts': 'المنشورات',
  'Followers': 'المتابعون',
  'Saved': 'المحفوظات',
  'Collapse Sidebar': 'طي الشريط الجانبي',
  'Log out': 'تسجيل الخروج',
  'Search wasla...': 'ابحث في وصلة...',
  'Toggle dark mode': 'تبديل الوضع الداكن',
  'My profile': 'ملفي الشخصي',
  'Wasla home': 'الصفحة الرئيسية لوصلة',
  'Recent Activity': 'النشاط الأخير',
  'No recent activity.': 'لا يوجد نشاط حديث.',
  'Alerts': 'التنبيهات',
  'Suggestions': 'اقتراحات',
  'Loading...': 'جارٍ التحميل...',
  'No suggestions right now.': 'لا توجد اقتراحات الآن.',
  'followers': 'متابعون',
  'Follow': 'متابعة',
  'Following': 'يتابع',
  'Who to follow': 'حسابات مقترحة للمتابعة',
  'What’s on your mind?': 'بماذا تفكر؟',
  'Remove image': 'إزالة الصورة',
  'Photo': 'صورة',
  'Public': 'عام',
  'Posting...': 'جارٍ النشر...',
  'Post': 'نشر',
  'shared a post': 'شارك منشورًا',
  'More': 'المزيد',
  'Edit': 'تعديل',
  'Delete': 'حذف',
  'Save': 'حفظ',
  'Cancel': 'إلغاء',
  'Likes': 'إعجاب',
  'Comments': 'تعليق',
  'Share': 'مشاركة',
  'Shares': 'المشاركات',
  'Bookmark': 'حفظ',
  'Nothing to explore yet': 'لا يوجد ما يمكن استكشافه الآن',
  'Load more': 'تحميل المزيد',
  'All': 'الكل',
  'Me': 'منشوراتي',
  'No posts here yet': 'لا توجد منشورات هنا بعد',
  'Follow people or publish your first post.': 'تابع الآخرين أو انشر أول منشور لك.',
  'Back to feed': 'العودة إلى الموجز',
  'Your comment': 'تعليقك',
  'Write a comment...': 'اكتب تعليقًا...',
  'Upload image': 'رفع صورة',
  'Post comment': 'نشر التعليق',
  'Comments ({count})': 'التعليقات ({count})',
  'No comments yet. Be the first to comment.': 'لا توجد تعليقات بعد. كن أول من يعلّق.',
  'Load more comments': 'تحميل المزيد من التعليقات',
  'Liked': 'أعجبني',
  'Like': 'إعجاب',
  'Reply': 'رد',
  'Write a reply...': 'اكتب ردًا...',
  'Send': 'إرسال',
  'Mark all as read': 'تحديد الكل كمقروء',
  'Unread': 'غير المقروءة',
  "You're all caught up": 'لا توجد إشعارات جديدة',
  'Appearance': 'المظهر',
  'Dark mode': 'الوضع الداكن',
  'Switch to light': 'التبديل إلى الوضع الفاتح',
  'Switch to dark': 'التبديل إلى الوضع الداكن',
  'Language': 'اللغة',
  'Profile photo': 'الصورة الشخصية',
  'Uploading...': 'جارٍ الرفع...',
  'Change photo': 'تغيير الصورة',
  'Change password': 'تغيير كلمة المرور',
  'Current password': 'كلمة المرور الحالية',
  'Current password is required.': 'كلمة المرور الحالية مطلوبة.',
  'New password': 'كلمة المرور الجديدة',
  'At least 8 characters.': 'يجب أن تتكون من 8 أحرف على الأقل.',
  'Confirm new password': 'تأكيد كلمة المرور الجديدة',
  'Update password': 'تحديث كلمة المرور',
  'Saving...': 'جارٍ الحفظ...',
  'Session': 'الجلسة',
  'Analytics': 'الإحصاءات',
  'My Posts': 'منشوراتي',
  'My Posts ({count})': 'منشوراتي ({count})',
  'Saved ({count})': 'المحفوظات ({count})',
  'Engagement Analytics': 'إحصاءات التفاعل',
  'of interaction': 'من التفاعلات',
  'Saved posts': 'منشورات محفوظة',
  'posts you bookmarked': 'منشورات أضفتها إلى المحفوظات',
  'Weekly Activity (by post date)': 'النشاط الأسبوعي (حسب تاريخ النشر)',
  'Publish your first post to see analytics here.': 'انشر أول منشور لك لعرض الإحصاءات هنا.',
  "You haven't posted anything yet.": 'لم تنشر أي شيء بعد.',
  'No saved posts yet. Tap the bookmark on any post to keep it here.': 'لا توجد منشورات محفوظة بعد. اضغط على علامة الحفظ في أي منشور لإضافته هنا.',
  'Close': 'إغلاق',
  'Please choose an image file.': 'يرجى اختيار ملف صورة.',
  'Image must be smaller than 5MB.': 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت.',
  'Post published': 'تم نشر المنشور',
  'Password changed': 'تم تغيير كلمة المرور',
  'Profile photo updated': 'تم تحديث الصورة الشخصية',
  'Post shared': 'تمت مشاركة المنشور',
  'Post updated': 'تم تحديث المنشور',
  'Post deleted': 'تم حذف المنشور',
  'Comment added': 'تمت إضافة التعليق',
  'Comment updated': 'تم تحديث التعليق',
  'Comment deleted': 'تم حذف التعليق',
  'Undo': 'تراجع',
  'Your session has expired. Please sign in again.': 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.',
  'Something went wrong. Please try again.': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly document = inject(DOCUMENT);
  readonly language = signal<Language>(this.readLanguage());

  constructor() {
    this.applyLanguage(this.language());
  }

  locale(): string {
    return this.language() === 'ar' ? 'ar-EG' : 'en-US';
  }

  translate(text: string): string {
    return this.language() === 'ar' ? (arabicTranslations[text] ?? text) : text;
  }

  toggleLanguage(): void {
    this.setLanguage(this.language() === 'en' ? 'ar' : 'en');
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem('wasla-language', language);
    this.applyLanguage(language);
  }

  private readLanguage(): Language {
    return localStorage.getItem('wasla-language') === 'ar' ? 'ar' : 'en';
  }

  private applyLanguage(language: Language): void {
    this.document.documentElement.lang = language;
    this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
}
