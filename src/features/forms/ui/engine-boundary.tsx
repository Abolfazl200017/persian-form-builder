'use client';
import { Component, type ReactNode } from 'react';
import { Alert, Button } from '@/components/ui';
export class EngineBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="grid gap-4">
        <Alert>بارگذاری فرم با خطا مواجه شد. ساختار فرم و تنظیمات موتور را بررسی کنید.</Alert>
        <Button onClick={() => this.setState({ failed: false })}>تلاش دوباره</Button>
      </div>
    ) : (
      this.props.children
    );
  }
}
