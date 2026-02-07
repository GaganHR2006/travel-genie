"use client";
import React, { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
    children: ReactNode;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ComponentErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`Error in component ${this.props.componentName || "unknown"}:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">Component Error</span>
                    </div>
                    <p className="text-sm">
                        {this.props.componentName
                            ? `Failed to render ${this.props.componentName}`
                            : "Failed to render component"}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
