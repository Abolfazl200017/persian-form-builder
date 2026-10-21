import type { Metadata } from 'next';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
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
  {
    title: 'مؤلفه‌های فارسی',
    text: 'موبایل ایران، کد ملی، مبلغ فارسی و قواعد اعتبارسنجی بومی.',
  },
  {
    title: 'راست‌به‌چپ',
    text: 'چیدمان، تایپوگرافی و رفتار مؤلفه‌ها هماهنگ با زبان فارسی.',
  },
];

export default function HomePage() {
  return (
    <Stack spacing={{ xs: 4, md: 5 }}>
      <Card
        sx={{
          backgroundImage:
            'linear-gradient(135deg, rgba(52, 152, 255, 0.10) 0%, rgba(52, 152, 255, 0) 62%)',
        }}
      >
        <CardContent
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.35fr) minmax(300px, 0.65fr)' },
            alignItems: 'center',
            gap: { xs: 3, lg: 5 },
            p: { xs: 3, md: 5 },
            '&:last-child': { pb: { xs: 3, md: 5 } },
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <Typography variant="overline" color="primary">
              پنل مدیریت فرم‌های فارسی
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, maxWidth: 620 }}
            >
              فرم بسازید، بدون درگیری با کد
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560, fontSize: '0.9375rem' }}>
              طراح بصری FormEngine را در کنار مؤلفه‌های فارسی و راست‌به‌چپ دارید؛ از ساخت فرم تا
              آماده‌سازی ساختار JSON.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
              <CreateFormButton />
              <LinkButton href="/forms" variant="outlined">
                مشاهده فرم‌ها
              </LinkButton>
            </Stack>
          </Stack>

          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="subtitle1" component="h2" sx={{ mb: 2 }}>
                شروع در سه گام
              </Typography>
              <Stack spacing={2}>
                {steps.map((step, index) => (
                  <Stack key={step.title} direction="row" spacing={1.5}>
                    <Box
                      aria-hidden
                      sx={{
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: '6px',
                        bgcolor: 'action.selected',
                        color: 'primary.main',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {['۰۱', '۰۲', '۰۳'][index]}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.text}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Box>
        <Typography variant="h5" component="h2">
          امکانات پنل
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
          هر چیزی که برای ساخت و نگهداری فرم‌های فارسی لازم دارید، در یک فضای کار.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {capabilities.map((item, index) => (
            <Card key={item.title}>
              <CardContent>
                <Typography variant="overline" color="primary">
                  {['۰۱', '۰۲', '۰۳'][index]}
                </Typography>
                <Typography sx={{ my: 0.75, fontWeight: 600 }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}
