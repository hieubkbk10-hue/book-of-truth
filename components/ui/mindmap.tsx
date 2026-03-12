"use client";

import "mind-elixir/style.css";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from "react";
import {
  Minus,
  Plus,
  Download,
  Loader2,
  Maximize,
  ScanSearch,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  type MindElixirInstance,
  type MindElixirData,
  type NodeObj,
  type Options,
  type Theme as MindElixirTheme,
} from "mind-elixir";
import MindElixir from "mind-elixir";
import { snapdom, type SnapdomOptions } from "@zumer/snapdom";

function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useResolvedTheme(themeProp?: "light" | "dark"): "light" | "dark" {
  const [detectedTheme, setDetectedTheme] = useState<"light" | "dark">(
    () => getDocumentTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    if (themeProp) return;

    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) {
        setDetectedTheme(docTheme);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [themeProp]);

  return themeProp ?? detectedTheme;
}

type Theme = "light" | "dark";

interface MindMapContextValue {
  mind: MindElixirInstance | null;
  isLoaded: boolean;
}

const MindMapContext = createContext<MindMapContextValue | null>(null);

export function useMindMap() {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error("useMindMap must be used within a MindMap component");
  }
  return context;
}

type MindMapData = MindElixirData;

export interface MindMapRef {
  instance: MindElixirInstance | null;
}

interface MindMapProps {
  children?: ReactNode;
  data?: MindMapData;
  className?: string;
  direction?: 0 | 1 | 2;
  contextMenu?: boolean;
  nodeMenu?: boolean;
  keypress?: boolean;
  locale?: "en" | "zh_CN" | "zh_TW" | "ja" | "pt";
  overflowHidden?: boolean;
  mainLinkStyle?: number;
  theme?: "dark" | "light";
  monochrome?: boolean;
  fit?: boolean;
  readonly?: boolean;
  onChange?: (data: MindMapData, operation: unknown) => void;
  onOperation?: (operation: unknown) => void;
  onSelectNodes?: (nodeObj: NodeObj[]) => void;
  loader?: ReactNode;
}

function DefaultLoader() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="ml-2">Đang tải mindmap…</span>
    </div>
  );
}

const commonSpacing = {
  "--node-gap-x": "48px",
  "--node-gap-y": "16px",
  "--main-gap-x": "24px",
  "--main-gap-y": "32px",
  "--root-radius": "0.625rem",
  "--main-radius": "0.5rem",
  "--topic-padding": "8px 16px",
  "--map-padding": "48px",
};

function createTheme(
  name: string,
  type: "light" | "dark",
  colors: {
    mainColor: string;
    mainBgcolor: string;
    color: string;
    bgcolor: string;
    selected: string;
    accentColor: string;
    rootColor: string;
    rootBgcolor: string;
    rootBorderColor: string;
    panelColor: string;
    panelBgcolor: string;
    panelBorderColor: string;
  },
  palette: string[],
): MindElixirTheme {
  return {
    name,
    type,
    palette,
    cssVar: {
      ...commonSpacing,
      "--main-color": colors.mainColor,
      "--main-bgcolor": colors.mainBgcolor,
      "--main-bgcolor-transparent": `${colors.mainBgcolor.replace(")",
        " / 95%)",
      )}`,
      "--color": colors.color,
      "--bgcolor": colors.bgcolor,
      "--selected": colors.selected,
      "--accent-color": colors.accentColor,
      "--root-color": colors.rootColor,
      "--root-bgcolor": colors.rootBgcolor,
      "--root-border-color": colors.rootBorderColor,
      "--panel-color": colors.panelColor,
      "--panel-bgcolor": colors.panelBgcolor,
      "--panel-border-color": colors.panelBorderColor,
    },
  };
}

const lightColors = {
  mainColor: "oklch(0.145 0 0)",
  mainBgcolor: "oklch(1 0 0)",
  color: "oklch(0.145 0 0)",
  bgcolor: "oklch(1 0 0)",
  selected: "oklch(0.205 0 0)",
  rootColor: "oklch(0.985 0 0)",
  rootBgcolor: "oklch(0.205 0 0)",
  rootBorderColor: "oklch(0.205 0 0)",
  panelColor: "oklch(0.145 0 0)",
  panelBgcolor: "oklch(1 0 0)",
  panelBorderColor: "oklch(0.922 0 0)",
};

const darkColors = {
  mainColor: "oklch(0.985 0 0)",
  mainBgcolor: "oklch(0.145 0 0)",
  color: "oklch(0.985 0 0)",
  bgcolor: "oklch(0.205 0 0)",
  selected: "oklch(0.922 0 0)",
  rootColor: "oklch(0.205 0 0)",
  rootBgcolor: "oklch(0.922 0 0)",
  rootBorderColor: "oklch(0.922 0 0)",
  panelColor: "oklch(0.985 0 0)",
  panelBgcolor: "oklch(0.205 0 0)",
  panelBorderColor: "oklch(1 0 0 / 10%)",
};

const lightTheme: MindElixirTheme = createTheme(
  "shadcn-light",
  "light",
  {
    ...lightColors,
    accentColor: "oklch(0.646 0.222 41.116)",
  },
  [
    "oklch(0.646 0.222 41.116)",
    "oklch(0.6 0.118 184.704)",
    "oklch(0.398 0.07 227.392)",
    "oklch(0.828 0.189 84.429)",
    "oklch(0.769 0.188 70.08)",
    "oklch(0.488 0.243 264.376)",
    "oklch(0.696 0.17 162.48)",
  ],
);

const darkTheme: MindElixirTheme = createTheme(
  "shadcn-dark",
  "dark",
  {
    ...darkColors,
    accentColor: "oklch(0.488 0.243 264.376)",
  },
  [
    "oklch(0.488 0.243 264.376)",
    "oklch(0.696 0.17 162.48)",
    "oklch(0.769 0.188 70.08)",
    "oklch(0.627 0.265 303.9)",
    "oklch(0.645 0.246 16.439)",
    "oklch(0.646 0.222 41.116)",
    "oklch(0.6 0.118 184.704)",
  ],
);

const lightThemeMonochrome: MindElixirTheme = createTheme(
  "shadcn-light-mono",
  "light",
  {
    ...lightColors,
    accentColor: "oklch(0.205 0 0)",
  },
  ["oklch(0.205 0 0)"],
);

const darkThemeMonochrome: MindElixirTheme = createTheme(
  "shadcn-dark-mono",
  "dark",
  {
    ...darkColors,
    accentColor: "oklch(0.922 0 0)",
  },
  ["oklch(0.922 0 0)"],
);

function getTheme(isDark: boolean, isMonochrome: boolean): MindElixirTheme {
  if (isDark) {
    return isMonochrome ? darkThemeMonochrome : darkTheme;
  }
  return isMonochrome ? lightThemeMonochrome : lightTheme;
}

const SIDE = 2;
export const MindMap = forwardRef<MindMapRef, MindMapProps>(function MindMap(
  {
    children,
    data,
    className,
    direction = SIDE,
    contextMenu = true,
    nodeMenu = true,
    keypress = true,
    locale = "en",
    overflowHidden = false,
    mainLinkStyle = 2,
    theme: themeProp,
    monochrome = false,
    fit = true,
    readonly = false,
    onChange,
    onOperation,
    onSelectNodes,
    loader,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mindRef = useRef<MindElixirInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mindInstance, setMindInstance] = useState<MindElixirInstance | null>(
    null,
  );
  const resolvedTheme = useResolvedTheme(themeProp);
  const id = useId();

  useImperativeHandle(
    ref,
    () => ({
      instance: mindRef.current,
    }),
    [],
  );

  const resolvedThemeRef = useRef(resolvedTheme);
  useEffect(() => {
    resolvedThemeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  const onChangeRef = useRef(onChange);
  const onOperationRef = useRef(onOperation);
  const onSelectNodesRef = useRef(onSelectNodes);

  useEffect(() => {
    onChangeRef.current = onChange;
    onOperationRef.current = onOperation;
    onSelectNodesRef.current = onSelectNodes;
  }, [onChange, onOperation, onSelectNodes]);

  const isInternalChangeRef = useRef(false);
  const initialDataRef = useRef(data);

  useEffect(() => {
    if (!containerRef.current || mindRef.current) return;

    let isSubscribed = true;

    const initialData = initialDataRef.current ?? MindElixir.new("Mind Map");
    const themeToUse =
      initialData.theme ||
      getTheme(resolvedThemeRef.current === "dark", monochrome);

    const options: Options = {
      el: containerRef.current,
      direction,
      contextMenu,
      toolBar: false,
      nodeMenu,
      keypress,
      locale,
      overflowHidden,
      mainLinkStyle,
      editable: !readonly,
      alignment: "nodes",
      theme: themeToUse,
    };

    try {
      const mind = new MindElixir(options);
      mind.init(initialData);

      if (isSubscribed) {
        mindRef.current = mind;
        setMindInstance(mind);
        setIsLoaded(true);

        if (fit) {
          mind.scaleFit();
        }

        mind.bus.addListener("operation", (operation) => {
          if (onOperationRef.current) {
            onOperationRef.current(operation);
          }
          if (onChangeRef.current) {
            const updatedData = mind.getData();
            isInternalChangeRef.current = true;
            onChangeRef.current(updatedData, operation);
          }
        });

        if (onSelectNodesRef.current) {
          mind.bus.addListener("selectNodes", (nodeObj) => {
            onSelectNodesRef.current?.(nodeObj);
          });
        }
      }
    } catch (error) {
      console.error("Failed to initialize MindElixir:", error);
    }

    return () => {
      isSubscribed = false;
      mindRef.current = null;
    };
  }, [
    direction,
    contextMenu,
    nodeMenu,
    keypress,
    locale,
    overflowHidden,
    mainLinkStyle,
    monochrome,
    readonly,
    fit,
  ]);

  useEffect(() => {
    if (mindRef.current && data && isLoaded) {
      if (isInternalChangeRef.current) {
        isInternalChangeRef.current = false;
        return;
      }
      mindRef.current.refresh(data);
    }
  }, [data, isLoaded]);

  useEffect(() => {
    if (!mindRef.current || !isLoaded) return;

    const currentData = mindRef.current.getData();
    if (currentData.theme) {
      return;
    }

    const newTheme = getTheme(resolvedTheme === "dark", monochrome);
    mindRef.current.changeTheme(newTheme);
  }, [resolvedTheme, monochrome, isLoaded]);

  return (
    <MindMapContext.Provider
      value={{
        mind: mindInstance,
        isLoaded,
      }}
    >
      <div
        id={id}
        className={cn("relative h-full w-full", className)}
      >
        {!isLoaded ? loader || <DefaultLoader /> : null}
        <div
          ref={containerRef}
          className={cn("h-full w-full", !isLoaded && "opacity-0")}
        />
        {children}
      </div>
    </MindMapContext.Provider>
  );
});

interface MindMapControlsProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showFit?: boolean;
  showExport?: boolean;
  className?: string;
  onExport?: (file: Blob, filename: string) => void;
}

export function MindMapControls({
  position = "top-right",
  showZoom = true,
  showFit = true,
  showExport = true,
  className,
  onExport,
}: MindMapControlsProps) {
  const { mind, isLoaded } = useMindMap();
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    if (mind) {
      const currentScale = mind.scaleVal || 1;
      mind.scale(currentScale + 0.2);
    }
  };

  const handleZoomOut = () => {
    if (mind) {
      const currentScale = mind.scaleVal || 1;
      mind.scale(Math.max(0.2, currentScale - 0.2));
    }
  };

  const handleFit = () => {
    if (mind) {
      mind.scaleFit();
    }
  };

  const handleExport = async () => {
    if (mind) {
      try {
        const result = await snapdom(mind.nodes);
        const rootTopic = mind.nodeData.topic || "mindmap";
        const filename = `${rootTopic}.jpg`;
        const options: SnapdomOptions = {
          type: "jpg",
          filename: rootTopic,
          quality: 1,
          backgroundColor: mind.theme.cssVar["--bgcolor"],
        };

        if (onExport) {
          const blob = await result.toBlob(options);
          onExport(blob, filename);
        }

        await result.download(options);
      } catch (error) {
        console.error("Failed to export mind map:", error);
      }
    }
  };

  const handleFullscreen = () => {
    const container = mind?.container?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      if (!isNowFullscreen && mind) {
        mind.scaleFit();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [mind]);

  if (!mounted || !isLoaded) return null;

  const positionClasses = {
    "top-left": "top-3 left-3",
    "top-right": "top-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
  };

  return (
    <div
      className={cn(
        "absolute z-10 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 p-2 shadow-sm backdrop-blur",
        positionClasses[position],
        className,
      )}
    >
      {showZoom ? (
        <>
          <button
            type="button"
            onClick={handleZoomIn}
            className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
          >
            <Minus className="h-4 w-4" />
          </button>
        </>
      ) : null}
      {showFit ? (
        <button
          type="button"
          onClick={handleFit}
          className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
        >
          <ScanSearch className="h-4 w-4" />
        </button>
      ) : null}
      {showExport ? (
        <button
          type="button"
          onClick={handleExport}
          className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
        >
          <Download className="h-4 w-4" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={handleFullscreen}
        className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
      >
        {isFullscreen ? (
          <ScanSearch className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
