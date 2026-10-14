'use client';
import Link from 'next/link';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
const components = [
  { title: 'شماره موبایل', text: 'شماره ایران با پیش‌شماره ۰۹' },
  { title: 'کد ملی', text: 'اعتبارسنجی رقم کنترل' },
  { title: 'مبلغ فارسی', text: 'جداکننده هزارگان و تبدیل اعداد' },
  { title: 'تأیید اطلاعات', text: 'پذیرش الزامی پیش از ارسال' },
];
export default function Dashboard() {
  return (
    <Stack spacing={4}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            فضای کار فرم‌ها
          </Typography>
          <Typography color="text.secondary">
            از طراحی تا نمایش؛ همه چیز در یک پنل فارسی.
          </Typography>
        </Box>
        <Chip label="نسخه پایه" color="primary" variant="outlined" />
      </Stack>
      <Card sx={{ background: 'linear-gradient(115deg, #183e34, #2c705a)', color: '#fff' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="overline" sx={{ opacity: 0.7 }}>
            FORMENGINE × MATERIAL UI
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 2 }}>
            فرم بعدی شما، از همین‌جا شروع می‌شود
          </Typography>
          <Typography sx={{ opacity: 0.8, mb: 3, maxWidth: 650 }}>
            فرم‌ها را بصری طراحی کنید، با مؤلفه‌های اختصاصی توسعه دهید و نتیجه را در محیط راست‌به‌چپ
            آزمایش کنید.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              href="/designer"
              variant="contained"
              sx={{ bgcolor: '#fff', color: '#183e34', '&:hover': { bgcolor: '#e5eee9' } }}
            >
              شروع طراحی فرم
            </Button>
            <Button
              component={Link}
              href="/viewer"
              variant="outlined"
              sx={{ color: '#fff', borderColor: '#91b1a5' }}
            >
              مشاهده فرم نمونه
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}
      >
        {[
          { value: '۰۸', label: 'مؤلفه قابل استفاده' },
          { value: 'فارسی', label: 'رابط و فرم راست‌به‌چپ' },
          { value: 'JSON', label: 'ساختار قابل انتقال' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent>
              <Typography variant="h4" color="primary">
                {item.value}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {item.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          مؤلفه‌های اختصاصی
        </Typography>
        <Typography variant="body2" color="text.secondary">
          یک ثبت مشترک برای طراح و نمایشگر؛ ساخته‌شده با MUI 9.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {components.map((item, i) => (
          <Card key={item.title}>
            <CardContent>
              <Typography variant="overline" color="secondary">
                {['۰۱', '۰۲', '۰۳', '۰۴'][i]}
              </Typography>
              <Typography sx={{ fontWeight: 700, my: 1 }}>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
