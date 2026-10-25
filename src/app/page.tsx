import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui';
import { LinkButton } from '@/components/link-button';
import { CreateFormButton } from '@/features/forms/ui/create-form-button';
export const metadata: Metadata = { title: 'خانه' };
const steps = [
  { title: 'اطلاعات فرم را وارد کنید', text: 'نام، کد و نوع فرم را تعیین کنید.' },
  { title: 'با طراح بصری بسازید', text: 'مؤلفه‌ها را بکشید و ویژگی‌ها را تنظیم کنید.' },
  { title: 'ساختار را آماده کنید', text: 'تعریف فرم به‌صورت JSON قابل انتقال است.' },
];
const capabilities = [
  {
    title: 'طراح بصری',
    text: 'کشیدن و رهاکردن مؤلفه‌ها، ویرایش خواص و پیش‌نمایش زنده در یک صفحه.',
  },
  { title: 'مؤلفه‌های فارسی', text: 'موبایل ایران، کد ملی، مبلغ فارسی و قواعد اعتبارسنجی بومی.' },
  { title: 'راست‌به‌چپ', text: 'چیدمان، تایپوگرافی و رفتار مؤلفه‌ها هماهنگ با زبان فارسی.' },
];
export default function HomePage() {
  return (
    <div className="grid gap-8 md:gap-10">
      <Card className="bg-[linear-gradient(135deg,rgba(52,152,255,.1),transparent_62%)]">
        <CardContent className="grid items-center gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
          <div className="grid min-w-0 gap-4">
            <p className="text-sm font-semibold text-primary">پنل مدیریت فرم‌های فارسی</p>
            <h1 className="text-2xl font-bold sm:text-3xl">فرم بسازید، بدون درگیری با کد</h1>
            <p className="max-w-xl text-[.9375rem] text-muted-foreground">
              طراح بصری FormEngine را در کنار مؤلفه‌های فارسی و راست‌به‌چپ دارید؛ از ساخت فرم تا
              آماده‌سازی ساختار JSON.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <CreateFormButton />
              <LinkButton href="/forms" variant="outline">
                مشاهده فرم‌ها
              </LinkButton>
            </div>
          </div>
          <Card>
            <CardContent>
              <h2 className="mb-4 font-semibold">شروع در سه گام</h2>
              <div className="grid gap-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-xs font-bold text-primary">
                      {['۰۱', '۰۲', '۰۳'][index]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <section>
        <h2 className="text-xl font-semibold">امکانات پنل</h2>
        <p className="mb-5 mt-1 text-muted-foreground">
          هر چیزی که برای ساخت و نگهداری فرم‌های فارسی لازم دارید، در یک فضای کار.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, index) => (
            <Card key={item.title}>
              <CardContent>
                <p className="text-sm font-semibold text-primary">{['۰۱', '۰۲', '۰۳'][index]}</p>
                <h3 className="my-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
