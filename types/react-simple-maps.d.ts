declare module "react-simple-maps" {
    import * as React from "react";

    export interface ComposableMapProps {
        projection?: string | ((width: number, height: number) => any);
        projectionConfig?: object;
        width?: number;
        height?: number;
        style?: object;
        className?: string;
        children?: React.ReactNode;
    }

    export const ComposableMap: React.FC<ComposableMapProps>;

    export interface GeographiesProps {
        geography?: string | object | string[];
        children: (args: { geographies: any[] }) => React.ReactNode;
        parseGeographies?: (geos: any[]) => any[];
    }

    export const Geographies: React.FC<GeographiesProps>;

    export interface GeographyProps {
        geography: any;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        style?: {
            default?: object;
            hover?: object;
            pressed?: object;
        };
        onMouseEnter?: (event: React.MouseEvent, geography: any) => void;
        onMouseLeave?: (event: React.MouseEvent, geography: any) => void;
        onMouseDown?: (event: React.MouseEvent, geography: any) => void;
        onMouseUp?: (event: React.MouseEvent, geography: any) => void;
        onFocus?: (event: React.FocusEvent, geography: any) => void;
        onBlur?: (event: React.FocusEvent, geography: any) => void;
        key?: string | number;
        className?: string;
        filter?: string;
    }

    export const Geography: React.FC<GeographyProps>;

    export interface MarkerProps {
        coordinates: [number, number];
        children?: React.ReactNode;
        style?: object;
        className?: string;
        onMouseEnter?: (event: React.MouseEvent) => void;
        onMouseLeave?: (event: React.MouseEvent) => void;
        onMouseDown?: (event: React.MouseEvent) => void;
        onMouseUp?: (event: React.MouseEvent) => void;
        onFocus?: (event: React.FocusEvent) => void;
        onBlur?: (event: React.FocusEvent) => void;
        key?: string | number;
    }

    export const Marker: React.FC<MarkerProps>;

    export interface AnnotationProps {
        subject: [number, number];
        dx?: number;
        dy?: number;
        curve?: number;
        connectorProps?: object;
        children?: React.ReactNode;
        style?: object;
        className?: string;
    }

    export const Annotation: React.FC<AnnotationProps>;

    export interface ZoomableGroupProps {
        center?: [number, number];
        zoom?: number;
        minZoom?: number;
        maxZoom?: number;
        translateExtent?: [[number, number], [number, number]];
        onMove?: (position: { x: number; y: number; k: number }) => void;
        onMoveStart?: (position: { x: number; y: number; k: number }) => void;
        onMoveEnd?: (position: { x: number; y: number; k: number }) => void;
        children?: React.ReactNode;
        style?: object;
        className?: string;
    }

    export const ZoomableGroup: React.FC<ZoomableGroupProps>;
}
