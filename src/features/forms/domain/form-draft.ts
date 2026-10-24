import { z } from 'zod';

export const FORM_TYPES = ['mobile', 'web'] as const;
export type FormType = (typeof FORM_TYPES)[number];

export const FORM_CODE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Shared schema for the Add Form metadata, used by the form and its tests. */
export const formDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'نام فرم الزامی است')
    .max(120, 'نام فرم نباید بیشتر از ۱۲۰ نویسه باشد'),
  code: z
    .string()
    .trim()
    .min(1, 'کد فرم الزامی است')
    .max(60, 'کد فرم نباید بیشتر از ۶۰ نویسه باشد')
    .regex(FORM_CODE_PATTERN, 'کد فرم باید با حروف کوچک انگلیسی، رقم و خط تیره باشد'),
  type: z.enum(FORM_TYPES),
});

export type FormDraft = z.infer<typeof formDraftSchema>;

export const INITIAL_FORM_DRAFT: FormDraft = { name: '', code: '', type: 'web' };
