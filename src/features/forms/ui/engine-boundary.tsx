'use client';
import { Component, type ReactNode } from 'react';
import { Alert, Button, Stack } from '@mui/material';
export class EngineBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <Stack spacing={2}>
        <Alert severity="error">
          بارگذاری فرم با خطا مواجه شد. ساختار فرم و تنظیمات موتور را بررسی کنید.
        </Alert>
        <Button onClick={() => this.setState({ failed: false })}>تلاش دوباره</Button>
      </Stack>
    ) : (
      this.props.children
    );
  }
}
