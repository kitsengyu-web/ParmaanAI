// frontend/components/error-boundary.tsx
"use client";

import React from "react";

export class ErrorBoundary extends React.Component
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("AiBrain failed to load:", error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
