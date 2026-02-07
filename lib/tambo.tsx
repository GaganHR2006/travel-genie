// lib/tambo.tsx - ROBUST ERROR HANDLING
import { travelComponents as registry } from "@/tambo-registry";
import React from "react";

export interface TamboMessage {
    role: "user" | "assistant";
    content: string;
    components?: any[];
}

export interface TamboResponse {
    message: string;
    components: Array<{
        name: string;
        props: any;
    }>;
}

export async function processTamboMessage(
    userMessage: string,
    conversationHistory: TamboMessage[]
): Promise<TamboResponse> {
    try {
        const context = conversationHistory
            .slice(-5)
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch("/api/tambo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: userMessage,
                context: context,
                registry: registry.map((r) => ({
                    name: r.name,
                    description: r.description,
                })),
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Validate response structure
        if (!data.message && !data.components) {
            throw new Error("Invalid response structure");
        }

        return {
            message: data.message || "I'm here to help!",
            components: data.components || [],
        };
    } catch (error: any) {
        console.error("Tambo processing error:", error);

        // Network error
        if (error.name === "AbortError") {
            return {
                message: "Request timed out. Please try again!",
                components: [],
            };
        }

        // Fallback response
        return {
            message: "I'm having trouble connecting. Please check your internet and try again!",
            components: [],
        };
    }
}

export function renderTamboComponent(name: string, props: any) {
    try {
        const componentDef = registry.find((r) => r.name === name);

        if (!componentDef) {
            console.error(`Component ${name} not found`);
            return (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">Component not found: {name}</p>
                </div>
            );
        }

        const Component = componentDef.component;

        // Validate props with Zod if available
        if (componentDef.propsSchema) {
            try {
                componentDef.propsSchema.parse(props);
            } catch (validationError: any) {
                console.error("Props validation error:", validationError);
                return (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p className="text-amber-600 dark:text-amber-400 text-sm">Invalid component data</p>
                    </div>
                );
            }
        }

        return React.createElement(Component as any, props);
    } catch (error) {
        console.error("Component render error:", error);
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">Failed to render component</p>
            </div>
        );
    }
}
