/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Unlock, 
  Shield, 
  Terminal, 
  Activity, 
  Cpu, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Flame, 
  Volume2, 
  VolumeX, 
  Upload, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Info,
  Layers,
  HelpCircle,
  Clock,
  ExternalLink,
  Bot,
  User,
  CheckCircle2,
  LockKeyhole,
  Menu,
  ChevronLeft,
  Sliders,
  LineChart,
  LayoutDashboard
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

// Web Audio API Sound Generator for tactical immersive experience
const playBeep = (freq = 800, duration = 0.08, type: OscillatorType = "sine", muted = false) => {
  if (muted || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore context audio block errors
  }
};

const themeStyles: Record<string, {
  name: string;
  primary: string;
  secondary: string;
  glow: string;
  border: string;
  cardBorder: string;
}> = {
  green: {
    name: "Verde Neon",
    primary: "#14F195",
    secondary: "#00FFCC",
    glow: "rgba(20, 241, 149, 0.35)",
    border: "rgba(20, 241, 149, 0.4)",
    cardBorder: "rgba(20, 241, 149, 0.15)"
  },
  blue: {
    name: "Azul Neon",
    primary: "#03E1FF",
    secondary: "#9945FF",
    glow: "rgba(3, 225, 255, 0.35)",
    border: "rgba(3, 225, 255, 0.4)",
    cardBorder: "rgba(3, 225, 255, 0.15)"
  },
  red: {
    name: "Rojo Neon",
    primary: "#FF3131",
    secondary: "#FF9F00",
    glow: "rgba(255, 49, 49, 0.35)",
    border: "rgba(255, 49, 49, 0.4)",
    cardBorder: "rgba(255, 49, 49, 0.15)"
  },
  pink: {
    name: "Rosa Neon",
    primary: "#FF007F",
    secondary: "#E200FF",
    glow: "rgba(255, 0, 127, 0.35)",
    border: "rgba(255, 0, 127, 0.4)",
    cardBorder: "rgba(255, 0, 127, 0.15)"
  },
  purple: {
    name: "Morado Neon",
    primary: "#9945FF",
    secondary: "#03E1FF",
    glow: "rgba(153, 69, 255, 0.35)",
    border: "rgba(153, 69, 255, 0.4)",
    cardBorder: "rgba(153, 69, 255, 0.15)"
  },
  silver: {
    name: "Plata Neon",
    primary: "#E2E8F0",
    secondary: "#A1A1AA",
    glow: "rgba(226, 232, 240, 0.35)",
    border: "rgba(226, 232, 240, 0.4)",
    cardBorder: "rgba(226, 232, 240, 0.15)"
  }
};

const getThemeCss = (color: string) => {
  const config = themeStyles[color] || themeStyles.blue;
  return `
    :root {
      --color-legacy-cyan: ${config.primary} !important;
      --color-legacy-purple: ${config.secondary} !important;
      --color-legacy-border: ${config.cardBorder} !important;
    }
    .glow-cyan {
      box-shadow: 0 0 15px ${config.glow} !important;
      border: 1px solid ${config.border} !important;
    }
    .glow-text-cyan {
      text-shadow: 0 0 8px ${config.primary} !important;
    }
    .bg-legacy-card {
      border-color: ${config.cardBorder} !important;
      box-shadow: 0 0 10px rgba(0,0,0,0.5), inset 0 0 10px ${config.glow.replace("0.35", "0.03")} !important;
    }
    .border-legacy-border {
      border-color: ${config.cardBorder} !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${config.primary} !important;
    }

    @keyframes scanline-anim {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes flicker-cyber {
      0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 0.99; filter: hue-rotate(0deg); }
      20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.7; filter: hue-rotate(15deg); }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 15px ${config.glow}; }
      50% { box-shadow: 0 0 25px ${config.glow.replace("0.35", "0.5")}; }
    }
    .cyber-scanlines::after {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
      background-size: 100% 4px;
      z-index: 10;
      pointer-events: none;
      opacity: 0.35;
    }
    .cyber-scanline {
      width: 100%;
      height: 6px;
      background: linear-gradient(to bottom, transparent, ${config.primary}, transparent);
      position: absolute;
      animation: scanline-anim 8s linear infinite;
      opacity: 0.15;
      z-index: 11;
      pointer-events: none;
    }
    .cyber-glitch {
      animation: flicker-cyber 4s infinite;
    }
    .cyber-pulse {
      animation: glow-pulse 3s infinite;
    }
    .cyber-grid-overlay {
      background-image: 
        linear-gradient(rgba(20, 241, 149, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(20, 241, 149, 0.02) 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .cyber-clip {
      clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
    }
    .cyber-button {
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
    }
    .cyber-button::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      transition: all 0.4s ease-in-out;
    }
    .cyber-button:hover::before {
      left: 100%;
    }
  `;
};

export default function Home() {
  // Navigation & Security state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [securityStep, setSecurityStep] = useState(1); // 1: User/Pass, 2: PIN, 3: Secret Phrase, 4: 2FA
  const [muted, setMuted] = useState(false);

  // User customized preferences & navigation state
  const [operatorName, setOperatorName] = useState("admin");
  const [themeColor, setThemeColor] = useState<"green" | "blue" | "red" | "pink" | "purple" | "silver">("blue");
  const [activeView, setActiveView] = useState<"panel" | "perfil" | "chart">("panel");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartStyle, setChartStyle] = useState<"line" | "candles">("candles");
  const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 350 });
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartDimensions({
          width: entry.contentRect.width || 600,
          height: 350
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeView]);

  // Security Credentials inputs
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState("");
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [secretAnswer, setSecretAnswer] = useState("");
  const [otp, setOtp] = useState("");

  // Error messaging inside login
  const [loginError, setLoginError] = useState("");

  // Tactical Alert Log State (Saves live console events)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SIS] Inicializando kernel de seguridad Klopper local...",
    "[NET] Conectado a la intranet VPN segura de cifrado de red...",
    "[DB] Conexión SQL optimizada local montada correctamente.",
    "[RPC] Escaneando feeds públicos de mempools Bitcoin y nodos QuickNode ETH...",
    "[IA] Canales listos para Gemini 3.5 Flash de grado táctico."
  ]);

  const addTerminalLog = useCallback((log: string) => {
    const now = new Date();
    const ts = `[${now.toLocaleTimeString()}]`;
    setTerminalLogs((prev) => [ts + " " + log, ...prev.slice(0, 18)]);
  }, []);

  // Live time ticker
  const [systemTime, setSystemTime] = useState("");

  // Market metrics states
  const [marketData, setMarketData] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>("BTC");
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);

  // Chat/AI State
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: "init",
      sender: "system",
      text: "⚡ [CONEXIÓN ESTABLECIDA]: Terminal de Inteligencia KLOPPER activa. Encriptación de canal AES-256 habilitada. Listo para recibir directrices de análisis de liquidez sobre BTC, ETH, SOL y BNB.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Whale list filter
  const [whaleFilterAsset, setWhaleFilterAsset] = useState<string>("ALL");
  const [minWhaleValue, setMinWhaleValue] = useState<number>(0);

  // Screenshot Upload Simulation State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flash & automatic new transaction detection states
  const [screenFlash, setScreenFlash] = useState<"green" | "red" | null>(null);
  const lastCheckedTxHashRef = useRef<string | null>(null);

  const triggerFlash = useCallback((color: "green" | "red") => {
    setScreenFlash(color);
    if (color === "green") {
      playBeep(523.25, 0.08, "sine", muted); // C5
      setTimeout(() => playBeep(659.25, 0.08, "sine", muted), 80); // E5
      setTimeout(() => playBeep(783.99, 0.15, "sine", muted), 160); // G5
    } else {
      playBeep(440, 0.12, "sawtooth", muted); // A4
      setTimeout(() => playBeep(349.23, 0.2, "sawtooth", muted), 120); // F4
    }
    setTimeout(() => {
      setScreenFlash(null);
    }, 1000);
  }, [muted]);

  const fetchMarketData = useCallback(async () => {
    setIsLoadingMarket(true);
    playBeep(1200, 0.03, "sine", muted);
    try {
      const res = await fetch("/api/market-data");
      if (res.ok) {
        const data = await res.json();
        setMarketData(data);
        playBeep(1600, 0.04, "sine", muted);
      }
    } catch (e) {
      console.error("No se pudo obtener datos del mercado real. Usando simulador.", e);
    } finally {
      setIsLoadingMarket(false);
    }
  }, [muted]);

  // Local storage chats preservation & preference hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("klopper_authenticated");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
      
      const savedChat = localStorage.getItem("klopper_chat_history");
      if (savedChat) {
        try {
          setChatMessages(JSON.parse(savedChat));
        } catch (e) {
          console.error("Error parsing chat history", e);
        }
      }

      const savedName = localStorage.getItem("klopper_operator_name");
      if (savedName) {
        setOperatorName(savedName);
      }

      const savedTheme = localStorage.getItem("klopper_theme_color");
      if (savedTheme) {
        setThemeColor(savedTheme as any);
      }

      const savedSidebar = localStorage.getItem("klopper_sidebar_open");
      if (savedSidebar) {
        setSidebarOpen(savedSidebar === "true");
      }
    }
  }, []);

  // System time ticker update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sourcing initial market data
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketData();
    }, 0);
    const interval = setInterval(fetchMarketData, 20000); // refresh every 20 seconds
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchMarketData]);

  // Mounted check to prevent Recharts hydration issues
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("15M");
  const [priceHistory, setPriceHistory] = useState<{ [key: string]: { time: string; price: number }[] }>({});

  const generateInitialHistory = useCallback((symbol: string, currentPrice: number, change24h: number, timeframe = "15M") => {
    const points = 20;
    const history = [];
    const now = new Date();
    
    let minutesPerPoint = 15;
    if (timeframe === "5M") minutesPerPoint = 5;
    else if (timeframe === "1H") minutesPerPoint = 60;
    else if (timeframe === "4H") minutesPerPoint = 240;
    
    let changeFraction = change24h / 100;
    const totalMinutes = points * minutesPerPoint;
    const scale = totalMinutes / (24 * 60);
    changeFraction = changeFraction * scale;

    const startingPrice = currentPrice / (1 + changeFraction);
    
    for (let i = 0; i < points; i++) {
      const fraction = i / (points - 1);
      const noise = (Math.sin(fraction * Math.PI * 3.5) * 0.012) + ((Math.random() - 0.49) * 0.008);
      const interpolatedPrice = startingPrice + (currentPrice - startingPrice) * fraction;
      const finalPrice = interpolatedPrice * (1 + noise);
      
      const timePoint = new Date(now.getTime() - (points - 1 - i) * minutesPerPoint * 60 * 1000);
      
      let timeLabel = "";
      if (timeframe === "5M" || timeframe === "15M") {
        timeLabel = timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        timeLabel = timePoint.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      history.push({
        time: timeLabel,
        price: Number(finalPrice.toFixed(2)),
        timestamp: timePoint.getTime()
      });
    }
    
    let endTimeLabel = "";
    if (timeframe === "5M" || timeframe === "15M") {
      endTimeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      endTimeLabel = now.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    history[points - 1] = {
      time: endTimeLabel,
      price: currentPrice,
      timestamp: now.getTime()
    };
    
    return history;
  }, []);

  useEffect(() => {
    if (!marketData?.marketMetrics) return;
    
    setPriceHistory(prev => {
      const updated = { ...prev };
      let hasChanges = false;
      
      Object.keys(marketData.marketMetrics).forEach(symbol => {
        const currentPrice = marketData.marketMetrics[symbol].price;
        const change24h = marketData.marketMetrics[symbol].change24h;
        
        ["5M", "15M", "1H", "4H"].forEach(timeframe => {
          const key = `${symbol}_${timeframe}`;
          if (!updated[key] || updated[key].length === 0) {
            updated[key] = generateInitialHistory(symbol, currentPrice, change24h, timeframe);
            hasChanges = true;
          } else {
            const lastIndex = updated[key].length - 1;
            const lastPoint = updated[key][lastIndex];
            if (lastPoint.price !== currentPrice) {
              const now = new Date();
              let endTimeLabel = "";
              if (timeframe === "5M" || timeframe === "15M") {
                endTimeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } else {
                endTimeLabel = now.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }

              const newPoint = {
                time: endTimeLabel,
                price: currentPrice,
                timestamp: now.getTime()
              };
              updated[key] = [...updated[key], newPoint].slice(-30);
              hasChanges = true;
            }
          }
        });
      });
      
      return hasChanges ? updated : prev;
    });
  }, [marketData, generateInitialHistory]);

  // Automated Whale transaction detection effect for LED flashes
  useEffect(() => {
    if (!marketData?.whaleTransactions || marketData.whaleTransactions.length === 0) return;
    
    const latestTx = marketData.whaleTransactions[0];
    
    if (!lastCheckedTxHashRef.current) {
      lastCheckedTxHashRef.current = latestTx.txHash;
      return;
    }
    
    if (latestTx.txHash !== lastCheckedTxHashRef.current) {
      lastCheckedTxHashRef.current = latestTx.txHash;
      
      const isBuy = latestTx.type === "ACCUMULATION" || latestTx.type === "LIQUIDITY_ADD" || latestTx.to === "Cold Wallet";
      const isSell = latestTx.type === "DUMP" || latestTx.type === "LIQUIDITY_REMOVE" || latestTx.to === "CEX Exchange";
      
      if (isBuy) {
        setTimeout(() => {
          triggerFlash("green");
          addTerminalLog(`[RADAR] Compra masiva registrada: ${latestTx.amount.toLocaleString()} ${latestTx.coin}`);
        }, 0);
      } else if (isSell) {
        setTimeout(() => {
          triggerFlash("red");
          addTerminalLog(`[RADAR] Venta masiva registrada: ${latestTx.amount.toLocaleString()} ${latestTx.coin}`);
        }, 0);
      }
    }
  }, [marketData, triggerFlash, addTerminalLog]);

  // AI thinking processing sound pulse loop
  useEffect(() => {
    if (!isAiTyping || muted) return;
    const interval = setInterval(() => {
      playBeep(1100, 0.02, "sine", muted);
      setTimeout(() => playBeep(1300, 0.01, "sine", muted), 60);
    }, 600);
    return () => clearInterval(interval);
  }, [isAiTyping, muted]);

  // 2FA OTP code ticking generator (Simulated live authenticator)
  const [tickingOtp, setTickingOtp] = useState("482931");
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      setOtpSecondsLeft((prev) => {
        if (prev <= 1) {
          // generate new random 6 digit OTP code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setTickingOtp(newCode);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Predefined Questions for Layer 3 security
  const securityQuestions = [
    { q: "¿Cuál es el nombre de tu primer perro?", a: "klopper" },
    { q: "¿En qué ciudad nació tu madre?", a: "madrid" },
    { q: "¿Cuál era tu modelo de coche favorito en la infancia?", a: "delorean" }
  ];



  // Handle Login Step Progressions
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    playBeep(600, 0.05, "sine", muted);
    
    // Default valid credentials for simplicity & security demo
    if (username.trim().toLowerCase() === "admin" && password === "password") {
      addTerminalLog("Credenciales básicas verificadas. Acceso parcial concedido.");
      setSecurityStep(2);
    } else {
      setLoginError("Acceso Denegado: Usuario o contraseña incorrectos.");
      playBeep(220, 0.25, "sawtooth", muted);
    }
  };

  const handleStep2PIN = (digit: string) => {
    playBeep(900, 0.04, "sine", muted);
    setLoginError("");
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      
      // Auto-validate once 6 digits entered
      if (newPin.length === 6) {
        if (newPin === "123456") {
          setTimeout(() => {
            addTerminalLog("Capa de PIN de 6 dígitos superada. Sincronizando frase secreta...");
            // Randomly select one of the three questions to showcase versatility
            setSelectedQuestionIdx(Math.floor(Math.random() * 3));
            setSecurityStep(3);
          }, 200);
        } else {
          setTimeout(() => {
            setLoginError("PIN Táctico Inválido. Sistema bloqueando intentos.");
            setPin("");
            playBeep(220, 0.25, "sawtooth", muted);
          }, 200);
        }
      }
    }
  };

  const clearPin = () => {
    playBeep(440, 0.08, "triangle", muted);
    setPin("");
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    playBeep(600, 0.05, "sine", muted);

    const targetAnswer = securityQuestions[selectedQuestionIdx].a;
    if (secretAnswer.trim().toLowerCase() === targetAnswer) {
      addTerminalLog("Frase Secreta validada. Acceso concedido al Portal 2FA.");
      setSecurityStep(4);
    } else {
      setLoginError(`Respuesta incorrecta para la pregunta de seguridad.`);
      playBeep(220, 0.25, "sawtooth", muted);
    }
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    playBeep(1000, 0.1, "sine", muted);

    // Accept either current ticking dynamic OTP or the universal developer token "123456" or "999999"
    if (otp === tickingOtp || otp === "123456" || otp === "999999") {
      addTerminalLog("Doble Factor de Google Authenticator Sincronizado. Desbloqueando terminal central!");
      setTimeout(() => {
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("klopper_authenticated", "true");
        }
      }, 500);
    } else {
      setLoginError("Token OTP incorrecto o expirado. Re-sincroniza tu generador de código.");
      playBeep(220, 0.25, "sawtooth", muted);
    }
  };

  const handleLogout = () => {
    playBeep(400, 0.15, "sawtooth", muted);
    setIsAuthenticated(false);
    setSecurityStep(1);
    setUsername("admin");
    setPassword("password");
    setPin("");
    setSecretAnswer("");
    setOtp("");
    setLoginError("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("klopper_authenticated");
    }
    addTerminalLog("Sesión cerrada. Canal cerrado. Terminal en modo protegido.");
  };

  // AI chat transmission
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || userInput;
    if (!prompt.trim() && !attachedImage) return;

    playBeep(800, 0.05, "sine", muted);

    const timestamp = new Date().toLocaleTimeString();
    const newUserMsg = {
      id: "user_" + chatMessages.length,
      sender: "user",
      text: prompt,
      image: attachedImage,
      timestamp
    };

    const updatedHistory = [...chatMessages, newUserMsg];
    setChatMessages(updatedHistory);
    setUserInput("");
    setAttachedImage(null);
    setAttachedFileName("");
    setIsAiTyping(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("klopper_chat_history", JSON.stringify(updatedHistory));
    }

    addTerminalLog(`Comando IA enviado: "${prompt.slice(0, 20)}..."`);

    // Sourcing the active token's metrics context
    const currentAssetStats = marketData?.marketMetrics?.[selectedAsset];

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: attachedImage 
            ? `[EL OPERADOR HA SUBIDO UNA CAPTURA DE PANTALLA DE SU TRADING] Petición del operador: "${prompt}". Responde analizando de forma técnica y táctica la situación que plantea la imagen o los gráficos.`
            : prompt,
          chatHistory: updatedHistory,
          selectedAsset,
          assetData: currentAssetStats,
          generalMarketData: marketData
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg = {
          id: "ai_" + chatMessages.length,
          sender: "ai",
          text: data.text,
          timestamp: new Date().toLocaleTimeString()
        };
        const finalHistory = [...updatedHistory, aiMsg];
        setChatMessages(finalHistory);
        if (typeof window !== "undefined") {
          localStorage.setItem("klopper_chat_history", JSON.stringify(finalHistory));
        }
        playBeep(700, 0.08, "triangle", muted);
        addTerminalLog("Respuesta de IA Klopper Intel decodificada exitosamente.");
      } else {
        throw new Error("Respuesta no satisfactoria del servidor de IA.");
      }
    } catch (e: any) {
      const errAlertMsg = {
        id: "sys_" + chatMessages.length,
        sender: "system",
        text: `🚨 [SISTEMA]: Error de enlace con el servidor de IA (${e.message || "Sin respuesta"}). Operando en amortiguamiento local. Intente re-enviar la consulta.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([...updatedHistory, errAlertMsg]);
      playBeep(300, 0.2, "sawtooth", muted);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Chat macros for tactical prompt ease
  const triggerMacro = (macroText: string) => {
    handleSendMessage(macroText);
  };

  // Triggering AI transaction analysis directly from clicking a whale log
  const handleAnalyzeWhaleTx = (tx: any) => {
    const promptText = `Analiza detalladamente esta alerta de ballena: La wallet "${tx.from}" transfirió ${tx.amount.toLocaleString()} ${tx.coin} ($${(tx.valueUsd / 1000000).toFixed(2)}M USD) hacia "${tx.to}" mediante el hash ${tx.txHash}. ¿Qué impacto técnico u orden block de absorción estimas que se creará y cuál es tu diagnóstico de mitigación?`;
    triggerMacro(promptText);

    const isBuy = tx.type === "ACCUMULATION" || tx.type === "LIQUIDITY_ADD" || tx.to === "Cold Wallet";
    const isSell = tx.type === "DUMP" || tx.type === "LIQUIDITY_REMOVE" || tx.to === "CEX Exchange";

    if (isBuy) {
      triggerFlash("green");
    } else if (isSell) {
      triggerFlash("red");
    } else {
      triggerFlash("green");
    }
  };

  // Image Upload handler simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      playBeep(750, 0.06, "sine", muted);
      addTerminalLog(`Archivo cargado: ${file.name}`);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate an institutional template chart upload for quick demo testing
  const loadSimulatedChart = (type: "liquidez" | "orderblock" | "divergencia") => {
    playBeep(850, 0.05, "sine", muted);
    let name = "chart_analisis_liquidez.png";
    let simulatedBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // dummy pixel for base64

    if (type === "liquidez") {
      name = "soporte_liquidez_exness_eth.png";
    } else if (type === "orderblock") {
      name = "orderblock_mitigation_btc_15m.png";
    } else {
      name = "divergencia_rsi_solana_1h.png";
    }
    
    setAttachedFileName(name);
    setAttachedImage(simulatedBase64);
    addTerminalLog(`Simulando captura de trading cargada: ${name}`);
  };

  const clearAttachedImage = () => {
    playBeep(350, 0.05, "sine", muted);
    setAttachedImage(null);
    setAttachedFileName("");
  };

  // Sourcing currently selected asset pricing and pools
  const activeAssetData = marketData?.marketMetrics?.[selectedAsset] || {
    name: selectedAsset,
    price: selectedAsset === "BTC" ? 92450 : selectedAsset === "ETH" ? 3120 : selectedAsset === "BNB" ? 615.5 : 168.4,
    change24h: selectedAsset === "BTC" ? 1.84 : selectedAsset === "ETH" ? -0.45 : selectedAsset === "BNB" ? 2.15 : 5.62,
    volume24h: selectedAsset === "BTC" ? 45280390000 : selectedAsset === "ETH" ? 19830210000 : selectedAsset === "BNB" ? 1230490000 : 3820190000,
    fundingRate: 0.00012,
    openInterest: selectedAsset === "BTC" ? 14820194830 : selectedAsset === "ETH" ? 5820194830 : selectedAsset === "BNB" ? 820194530 : 620194530,
    liquidations24h: { totalUsd: 1500000, longUsd: 800000, shortUsd: 700000 },
    heatmapLiquidity: [
      { price: selectedAsset === "BTC" ? 93100 : 3150, type: "ASK", volumeUsd: 12000000, strength: 85, label: "Orden de Venta" },
      { price: selectedAsset === "BTC" ? 92900 : 3135, type: "ASK", volumeUsd: 8400000, strength: 60, label: "Orden de Venta" },
      { price: selectedAsset === "BTC" ? 92100 : 3105, type: "BID", volumeUsd: 15400000, strength: 90, label: "Soporte Fuerte" },
      { price: selectedAsset === "BTC" ? 91800 : 3085, type: "BID", volumeUsd: 9500000, strength: 75, label: "Soporte" }
    ],
    liquidityPools: [
      { price: selectedAsset === "BTC" ? 91200 : 3050, sizeUsd: 25000000, type: "LONG_LIQ_POOL", label: "Piscina de Liquidez Longs" },
      { price: selectedAsset === "BTC" ? 93500 : 3210, sizeUsd: 18000000, type: "SHORT_LIQ_POOL", label: "Piscina de Liquidez Shorts" }
    ]
  };

  // Format currencies beautifully
  const formatCurrency = (val: number, isShort = false) => {
    if (isShort) {
      if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
      if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
      return `$${val.toLocaleString()}`;
    }
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAssetColor = (symbol: string) => {
    switch (symbol) {
      case "BTC": return "text-[#FCEE0C]"; // Yellow Hazard
      case "ETH": return "text-legacy-cyan"; // Solana Cyan
      case "BNB": return "text-amber-500"; // Gold
      case "SOL": return "text-legacy-purple"; // Solana Purple
      default: return "text-white";
    }
  };

  const getAssetHexColor = (symbol: string) => {
    switch (symbol) {
      case "BTC": return "#FCEE0C";
      case "ETH": return "#03E1FF";
      case "BNB": return "#f59e0b";
      case "SOL": return "#9945FF";
      default: return "#ffffff";
    }
  };

  const getAssetBorder = (symbol: string) => {
    switch (symbol) {
      case "BTC": return "border-[#FCEE0C]/45 hover:border-[#FCEE0C]";
      case "ETH": return "border-legacy-cyan/45 hover:border-legacy-cyan";
      case "BNB": return "border-amber-500/45 hover:border-amber-500";
      case "SOL": return "border-legacy-purple/45 hover:border-legacy-purple";
      default: return "border-legacy-border";
    }
  };

  // Filtered Whales transactions
  const filteredWhaleTransactions = (marketData?.whaleTransactions || []).filter((tx: any) => {
    const coinMatch = whaleFilterAsset === "ALL" || tx.coin === whaleFilterAsset;
    const valueMatch = tx.valueUsd >= minWhaleValue;
    return coinMatch && valueMatch;
  });

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-legacy-cyan selection:text-black bg-[#080c10] cyber-scanlines overflow-hidden">
      {/* Dynamic Theme Styles Injection & Cyberpunk Animations */}
      <style dangerouslySetInnerHTML={{ __html: getThemeCss(themeColor) }} />
      <div className="cyber-scanline"></div>

      {/* Upper Status Line */}
      <header className="border-b border-legacy-border bg-[#0a0f14] px-4 py-2 flex flex-col md:flex-row justify-between items-center text-xs text-legacy-muted font-mono z-20 gap-2 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-legacy-success animate-pulse"></span>
            <span className="text-white font-goldman font-bold bg-clip-text text-transparent bg-gradient-to-r from-legacy-cyan to-legacy-purple">KLOPPER v1.2</span>
          </div>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">NET_SECURE: <span className="text-legacy-cyan">INTRANET_ACTIVE</span></span>
          {isAuthenticated && (
            <>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">OP: <span className="text-legacy-cyan font-bold uppercase">{operatorName}</span></span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-legacy-cyan" />
            <span className="text-white font-mono">{systemTime || "Cargando..."}</span>
          </div>
          <span>|</span>
          <button 
            onClick={() => {
              setMuted(!muted);
              playBeep(900, 0.05, "sine", !muted);
            }} 
            className="hover:text-legacy-cyan transition-colors flex items-center gap-1"
            title={muted ? "Activar Sonido" : "Silenciar"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-legacy-cyan" />}
          </button>
          {isAuthenticated && (
            <>
              <span>|</span>
              <button 
                onClick={handleLogout}
                className="bg-red-950/40 hover:bg-red-900/60 text-rose-400 border border-red-900/50 px-2 py-0.5 rounded transition-all font-mono"
              >
                LOGOUT
              </button>
            </>
          )}
        </div>
      </header>

      {/* Screen Routing */}
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* SECURITY LOCK SCREEN PANEL */
            <motion.div 
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center p-4 bg-secure-overlay relative overflow-hidden"
            >
              {/* Tactical Blueprint Grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

              <div className="w-full max-w-md bg-legacy-card border border-legacy-border p-6 rounded-lg relative z-10 glow-cyan">
                
                {/* Tech corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-legacy-cyan"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-legacy-cyan"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-legacy-cyan"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-legacy-cyan"></div>

                <div className="text-center mb-6">
                  {/* Cyberpunk Decorative Badge */}
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-legacy-cyan/10 border border-legacy-cyan/30 rounded text-[9px] font-mono tracking-widest text-legacy-cyan uppercase cyber-glitch">
                    <Terminal className="w-3 h-3 animate-pulse" />
                    <span>SECURE GATEWAY ESTABLISHED</span>
                  </div>

                  <h1 className="text-4xl font-extrabold font-goldman tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-legacy-cyan via-white to-legacy-purple relative leading-none select-none">
                    KLOPPER
                  </h1>
                  <p className="text-[10px] text-legacy-muted font-mono mt-2 uppercase tracking-widest leading-relaxed">
                    SISTEMA CIBERNÉTICO DE INTELIGENCIA DE MERCADO
                  </p>
                  
                  {/* Progress bars indicating current verification level */}
                  <div className="flex gap-1.5 mt-5 justify-center">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step} 
                        className={`h-1.5 rounded transition-all duration-300 ${
                          securityStep > step 
                            ? "w-8 bg-legacy-success shadow-[0_0_8px_#14f195]" 
                            : securityStep === step 
                              ? "w-10 bg-legacy-cyan animate-pulse shadow-[0_0_12px_var(--color-legacy-cyan)]" 
                              : "w-6 bg-[#16202c]"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-950/40 border border-red-500/50 p-3 rounded mb-4 flex items-start gap-2 text-rose-300 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* LAYER 1: Standard Username/Password credentials */}
                {securityStep === 1 && (
                  <form onSubmit={handleStep1Submit} className="space-y-4 font-mono">
                    <div className="border-l-2 border-legacy-cyan pl-2 mb-3 bg-legacy-bg/40 py-1">
                      <span className="text-[10px] text-legacy-cyan font-bold uppercase block tracking-wider">Capa de Acceso 01/04</span>
                      <span className="text-xs text-white">Suministre credenciales maestras de terminal</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-legacy-muted uppercase mb-1">ID OPERADOR</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#080c10] border border-legacy-border p-2 rounded text-white text-sm focus:border-legacy-cyan focus:outline-none focus:ring-1 focus:ring-legacy-cyan/50 font-sans"
                        placeholder="ID de Operador"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-legacy-muted uppercase mb-1">CLAVE SENCIBLE</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#080c10] border border-legacy-border p-2 rounded text-white text-sm pr-10 focus:border-legacy-cyan focus:outline-none focus:ring-1 focus:ring-legacy-cyan/50 font-sans"
                          placeholder="Clave"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowPassword(!showPassword);
                            playBeep(400, 0.05, "sine", muted);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-legacy-muted hover:text-legacy-cyan transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#101923] p-2 rounded border border-legacy-border/50 text-[10px] text-legacy-muted">
                      💡 <span className="text-legacy-cyan">Pista para pruebas rápidas:</span> Operando con el ID <span className="text-white font-bold">admin</span> y contraseña <span className="text-white font-bold">password</span>.
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-transparent hover:bg-legacy-cyan text-legacy-cyan hover:text-black border border-legacy-cyan py-2 rounded text-sm uppercase transition-all duration-300 font-goldman font-bold tracking-widest mt-2 flex items-center justify-center gap-1"
                    >
                      <span>AUTENTICAR FIRMA</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* LAYER 2: PIN Pad Entry (6 digits) */}
                {securityStep === 2 && (
                  <div className="space-y-4 font-mono">
                    <div className="border-l-2 border-legacy-cyan pl-2 mb-3 bg-legacy-bg/40 py-1">
                      <span className="text-[10px] text-legacy-cyan font-bold uppercase block tracking-wider">Capa de Acceso 02/04</span>
                      <span className="text-xs text-white">Ingrese su PIN táctico de seguridad cifrado</span>
                    </div>

                    {/* Numeric display bubbles */}
                    <div className="flex justify-center gap-2 py-2">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div 
                          key={idx} 
                          className={`w-10 h-12 border rounded flex items-center justify-center text-lg font-bold transition-all ${
                            pin.length > idx 
                              ? "bg-legacy-cyan/15 border-legacy-cyan text-legacy-cyan shadow-[0_0_8px_rgba(3,225,255,0.4)]" 
                              : "bg-legacy-bg border-legacy-border text-legacy-muted"
                          }`}
                        >
                          {pin.length > idx ? "•" : ""}
                        </div>
                      ))}
                    </div>

                    {/* Interactive Virtual NumPad */}
                    <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto py-2">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                        <button 
                          key={num} 
                          onClick={() => handleStep2PIN(num)}
                          className="bg-legacy-bg hover:bg-legacy-cyan/15 border border-legacy-border hover:border-legacy-cyan/60 py-2.5 rounded font-goldman font-bold text-white hover:text-legacy-cyan transition-all active:scale-95 text-base"
                        >
                          {num}
                        </button>
                      ))}
                      <button 
                        onClick={clearPin}
                        className="bg-red-950/20 hover:bg-red-950/40 border border-red-900/50 hover:border-red-500 py-2.5 rounded text-xs text-rose-400 font-bold active:scale-95"
                      >
                        BORRAR
                      </button>
                      <button 
                        onClick={() => handleStep2PIN("0")}
                        className="bg-legacy-bg hover:bg-legacy-cyan/15 border border-legacy-border py-2.5 rounded font-goldman font-bold text-white hover:text-legacy-cyan transition-all active:scale-95 text-base"
                      >
                        0
                      </button>
                      <button 
                        onClick={() => {
                          setPin("123456");
                          handleStep2PIN("");
                        }}
                        className="bg-[#121c27] hover:bg-legacy-cyan/20 border border-legacy-border py-2.5 rounded text-[10px] text-legacy-cyan tracking-tighter"
                      >
                        AUTO
                      </button>
                    </div>

                    <div className="bg-[#101923] p-2 rounded border border-legacy-border/50 text-[10px] text-legacy-muted text-center">
                      💡 PIN por defecto para revisión: <span className="text-white font-bold">123456</span> o pulsa <span className="text-legacy-cyan font-bold">AUTO</span>.
                    </div>
                  </div>
                )}

                {/* LAYER 3: Secret Phrase Questionnaire */}
                {securityStep === 3 && (
                  <form onSubmit={handleStep3Submit} className="space-y-4 font-mono">
                    <div className="border-l-2 border-legacy-cyan pl-2 mb-3 bg-legacy-bg/40 py-1">
                      <span className="text-[10px] text-legacy-cyan font-bold uppercase block tracking-wider">Capa de Acceso 03/04</span>
                      <span className="text-xs text-white">Respuesta a Frase Secreta de Inteligencia</span>
                    </div>

                    <div className="bg-[#0b1016] border border-legacy-border p-3 rounded space-y-2">
                      <div className="flex items-center gap-1 text-legacy-purple text-[10px] font-bold">
                        <LockKeyhole className="w-3.5 h-3.5" />
                        <span>PREGUNTA DE COFACTOR SEGURA:</span>
                      </div>
                      <p className="text-sm text-white font-bold font-sans">
                        {securityQuestions[selectedQuestionIdx].q}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] text-legacy-muted uppercase mb-1">SU RESPUESTA SECRETA</label>
                      <input 
                        type="text" 
                        value={secretAnswer}
                        onChange={(e) => setSecretAnswer(e.target.value)}
                        className="w-full bg-[#080c10] border border-legacy-border p-2 rounded text-white text-sm focus:border-legacy-cyan focus:outline-none focus:ring-1 focus:ring-legacy-cyan/50 font-sans"
                        placeholder="Escriba la respuesta predefinida"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="bg-[#101923] p-2.5 rounded border border-legacy-border/50 text-[10px] text-legacy-muted space-y-1">
                      <div>
                        🔑 <span className="text-legacy-cyan font-bold">Pistas de las 3 preguntas posibles:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[#a4b4c4]">
                        <li>Mascota: <span className="text-white font-bold">Klopper</span></li>
                        <li>Ciudad madre: <span className="text-white font-bold">Madrid</span></li>
                        <li>Coche infancia: <span className="text-white font-bold">Delorean</span></li>
                      </ul>
                      <button 
                        type="button" 
                        onClick={() => {
                          const targetAns = securityQuestions[selectedQuestionIdx].a;
                          // auto fill capitalized properly
                          setSecretAnswer(targetAns.charAt(0).toUpperCase() + targetAns.slice(1));
                          playBeep(900, 0.05, "sine", muted);
                        }}
                        className="text-legacy-cyan hover:underline text-[10px] block pt-1 font-bold"
                      >
                        [ Autocompletar respuesta correcta ]
                      </button>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-transparent hover:bg-legacy-cyan text-legacy-cyan hover:text-black border border-legacy-cyan py-2 rounded text-sm uppercase transition-all duration-300 font-goldman font-bold tracking-widest mt-2 flex items-center justify-center gap-1"
                    >
                      <span>DESBLOQUEAR COFACTOR</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* LAYER 4: Google Authenticator 2FA Verification */}
                {securityStep === 4 && (
                  <form onSubmit={handleStep4Submit} className="space-y-4 font-mono">
                    <div className="border-l-2 border-legacy-cyan pl-2 mb-3 bg-legacy-bg/40 py-1">
                      <span className="text-[10px] text-legacy-cyan font-bold uppercase block tracking-wider">Capa de Acceso 04/04</span>
                      <span className="text-xs text-white">Doble Factor Google Authenticator (OTP)</span>
                    </div>

                    <div className="flex flex-col items-center gap-3 p-3 bg-[#0a0f14] border border-legacy-border rounded-lg">
                      {/* Fake stylized QR code for visual fidelity */}
                      <div className="w-28 h-28 bg-white p-2 rounded relative flex items-center justify-center border-2 border-legacy-cyan">
                        <div className="w-full h-full bg-[repeating-conic-gradient(#000_0_25%,#fff_0_50%)] [background-size:14px_14px]"></div>
                        <div className="absolute inset-1/3 bg-[#0a0f14] border border-legacy-cyan flex items-center justify-center rounded">
                          <Shield className="w-5 h-5 text-legacy-cyan animate-pulse" />
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-legacy-muted block">SEED GENERADOR: <span className="text-white">KLOPPER-TAC-INTEL-001</span></span>
                        
                        {/* Dynamic Live Authenticator display in app */}
                        <div className="mt-2 inline-flex items-center gap-3 bg-legacy-bg border border-legacy-border/80 px-3 py-1.5 rounded-lg">
                          <span className="text-base font-bold text-legacy-whale tracking-widest animate-pulse font-mono">
                            {tickingOtp}
                          </span>
                          <div className="flex items-center gap-1 bg-[#15202c] px-2 py-0.5 rounded text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-legacy-cyan animate-ping"></span>
                            <span className="text-legacy-cyan font-bold">{otpSecondsLeft}s</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-legacy-muted block mt-1.5">El código cambia cada 30 segundos en tu app autenticadora.</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-legacy-muted uppercase mb-1">CÓDIGO DE SEGURIDAD OTP</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#080c10] border border-legacy-border p-2 rounded text-white text-center text-lg font-bold focus:border-legacy-cyan focus:outline-none focus:ring-1 focus:ring-legacy-cyan/50 tracking-[0.4em]"
                        placeholder="000000"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-2 text-[10px] text-legacy-muted">
                      <button 
                        type="button" 
                        onClick={() => {
                          setOtp(tickingOtp);
                          playBeep(900, 0.05, "sine", muted);
                        }}
                        className="flex-1 bg-[#121c27] hover:bg-legacy-cyan/20 border border-legacy-border py-1 px-2 rounded text-legacy-cyan font-bold transition-all"
                      >
                        📋 Copiar OTP Dinámico
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setOtp("123456");
                          playBeep(900, 0.05, "sine", muted);
                        }}
                        className="flex-1 bg-[#121c27] hover:bg-legacy-cyan/20 border border-legacy-border py-1 px-2 rounded text-legacy-cyan font-bold transition-all"
                      >
                        🔑 Forzar Bypass (123456)
                      </button>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-transparent hover:bg-legacy-success text-legacy-success hover:text-black border border-legacy-success py-2.5 rounded text-sm uppercase transition-all duration-300 font-goldman font-bold tracking-widest mt-2 flex items-center justify-center gap-1.5"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>CONCEDER ACCESO MAESTRO</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          ) : (
            /* LEGACY KLOPPER MASTER TACTICAL DASHBOARD W/ SIDEBAR */
            <div className="flex-1 flex flex-col md:flex-row w-full bg-[#080C10] cyber-grid-overlay relative min-h-0">

              {/* COLLAPSIBLE SIDEBAR */}
              <aside 
                className={`border-r border-legacy-border bg-[#0d131a] transition-all duration-300 flex flex-col justify-between shrink-0 font-mono z-10 ${
                  sidebarOpen ? "w-full md:w-64" : "w-full md:w-16"
                }`}
              >
                {/* Upper sidebar menu */}
                <div className="flex flex-col">
                  {/* Sidebar Title & Collapse Button */}
                  <div className="p-4 border-b border-legacy-border flex justify-between items-center bg-[#0a0f14]">
                    <div className={`items-center gap-2 ${sidebarOpen ? "flex" : "hidden md:flex justify-center w-full"}`}>
                      <Sliders className="w-4 h-4 text-legacy-cyan" />
                      {sidebarOpen && <span className="font-goldman font-bold text-xs uppercase tracking-wider text-legacy-cyan">Menú Control</span>}
                    </div>
                    {sidebarOpen && (
                      <button 
                        onClick={() => {
                          setSidebarOpen(false);
                          if (typeof window !== "undefined") localStorage.setItem("klopper_sidebar_open", "false");
                          playBeep(400, 0.05, "sine", muted);
                        }}
                        className="text-legacy-muted hover:text-legacy-cyan transition-colors"
                        title="Colapsar menú"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Navigation Links */}
                  <nav className="p-2 space-y-1">
                    {[
                      { id: "panel", label: "Panel Táctico", icon: LayoutDashboard },
                      { id: "chart", label: "Estado del Precio", icon: LineChart },
                      { id: "perfil", label: "Perfil del Operador", icon: User },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveView(item.id as any);
                            playBeep(700, 0.05, "sine", muted);
                            addTerminalLog(`Navegación: Cambio a ${item.label}`);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs transition-all relative group text-left ${
                            isActive 
                              ? "bg-legacy-cyan/10 text-legacy-cyan border-l-2 border-legacy-cyan" 
                              : "text-legacy-muted hover:text-white hover:bg-legacy-border/40"
                          }`}
                          title={item.label}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-legacy-cyan" : ""}`} />
                          {sidebarOpen ? (
                            <span className="font-medium truncate">{item.label}</span>
                          ) : (
                            /* Tooltip helper for collapsed state */
                            <span className="absolute left-16 bg-[#0d131a] border border-legacy-border text-white px-2 py-1 rounded text-[10px] hidden group-hover:block whitespace-nowrap z-30">
                              {item.label}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Lower Sidebar & Collapse/Expand Button for slim mode */}
                <div className="p-3 border-t border-legacy-border bg-[#0a0f14]/50 flex flex-col gap-2">
                  {!sidebarOpen && (
                    <button 
                      onClick={() => {
                        setSidebarOpen(true);
                        if (typeof window !== "undefined") localStorage.setItem("klopper_sidebar_open", "true");
                        playBeep(500, 0.05, "sine", muted);
                      }}
                      className="w-full py-1.5 flex justify-center text-legacy-muted hover:text-legacy-cyan transition-colors"
                      title="Expandir menú"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                  )}
                  {sidebarOpen && (
                    <div className="text-[10px] text-legacy-muted leading-tight font-sans">
                      <span className="block uppercase font-bold text-legacy-cyan mb-1 font-mono">OP: {operatorName.toUpperCase()}</span>
                      <span className="block uppercase font-mono text-[8px]">TEMA: {themeColor.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </aside>

              {/* WORKSPACE AREA */}
              <div className="flex-1 flex flex-col p-4 relative min-h-0 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeView === "panel" && (
                    <motion.div 
                      key="panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 xl:grid-cols-12 gap-4 max-w-[1920px] mx-auto w-full"
                    >
              
              {/* LEFT SIDEBAR: Asset details & general market parameters (xl:span-3) */}
              <section className="xl:col-span-3 flex flex-col gap-4">
                
                {/* Panel 1: Símbolo de Selección Cripto */}
                <div className="bg-legacy-card border border-legacy-border p-4 rounded-lg flex flex-col relative overflow-hidden group hover:shadow-[0_0_15px_rgba(3,225,255,0.06)] transition-all duration-300">
                  {/* Cyberpunk corner lines */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-legacy-cyan/60"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-legacy-cyan/60"></div>

                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase font-mono tracking-wider rounded-bl-lg">
                    Terminal_Selector
                  </div>
                  <h2 className="text-xs text-legacy-muted font-mono font-bold tracking-wider mb-3 uppercase flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-legacy-cyan" />
                    Activos de Inteligencia
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { sym: "BTC", label: "Bitcoin", icon: "₿", col: "hover:border-[#FCEE0C]" },
                      { sym: "ETH", label: "Ethereum", icon: "Ξ", col: "hover:border-legacy-cyan" },
                      { sym: "BNB", label: "Binance", icon: "❖", col: "hover:border-amber-500" },
                      { sym: "SOL", label: "Solana", icon: "◎", col: "hover:border-legacy-purple" }
                    ].map((coin) => {
                      const isSelected = selectedAsset === coin.sym;
                      const activeColor = getAssetColor(coin.sym);
                      return (
                        <button
                          key={coin.sym}
                          onClick={() => {
                            setSelectedAsset(coin.sym);
                            playBeep(700 + (coin.sym === "BTC" ? 100 : coin.sym === "ETH" ? 200 : 300), 0.05, "sine", muted);
                            addTerminalLog(`Activo de análisis cambiado a: ${coin.sym}`);
                          }}
                          className={`flex flex-col items-start p-2.5 rounded border transition-all relative overflow-hidden text-left active:scale-95 ${
                            isSelected 
                              ? `bg-legacy-bg border-current ${activeColor} shadow-[0_0_12px_rgba(3,225,255,0.1)]` 
                              : "bg-[#0b1016]/80 border-legacy-border text-[#94a3b8] hover:bg-legacy-bg/40"
                          } ${coin.col}`}
                        >
                          <div className="flex justify-between w-full items-center">
                            <span className="text-base font-bold font-goldman">{coin.sym}</span>
                            <span className="text-xs font-mono opacity-80">{coin.icon}</span>
                          </div>
                          <span className="text-[10px] text-legacy-muted font-sans font-medium">{coin.label}</span>
                          {isSelected && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-current"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Panel 2: Métricas del Activo Seleccionado */}
                <div className="bg-legacy-card border border-legacy-border p-4 rounded-lg flex flex-col space-y-4 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(3,225,255,0.06)] transition-all duration-300">
                  {/* Cyberpunk corner lines */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-legacy-cyan/60"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-legacy-cyan/60"></div>

                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase font-mono tracking-wider rounded-bl-lg">
                    Realtime_Sensors
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-legacy-border/50">
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-bold font-goldman ${getAssetColor(selectedAsset)}`}>{selectedAsset} / USD</span>
                    </div>
                    {isLoadingMarket ? (
                      <RefreshCw className="w-3.5 h-3.5 text-legacy-cyan animate-spin" />
                    ) : (
                      <span className="text-[10px] bg-[#14f195]/10 text-legacy-success px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                        SINCRO OK
                      </span>
                    )}
                  </div>

                  {/* Price info block */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-legacy-muted uppercase font-mono block">VALORACIÓN EN EXNESS CFD</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-goldman tracking-wide">
                        {formatCurrency(activeAssetData.price)}
                      </span>
                      <span className={`text-xs font-bold font-mono flex items-center gap-0.5 ${
                        activeAssetData.change24h >= 0 ? "text-legacy-success" : "text-rose-400"
                      }`}>
                        {activeAssetData.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {activeAssetData.change24h >= 0 ? "+" : ""}{activeAssetData.change24h}%
                      </span>
                    </div>
                  </div>

                  {/* Core indicators */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-legacy-bg/60 p-2 rounded border border-legacy-border/40 font-mono">
                      <span className="text-[9px] text-legacy-muted block uppercase">FUNDING RATE</span>
                      <span className={`text-xs font-bold tracking-wider ${activeAssetData.fundingRate >= 0 ? "text-legacy-cyan" : "text-legacy-purple"}`}>
                        {(activeAssetData.fundingRate * 100).toFixed(4)}%
                      </span>
                    </div>
                    <div className="bg-legacy-bg/60 p-2 rounded border border-legacy-border/40 font-mono">
                      <span className="text-[9px] text-legacy-muted block uppercase">OPEN INTEREST</span>
                      <span className="text-xs font-bold text-white tracking-tight">
                        {formatCurrency(activeAssetData.openInterest, true)}
                      </span>
                    </div>
                  </div>

                  {/* 24h Liquidations stats */}
                  <div className="space-y-2 pt-1 font-mono">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-legacy-muted uppercase">LIQUIDACIONES (24H)</span>
                      <span className="text-white font-bold">{formatCurrency(activeAssetData.liquidations24h?.totalUsd || 0, true)}</span>
                    </div>
                    
                    {/* Horizontal gauge long vs short liquidations */}
                    <div className="space-y-1">
                      <div className="h-2.5 w-full rounded bg-[#10171f] flex overflow-hidden border border-legacy-border/60">
                        <div 
                          style={{ 
                            width: `${((activeAssetData.liquidations24h?.longUsd || 50) / (activeAssetData.liquidations24h?.totalUsd || 100)) * 100}%` 
                          }} 
                          className="bg-legacy-success hover:opacity-85 transition-all"
                          title={`Longs Liquidated: ${formatCurrency(activeAssetData.liquidations24h?.longUsd || 0, true)}`}
                        ></div>
                        <div 
                          style={{ 
                            width: `${((activeAssetData.liquidations24h?.shortUsd || 50) / (activeAssetData.liquidations24h?.totalUsd || 100)) * 100}%` 
                          }} 
                          className="bg-legacy-purple hover:opacity-85 transition-all"
                          title={`Shorts Liquidated: ${formatCurrency(activeAssetData.liquidations24h?.shortUsd || 0, true)}`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[8px] text-legacy-muted">
                        <span className="text-legacy-success font-bold">LONGS: {formatCurrency(activeAssetData.liquidations24h?.longUsd || 0, true)}</span>
                        <span className="text-legacy-purple font-bold">SHORTS: {formatCurrency(activeAssetData.liquidations24h?.shortUsd || 0, true)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 3: Sentimiento Global / Fear & Greed */}
                <div className="bg-legacy-card border border-legacy-border p-4 rounded-lg flex flex-col relative font-mono overflow-hidden group hover:shadow-[0_0_15px_rgba(3,225,255,0.06)] transition-all duration-300">
                  {/* Cyberpunk corner lines */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-legacy-cyan/60"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-legacy-cyan/60"></div>

                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase font-mono tracking-wider rounded-bl-lg">
                    Global_Sentiment
                  </div>
                  <h2 className="text-xs text-legacy-muted font-bold tracking-wider mb-2 uppercase flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-legacy-cyan" />
                    ÍNDICE DE MIEDO Y CODICIA
                  </h2>

                  <div className="flex items-center gap-4 bg-legacy-bg/50 p-2.5 rounded border border-legacy-border/40 mt-1">
                    <div className="relative w-14 h-14 flex items-center justify-center border-2 border-legacy-border rounded-full bg-legacy-bg">
                      <span className="text-lg font-bold font-goldman text-legacy-cyan">
                        {marketData?.fearAndGreed?.value ?? "72"}
                      </span>
                      {/* Stylized small dial indicator */}
                      <div 
                        style={{ transform: `rotate(${(marketData?.fearAndGreed?.value ?? 72) * 1.8}deg)` }} 
                        className="absolute w-1 h-6 top-1 origin-bottom transition-all duration-1000 bg-legacy-cyan/40 rounded"
                      ></div>
                    </div>
                    <div>
                      <span className="text-[10px] text-legacy-muted block uppercase">DIAGNOSTICO COLECTIVO</span>
                      <span className="text-sm font-bold text-legacy-whale uppercase font-goldman tracking-wide block">
                        {marketData?.fearAndGreed?.classification ?? "Codicia"}
                      </span>
                      <span className="text-[9px] text-legacy-muted leading-tight block mt-0.5">Métrica del sentimento público de mercado.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* CENTER CONSOLE: Heatmap visualization, Liquidity Pools (xl:span-5) */}
              <section className="xl:col-span-5 flex flex-col gap-4">
                
                {/* Panel 4: Mapa de Calor de Liquidez y Bloques de Orden (Visualizer) */}
                <div className="bg-legacy-card border border-legacy-border p-4 rounded-lg flex flex-col flex-1 relative min-h-[420px] overflow-hidden group hover:shadow-[0_0_15px_rgba(3,225,255,0.06)] transition-all duration-300">
                  {/* Cyberpunk corner lines */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-legacy-cyan/60"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-legacy-cyan/60"></div>

                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase font-mono tracking-wider rounded-bl-lg">
                    Liquidity_Heatmap
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3 border-b border-legacy-border/50 pb-2">
                    <div>
                      <h2 className="text-xs text-legacy-muted font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-legacy-cyan animate-pulse" />
                        MAPA DE CALOR DE LIQUIDEZ Y POZOS (CFDS)
                      </h2>
                      <p className="text-[10px] text-legacy-muted font-sans mt-0.5">Niveles con alta concentración de órdenes esperando en broker exness</p>
                    </div>
                    <button 
                      onClick={() => {
                        fetchMarketData();
                        playBeep(950, 0.08, "sine", muted);
                        addTerminalLog(`Comando de refresco manual ejecutado sobre market API.`);
                      }}
                      className="text-[10px] font-mono border border-legacy-cyan/50 hover:border-legacy-cyan hover:bg-legacy-cyan/15 text-legacy-cyan px-2 py-1 rounded transition-all flex items-center gap-1 active:scale-95"
                    >
                      <RefreshCw className="w-3 h-3" />
                      REFRESCAR SENSORES
                    </button>
                  </div>

                  {/* Liquidity Heatmap Visual Ladder */}
                  <div className="flex-1 flex flex-col justify-between font-mono py-1 space-y-1 bg-legacy-bg/40 p-2 rounded border border-legacy-border/40">
                    
                    {/* Top Asks (Resistencias / Venta) - Purple */}
                    <div className="space-y-1">
                      {activeAssetData.heatmapLiquidity?.filter((x: any) => x.type === "ASK").map((item: any, i: number) => {
                        return (
                          <div key={i} className="flex items-center text-xs justify-between group py-0.5">
                            <span className="text-rose-400 font-bold w-16">${item.price.toLocaleString()}</span>
                            <div className="flex-1 px-4">
                              {/* Glowing progress bar bar indicator */}
                              <div className="h-4 w-full bg-[#1b0d1e] rounded relative overflow-hidden border border-rose-950/40">
                                <div 
                                  style={{ width: `${item.strength}%` }}
                                  className="h-full bg-gradient-to-r from-legacy-purple/15 to-legacy-purple transition-all duration-500"
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-end pr-2 text-[8px] text-[#9945ff] font-bold">
                                  {formatCurrency(item.volumeUsd, true)} (Fuerza: {item.strength}%)
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] text-[#9945ff] font-bold uppercase w-12 text-right hidden md:inline">ASK</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* CURRENT PRICE INDICATOR (Equilibrium zone) */}
                    <div className="relative py-2 border-y border-legacy-cyan/20 bg-legacy-cyan/5 my-1 rounded text-center overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(3,225,255,0.08),transparent)] animate-[pulse_2s_infinite]"></div>
                      <div className="relative flex justify-between px-3 items-center">
                        <span className="text-[9px] text-legacy-cyan font-bold tracking-widest uppercase">ZONA DE EQUILIBRIO PRECIO ACTUAL</span>
                        <span className="text-sm font-goldman font-bold text-white glow-text-cyan">
                          ${activeAssetData.price.toLocaleString()} USD
                        </span>
                        <span className="text-[9px] text-legacy-cyan font-bold tracking-widest uppercase hidden md:inline">SPREAD CFDS OK</span>
                      </div>
                    </div>

                    {/* Bottom Bids (Soportes / Compra) - Cyan */}
                    <div className="space-y-1">
                      {activeAssetData.heatmapLiquidity?.filter((x: any) => x.type === "BID").map((item: any, i: number) => {
                        return (
                          <div key={i} className="flex items-center text-xs justify-between group py-0.5">
                            <span className="text-legacy-success font-bold w-16">${item.price.toLocaleString()}</span>
                            <div className="flex-1 px-4">
                              {/* Glowing progress bar bar indicator */}
                              <div className="h-4 w-full bg-[#071922] rounded relative overflow-hidden border border-cyan-950/40">
                                <div 
                                  style={{ width: `${item.strength}%` }}
                                  className="h-full bg-gradient-to-r from-legacy-cyan/15 to-legacy-cyan transition-all duration-500"
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-end pr-2 text-[8px] text-legacy-cyan font-bold">
                                  {formatCurrency(item.volumeUsd, true)} (Fuerza: {item.strength}%)
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] text-legacy-cyan font-bold uppercase w-12 text-right hidden md:inline">BID</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pools of Liquidity analysis badges */}
                  <div className="mt-3 space-y-2">
                    <span className="text-[9px] text-legacy-muted uppercase font-mono block">Pozos de Liquidez (Liquidation Clusters) Acechando</span>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                      {activeAssetData.liquidityPools?.map((pool: any, i: number) => {
                        const isLongPool = pool.type === "LONG_LIQ_POOL";
                        return (
                          <div 
                            key={i} 
                            onClick={() => {
                              const macroText = `¿Qué opinas del pozo de liquidez a nivel de precio $${pool.price} USD para ${selectedAsset} valorado en ${formatCurrency(pool.sizeUsd)}?`;
                              triggerMacro(macroText);
                            }}
                            className={`p-2 rounded border cursor-pointer hover:bg-legacy-bg transition-all ${
                              isLongPool 
                                ? "border-legacy-success/30 bg-[#14f195]/5 hover:border-legacy-success" 
                                : "border-legacy-purple/30 bg-[#9945ff]/5 hover:border-legacy-purple"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className={`font-bold uppercase ${isLongPool ? "text-legacy-success" : "text-legacy-purple"}`}>
                                {isLongPool ? "POOL DE LONGS" : "POOL DE SHORTS"}
                              </span>
                              <ExternalLink className="w-3 h-3 text-legacy-muted" />
                            </div>
                            <div className="flex justify-between items-baseline text-white">
                              <span className="text-sm font-bold font-goldman">${pool.price.toLocaleString()}</span>
                              <span className="text-[9px] text-legacy-muted font-sans font-medium">{formatCurrency(pool.sizeUsd, true)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Panel 5: Logs Operacionales y Consola Local */}
                <div className="bg-legacy-card border border-legacy-border p-4 rounded-lg flex flex-col relative h-[180px] font-mono text-xs overflow-hidden group hover:shadow-[0_0_15px_rgba(3,225,255,0.06)] transition-all duration-300">
                  {/* Cyberpunk corner lines */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-legacy-cyan/60"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-legacy-cyan/60"></div>

                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase tracking-wider rounded-bl-lg">
                    Console_Auditor
                  </div>
                  <h2 className="text-[10px] text-legacy-muted font-bold tracking-wider mb-2 uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-legacy-cyan" />
                    CONSOLA DE AUDITORÍA Y SEGURIDAD LOCAL
                  </h2>
                  <div className="flex-1 bg-legacy-bg/80 border border-legacy-border/50 p-2 rounded overflow-y-auto space-y-1 select-none font-mono text-[9px] leading-relaxed text-legacy-muted text-left">
                    {terminalLogs.map((log, i) => (
                      <div key={i} className="hover:text-white transition-colors duration-200">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* RIGHT PANEL: AI Terminal Chat and Commands (xl:span-4) */}
              <section className="xl:col-span-4 flex flex-col gap-4">
                
                {/* Panel 6: Terminal IA de Inteligencia Asistida */}
                <div className="bg-legacy-card border border-legacy-border rounded-lg flex flex-col flex-1 relative min-h-[500px] overflow-hidden group hover:shadow-[0_0_15px_rgba(3,225,255,0.06)] transition-all duration-300">
                  {/* Cyberpunk corner lines */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-legacy-cyan/60"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-legacy-cyan/60"></div>
                  
                  {/* Tech Corner Header */}
                  <div className="p-4 border-b border-legacy-border flex justify-between items-center bg-[#0a0f14] rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-legacy-cyan/10 border border-legacy-cyan flex items-center justify-center glow-cyan">
                        <Bot className="w-4 h-4 text-legacy-cyan animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold font-goldman tracking-wider uppercase">KLOPPER INTEL ASSIST</h2>
                        <span className="text-[9px] text-legacy-muted font-mono block">CONEXIÓN: GEMINI 3.5 FLASH DE COMANDO</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setChatMessages([
                          {
                            id: "clear",
                            sender: "system",
                            text: "⚡ [SISTEMA]: Memoria de canal local purgada. Terminal lista para nuevas directivas estratégicas.",
                            timestamp: new Date().toLocaleTimeString()
                          }
                        ]);
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("klopper_chat_history");
                        }
                        playBeep(440, 0.08, "triangle", muted);
                        addTerminalLog("Historial de chat borrado.");
                      }}
                      className="text-[9px] border border-legacy-border hover:border-rose-500/50 hover:bg-rose-950/20 text-legacy-muted hover:text-rose-400 px-2 py-1 rounded transition-all font-mono active:scale-95"
                      title="Reiniciar chat"
                    >
                      VACIAR CHAT
                    </button>
                  </div>

                  {/* Chat scrolling feed */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[360px] min-h-[300px]">
                    <AnimatePresence initial={false}>
                      {chatMessages.map((msg) => {
                        const isUser = msg.sender === "user";
                        const isSystem = msg.sender === "system";
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 text-[9px] text-legacy-muted font-mono">
                              {isUser ? (
                                <>
                                  <span className="text-[#a4b4c4] font-bold uppercase">{operatorName}</span>
                                  <User className="w-3 h-3 text-legacy-purple" />
                                </>
                              ) : isSystem ? (
                                <>
                                  <Shield className="w-3 h-3 text-legacy-success" />
                                  <span className="text-legacy-success font-bold">ALERTA SISTEMA</span>
                                </>
                              ) : (
                                <>
                                  <Bot className="w-3 h-3 text-legacy-cyan" />
                                  <span className="text-legacy-cyan font-bold">KLOPPER_INTEL_SINTESIS</span>
                                </>
                              )}
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                            </div>

                            <div 
                              className={`p-3 rounded-lg text-xs leading-relaxed max-w-[90%] whitespace-pre-wrap text-left font-mono ${
                                isUser 
                                  ? "bg-legacy-cyan/10 border border-legacy-cyan/40 text-[#f1f5f9]" 
                                  : isSystem 
                                    ? "bg-amber-950/25 border border-amber-900/50 text-amber-300 font-sans"
                                    : "bg-legacy-bg border border-legacy-border text-[#f1f5f9] leading-relaxed shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
                              }`}
                            >
                              {msg.text}
                              {msg.image && (
                                <div className="mt-2 border border-legacy-cyan/30 rounded overflow-hidden max-w-[150px] relative">
                                  <img src={msg.image} alt="Sube" className="w-full h-auto opacity-70" />
                                  <div className="absolute inset-0 bg-legacy-cyan/10 mix-blend-overlay"></div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {isAiTyping && (
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1 mb-1 text-[9px] text-legacy-cyan font-mono animate-pulse">
                          <Bot className="w-3 h-3 text-legacy-cyan animate-spin" />
                          <span>IA DE COMANDO PROCESANDO TRANSMISIÓN...</span>
                        </div>
                        <div className="bg-legacy-bg border border-legacy-border p-3 rounded-lg text-xs flex gap-1.5 items-center">
                          <span className="w-2 h-2 rounded-full bg-legacy-cyan animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-2 h-2 rounded-full bg-legacy-cyan animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-2 h-2 rounded-full bg-legacy-cyan animate-bounce"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Precooked Macros prompt buttons for efficient operations */}
                  <div className="px-4 py-2 border-t border-legacy-border/50 bg-[#0a1118]/40 space-y-1.5 text-left select-none">
                    <span className="text-[9px] text-legacy-muted font-mono block uppercase">Acciones Tácticas Rápidas (Macros)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "🔍 Soporte de Liquidez", p: `Analiza los soportes de liquidez más fuertes que observas en el sensor para ${selectedAsset}. ¿Dónde se ubica la gran mano institucional?` },
                        { label: "🐋 Accumulaciones", p: "Analiza los movimientos de transferencia de ballenas reportados en las últimas horas. ¿Están acumulando o volcando liquidez a los exchanges?" },
                        { label: "📈 Tasas Funding & OI", p: `Analiza la relación de la Tasa de Financiación (Funding Rate) y el Interés Abierto (Open Interest) para ${selectedAsset}. ¿Indica un estrangulamiento de shorts (short squeeze)?` },
                        { label: "🛡️ Mapa de Zonas", p: `Genera un informe rápido de mitigación y Order Blocks clave para el trading de CFDs con ${selectedAsset} hoy.` }
                      ].map((mac, i) => (
                        <button
                          key={i}
                          onClick={() => triggerMacro(mac.p)}
                          className="bg-legacy-bg hover:bg-legacy-cyan/15 border border-legacy-border hover:border-legacy-cyan/50 text-[10px] text-[#ccd6f6] hover:text-legacy-cyan px-2 py-1 rounded transition-all font-mono select-none active:scale-95"
                        >
                          {mac.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Screenshot drop panel simulation */}
                  <div className="px-4 py-2 border-t border-legacy-border/50 bg-[#0a0f14] flex flex-col text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-legacy-muted font-mono uppercase">SUBIDA DE CAPTURAS DE TRADING EXNESS (SIMULADA / REAL)</span>
                      {attachedImage && (
                        <button onClick={clearAttachedImage} className="text-[8px] text-rose-400 font-bold hover:underline">
                          [ QUITAR ]
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        ref={fileInputRef} 
                        className="hidden" 
                      />
                      
                      <button 
                        onClick={() => {
                          fileInputRef.current?.click();
                          playBeep(600, 0.05, "sine", muted);
                        }}
                        className="border border-dashed border-legacy-border hover:border-legacy-cyan/50 bg-legacy-bg/80 text-[10px] py-1.5 px-3 rounded flex items-center gap-1 hover:text-legacy-cyan transition-colors font-mono active:scale-95 cursor-pointer text-left"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Suministrar captura</span>
                      </button>

                      {/* Helper simulation links to feed realistic trading screenshot cases without real local file hassle */}
                      <div className="flex gap-1">
                        <button 
                          onClick={() => loadSimulatedChart("liquidez")}
                          className="bg-[#12222d] hover:bg-[#193244] text-[9px] text-legacy-cyan border border-legacy-cyan/30 px-1.5 py-1 rounded font-mono"
                          title="Simular subida de captura de liquidez"
                        >
                          Simular Captura Exness
                        </button>
                      </div>
                    </div>

                    {attachedFileName && (
                      <div className="text-[9px] text-legacy-success font-mono mt-1.5 flex items-center gap-1 bg-[#14f195]/5 p-1 rounded border border-legacy-success/20">
                        <CheckCircle2 className="w-3 h-3 text-legacy-success shrink-0" />
                        <span className="truncate">Cargado: {attachedFileName} (Listo para enviar al presionar &quot;Analizar&quot;)</span>
                      </div>
                    )}
                  </div>

                  {/* Input area */}
                  <div className="p-4 border-t border-legacy-border bg-[#0a0f14] rounded-b-lg">
                    <div className="relative">
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={2}
                        className="w-full bg-legacy-bg border border-legacy-border p-3 pr-12 rounded text-xs text-white placeholder-legacy-muted focus:border-legacy-cyan focus:outline-none focus:ring-1 focus:ring-legacy-cyan/50 font-sans resize-none"
                        placeholder="Escriba consulta técnica o cargue gráfico exness (e.g., '¿Hay piscina de liquidez institucional en $3,050 ETH?'). Enter para transmitir."
                      />
                      <button 
                        onClick={() => handleSendMessage()}
                        disabled={isAiTyping || (!userInput.trim() && !attachedImage)}
                        className="absolute right-2.5 bottom-2.5 bg-legacy-cyan hover:bg-legacy-cyan/80 text-black p-2 rounded transition-all disabled:opacity-40 disabled:hover:bg-legacy-cyan active:scale-95"
                        title="Enviar"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* BOTTOM PANEL: Whale tracker logs (xl:span-12 full width) */}
              <section className="xl:col-span-12 font-mono">
                <div className="bg-legacy-card border border-legacy-border p-4 rounded-lg flex flex-col relative">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase font-mono tracking-wider rounded-bl-lg">
                    Whale_Detector
                  </div>
                  
                  {/* Header & filters */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-legacy-border/50 pb-3 mb-3">
                    <div className="text-left">
                      <h2 className="text-xs text-[#FCEE0C] font-bold tracking-wider uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-legacy-whale animate-pulse" />
                        RADAR DE BALLENAS: MOVIMIENTOS ON-CHAIN DE GRAN ESCALA
                      </h2>
                      <p className="text-[10px] text-legacy-muted">Transacciones de volumen crítico captadas directamente de las redes Bitcoin, Ethereum, BNB Smart Chain y Solana</p>
                    </div>

                    {/* Filter bars */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-legacy-muted text-[10px] uppercase">FILTRAR ACTIVOS:</span>
                      <div className="flex bg-legacy-bg rounded p-0.5 border border-legacy-border">
                        {["ALL", "BTC", "ETH", "BNB", "SOL"].map((tk) => (
                          <button
                            key={tk}
                            onClick={() => {
                              setWhaleFilterAsset(tk);
                              playBeep(700, 0.04, "sine", muted);
                            }}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all uppercase ${
                              whaleFilterAsset === tk 
                                ? "bg-legacy-cyan text-black" 
                                : "text-legacy-muted hover:text-white"
                            }`}
                          >
                            {tk}
                          </button>
                        ))}
                      </div>

                      <span className="text-legacy-muted text-[10px] uppercase ml-2">VALOR MIN:</span>
                      <select
                        value={minWhaleValue}
                        onChange={(e) => {
                          setMinWhaleValue(Number(e.target.value));
                          playBeep(700, 0.04, "sine", muted);
                        }}
                        className="bg-legacy-bg border border-legacy-border text-white rounded p-1 text-[10px] uppercase font-bold focus:outline-none focus:border-legacy-cyan"
                      >
                        <option value={0}>Todos ({">"} $500K)</option>
                        <option value={1000000}>{">"} $1.0M USD</option>
                        <option value={3000000}>{">"} $3.0M USD</option>
                        <option value={5000000}>{">"} $5.0M USD</option>
                      </select>
                    </div>
                  </div>

                  {/* Whale Transaction Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#ccd6f6]">
                      <thead>
                        <tr className="border-b border-legacy-border text-legacy-muted uppercase text-[9px] font-bold tracking-wider">
                          <th className="py-2 px-3">ACTIVO</th>
                          <th className="py-2 px-3">VOLUMEN</th>
                          <th className="py-2 px-3">VALOR USD</th>
                          <th className="py-2 px-3">TIPO</th>
                          <th className="py-2 px-3">DESDE (ORIGEN)</th>
                          <th className="py-2 px-3">HACIA (DESTINO)</th>
                          <th className="py-2 px-3 hidden md:table-cell">TX HASH</th>
                          <th className="py-2 px-3">HORA UTC</th>
                          <th className="py-2 px-3 text-right">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-legacy-border/30">
                        {filteredWhaleTransactions.length > 0 ? (
                          filteredWhaleTransactions.map((tx: any, idx: number) => {
                            const isDump = tx.type === "DUMP";
                            const isAccum = tx.type === "ACCUMULATION";
                            
                            return (
                              <tr 
                                key={idx} 
                                className="hover:bg-legacy-bg/40 transition-colors group align-middle"
                              >
                                <td className="py-2.5 px-3 font-bold">
                                  <span className={`inline-flex items-center gap-1.5 ${getAssetColor(tx.coin)}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                    {tx.coin}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-goldman text-white font-bold">
                                  {tx.amount.toLocaleString()} {tx.coin}
                                </td>
                                <td className="py-2.5 px-3 text-legacy-whale font-bold">
                                  ${(tx.valueUsd / 1000000).toFixed(2)}M
                                </td>
                                <td className="py-2.5 px-3 font-bold">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                                    isDump 
                                      ? "bg-red-950/40 text-red-400 border border-red-900/40" 
                                      : isAccum 
                                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                                        : "bg-blue-950/40 text-blue-400 border border-blue-900/40"
                                  }`}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-sans truncate max-w-[120px]" title={tx.fromAddr}>
                                  {tx.from}
                                </td>
                                <td className="py-2.5 px-3 font-sans truncate max-w-[120px]" title={tx.toAddr}>
                                  {tx.to}
                                </td>
                                <td className="py-2.5 px-3 text-[10px] hidden md:table-cell">
                                  <a 
                                    href={
                                      tx.coin === "SOL" 
                                        ? `https://solscan.io/tx/${tx.txHash}` 
                                        : tx.coin === "BTC" 
                                          ? `https://mempool.space/tx/${tx.txHash}` 
                                          : tx.coin === "BNB" 
                                            ? `https://bscscan.io/tx/${tx.txHash}` 
                                            : `https://etherscan.io/tx/${tx.txHash}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => playBeep(850, 0.05, "sine", muted)}
                                    className="text-legacy-cyan hover:underline hover:text-white transition-colors duration-200 inline-flex items-center gap-1 font-mono font-bold"
                                    title={`Ver transacción de ${tx.coin} en el explorador on-chain`}
                                  >
                                    <span>
                                      {tx.txHash && tx.txHash.length > 15 
                                        ? `${tx.txHash.substring(0, 6)}...${tx.txHash.slice(-4)}` 
                                        : tx.txHash}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-legacy-cyan shrink-0" />
                                  </a>
                                </td>
                                <td className="py-2.5 px-3 text-legacy-muted text-[10px]">
                                  {new Date(tx.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <button 
                                    onClick={() => handleAnalyzeWhaleTx(tx)}
                                    className="text-[9px] border border-legacy-cyan/50 hover:border-legacy-cyan text-legacy-cyan bg-legacy-cyan/5 hover:bg-legacy-cyan/20 px-2 py-0.5 rounded transition-all uppercase font-bold active:scale-95"
                                  >
                                    Analizar
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={9} className="py-4 text-center text-legacy-muted uppercase text-[10px]">
                              No se encontraron transacciones de gran escala bajo este criterio de filtro.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

                    </motion.div>
                  )}

                  {activeView === "perfil" && (
                    <motion.div
                      key="perfil"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full max-w-4xl mx-auto space-y-6 font-mono text-left"
                    >
                      {/* Header card */}
                      <div className="bg-legacy-card border border-legacy-border p-6 rounded-lg relative glow-cyan">
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase tracking-wider rounded-bl-lg">
                          Operator_Profile
                        </div>
                        
                        <h2 className="text-sm text-legacy-cyan font-bold tracking-wider uppercase mb-1 flex items-center gap-1.5 font-goldman">
                          <User className="w-4 h-4" />
                          CENTRAL DE PERFIL & CONFIGURACIÓN DE INTERFAZ
                        </h2>
                        <p className="text-xs text-legacy-muted mb-6">Ajuste las credenciales de operador local y sincronice el espectro de colores de la terminal klopper.</p>

                        <div className="space-y-6">
                          {/* Name Input Block */}
                          <div className="space-y-2 text-left">
                            <label className="block text-xs font-bold text-white uppercase">ID / NOMBRE DEL OPERADOR</label>
                            <div className="flex gap-3 max-w-md">
                              <input 
                                type="text" 
                                value={operatorName}
                                onChange={(e) => {
                                  const newName = e.target.value.substring(0, 15);
                                  setOperatorName(newName);
                                  if (typeof window !== "undefined") localStorage.setItem("klopper_operator_name", newName);
                                }}
                                className="flex-1 bg-legacy-bg border border-legacy-border p-2.5 rounded text-white text-xs font-mono focus:border-legacy-cyan focus:outline-none focus:ring-1 focus:ring-legacy-cyan/50"
                                placeholder="Introduce tu nombre"
                                maxLength={15}
                              />
                              <button 
                                onClick={() => {
                                  playBeep(900, 0.08, "sine", muted);
                                  addTerminalLog(`Nombre de operador actualizado a: "${operatorName}"`);
                                }}
                                className="bg-legacy-cyan hover:bg-legacy-cyan/80 text-black px-4 py-2 rounded text-xs font-goldman font-bold uppercase active:scale-95 transition-all"
                              >
                                Guardar
                              </button>
                            </div>
                            <span className="text-[10px] text-legacy-muted block">Este nombre reemplazará su ID en la consola, transmisiones de chat y cabeceras de sistema.</span>
                          </div>

                          <hr className="border-legacy-border/50" />

                          {/* Theme Picker Block */}
                          <div className="space-y-3 text-left">
                            <label className="block text-xs font-bold text-white uppercase">SELECCIÓN DE ESPECTRO TÁCTICO (TEMA NEON)</label>
                            <p className="text-[10px] text-legacy-muted">Cambie instantáneamente las líneas, bordes, tarjetas y firmas de la terminal para adaptarse a su modo operativo:</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                              {[
                                { id: "green", name: "Verde Neon", color: "#14F195", desc: "Espectro Ecológico Alta Frecuencia" },
                                { id: "blue", name: "Azul Neon", color: "#03E1FF", desc: "Espectro de Enlace Ciber_Cian" },
                                { id: "red", name: "Rojo Neon", color: "#FF3131", desc: "Espectro de Alerta y Sobrecarga" },
                                { id: "pink", name: "Rosa Neon", color: "#FF007F", desc: "Firma Cuántica Magma_Rosa" },
                                { id: "purple", name: "Morado Neon", color: "#9945FF", desc: "Espectro de Encriptación Espacial" },
                                { id: "silver", name: "Plata Neon", color: "#E2E8F0", desc: "Espectro Neutro de Titanio Blanco" }
                              ].map((theme) => {
                                const isSelected = themeColor === theme.id;
                                return (
                                  <button
                                    key={theme.id}
                                    onClick={() => {
                                      setThemeColor(theme.id as any);
                                      if (typeof window !== "undefined") localStorage.setItem("klopper_theme_color", theme.id);
                                      playBeep(800 + (theme.id === "green" ? 50 : theme.id === "blue" ? 100 : 150), 0.08, "sine", muted);
                                      addTerminalLog(`Kernel de interfaz cambiado a: espectro ${theme.name.toUpperCase()}`);
                                    }}
                                    className={`flex flex-col items-start p-4 rounded-lg border transition-all relative text-left select-none cursor-pointer active:scale-95 ${
                                      isSelected 
                                        ? "bg-[#0d131a] shadow-[0_0_15px_rgba(3,225,255,0.15)]" 
                                        : "bg-[#080c10]/50 border-legacy-border hover:bg-[#0d131a]/50"
                                    }`}
                                    style={{
                                      borderColor: isSelected ? theme.color : undefined
                                    }}
                                  >
                                    {/* Visual color dot */}
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <span 
                                        className="w-3 h-3 rounded-full animate-pulse"
                                        style={{ 
                                          backgroundColor: theme.color,
                                          boxShadow: `0 0 8px ${theme.color}`
                                        }}
                                      ></span>
                                      <span 
                                        className="font-bold text-xs text-white"
                                        style={{ color: isSelected ? theme.color : "#fff" }}
                                      >
                                        {theme.name}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-[#94a3b8] leading-normal">{theme.desc}</span>
                                    
                                    {isSelected && (
                                      <div 
                                        className="absolute bottom-0 right-0 px-1.5 py-0.5 text-[8px] font-bold text-black uppercase"
                                        style={{ backgroundColor: theme.color }}
                                      >
                                        ACTIVO
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeView === "chart" && (
                    <motion.div
                      key="chart"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full space-y-4 font-mono text-left"
                    >
                      {/* Chart container card */}
                      <div className="bg-legacy-card border border-legacy-border p-4 rounded-lg relative flex flex-col w-full">
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-legacy-border text-legacy-muted text-[9px] uppercase tracking-wider rounded-bl-lg">
                          Tactical_Charts
                        </div>

                        {/* Controls Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-legacy-border/50 pb-3 mb-4">
                          <div className="text-left">
                            <h2 className="text-xs text-legacy-cyan font-bold tracking-wider uppercase flex items-center gap-1.5 font-goldman">
                              <LineChart className="w-4 h-4" />
                              ESTADO DEL PRECIO EN TIEMPO REAL: {selectedAsset} / USD
                            </h2>
                            <p className="text-[10px] text-legacy-muted">Análisis técnico de CFDs sincronizado con feeds descentralizados</p>
                          </div>

                          {/* Selector buttons row */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {/* Asset selector */}
                            <div className="flex bg-legacy-bg rounded p-0.5 border border-legacy-border">
                              {["BTC", "ETH", "BNB", "SOL"].map((tk) => (
                                <button
                                  key={tk}
                                  onClick={() => {
                                    setSelectedAsset(tk);
                                    playBeep(700, 0.04, "sine", muted);
                                    addTerminalLog(`Gráfico: Cambiado análisis a ${tk}`);
                                  }}
                                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all uppercase ${
                                    selectedAsset === tk 
                                      ? "bg-legacy-cyan text-black" 
                                      : "text-legacy-muted hover:text-white"
                                  }`}
                                >
                                  {tk}
                                </button>
                              ))}
                            </div>

                            {/* Timeframe selector */}
                            <span className="text-[9px] text-legacy-muted uppercase ml-1">TF:</span>
                            <div className="flex bg-legacy-bg rounded p-0.5 border border-legacy-border">
                              {["5M", "15M", "1H", "4H"].map((tf) => (
                                <button
                                  key={tf}
                                  onClick={() => {
                                    setSelectedTimeframe(tf);
                                    playBeep(750, 0.04, "sine", muted);
                                    addTerminalLog(`Gráfico: Cambiado marco temporal a ${tf}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                    selectedTimeframe === tf 
                                      ? "bg-legacy-cyan text-black" 
                                      : "text-legacy-muted hover:text-white"
                                  }`}
                                >
                                  {tf}
                                </button>
                              ))}
                            </div>

                            {/* Chart type selector */}
                            <span className="text-[9px] text-legacy-muted uppercase ml-1">ESTILO:</span>
                            <div className="flex bg-legacy-bg rounded p-0.5 border border-legacy-border">
                              {[
                                { id: "line", label: "Líneas" },
                                { id: "candles", label: "Velas" }
                              ].map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => {
                                    setChartStyle(type.id as any);
                                    playBeep(800, 0.04, "sine", muted);
                                    addTerminalLog(`Gráfico: Cambiado estilo a ${type.label}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                    chartStyle === type.id 
                                      ? "bg-legacy-cyan text-black" 
                                      : "text-legacy-muted hover:text-white"
                                  }`}
                                >
                                  {type.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Realtime stats row */}
                        {(() => {
                          const activeAssetData = marketData?.assets?.[selectedAsset] || {
                            price: selectedAsset === "BTC" ? 92450.00 : selectedAsset === "ETH" ? 3120.00 : selectedAsset === "BNB" ? 580.00 : 210.00,
                            change24h: 1.5,
                            volume24h: 1200000000,
                            marketCap: 1800000000000
                          };
                          return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-legacy-bg/40 p-3 rounded border border-legacy-border/50 text-left">
                              <div>
                                <span className="text-[9px] text-legacy-muted block uppercase">Precio Actual</span>
                                <span className="text-base font-bold font-goldman text-white">
                                  {formatCurrency(activeAssetData.price)}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-legacy-muted block uppercase">Cambio (24H)</span>
                                <span className={`text-xs font-bold flex items-center gap-0.5 ${activeAssetData.change24h >= 0 ? "text-legacy-success" : "text-rose-400"}`}>
                                  {activeAssetData.change24h >= 0 ? "+" : ""}{activeAssetData.change24h}%
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-legacy-muted block uppercase">Volumen (24H)</span>
                                <span className="text-xs font-bold text-white font-mono">
                                  {formatCurrency(activeAssetData.volume24h, true)}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-legacy-muted block uppercase">Capitalización</span>
                                <span className="text-xs font-bold text-white font-mono">
                                  {formatCurrency(activeAssetData.marketCap || 1000000000, true)}
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Technical Chart Render Area */}
                        <div 
                          ref={containerRef} 
                          className="relative flex-1 min-h-[360px] bg-[#070b0f] border border-legacy-border/60 rounded p-4 flex items-center justify-center overflow-hidden"
                        >
                          {/* Background blueprint grid */}
                          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

                          {chartStyle === "line" ? (
                            /* Recharts Area Chart */
                            <div className="w-full h-[350px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={priceHistory[`${selectedAsset}_${selectedTimeframe}`] || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id="colorPriceMain" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={themeStyles[themeColor].primary} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={themeStyles[themeColor].primary} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="time" stroke="#847484" fontSize={9} tickLine={false} />
                                  <YAxis domain={['auto', 'auto']} stroke="#847484" fontSize={9} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#0d131a', borderColor: '#1e293b', color: '#fff', fontFamily: 'monospace', fontSize: 10 }}
                                    formatter={(val: any) => [`$${parseFloat(val).toLocaleString()}`, 'Precio']}
                                  />
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                                  <Area type="monotone" dataKey="price" stroke={themeStyles[themeColor].primary} fillOpacity={1} fill="url(#colorPriceMain)" strokeWidth={2} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            /* Technical SVG Candlestick Chart with interactive mouse hover info */
                            <div className="w-full h-[350px] relative select-none">
                              {(() => {
                                const points = priceHistory[`${selectedAsset}_${selectedTimeframe}`] || [];
                                if (points.length === 0) {
                                  return (
                                    <div className="text-legacy-muted text-xs uppercase animate-pulse flex items-center justify-center h-full">
                                      Sincronizando flujos de mercado...
                                    </div>
                                  );
                                }

                                const activeAssetData = marketData?.assets?.[selectedAsset] || {
                                  price: selectedAsset === "BTC" ? 92450.00 : selectedAsset === "ETH" ? 3120.00 : selectedAsset === "BNB" ? 580.00 : 210.00,
                                  change24h: 1.5,
                                  volume24h: 1200000000,
                                  marketCap: 1800000000000
                                };

                                const candles: any[] = [];
                                const currentPrice = activeAssetData.price;
                                const change24h = activeAssetData.change24h;

                                let price = currentPrice * (1 - (change24h / 100) * 0.4); 

                                for (let i = 0; i < points.length; i++) {
                                  const pt = points[i];
                                  const indexFactor = i / points.length;
                                  const wave = Math.sin(indexFactor * Math.PI * 3);
                                  const rand = ((i * 17) % 23) / 23 - 0.49;
                                  const changeCoeff = (wave * 0.35) + (rand * 0.45);
                                  
                                  const open = price;
                                  const close = (i === points.length - 1) ? currentPrice : price * (1 + changeCoeff / 100);
                                  const high = Math.max(open, close) * (1 + (Math.abs(rand) * 0.18 + 0.05) / 100);
                                  const low = Math.min(open, close) * (1 - (Math.abs(rand) * 0.18 + 0.05) / 100);

                                  candles.push({
                                    time: pt.time,
                                    open,
                                    close,
                                    high,
                                    low
                                  });
                                  price = close;
                                }

                                const width = chartDimensions.width;
                                const height = 320;
                                const paddingTop = 40;
                                const paddingBottom = 30;
                                const paddingLeft = 10;
                                const paddingRight = 75;

                                const lows = candles.map(c => c.low);
                                const highs = candles.map(c => c.high);
                                const minP = Math.min(...lows) * 0.9985;
                                const maxP = Math.max(...highs) * 1.0015;
                                const rangeP = maxP - minP || 1;

                                const priceToY = (val: number) => 
                                  height - paddingBottom - ((val - minP) / rangeP) * (height - paddingTop - paddingBottom);

                                const formatPriceLabel = (val: number) => {
                                  if (val >= 1000) return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                                  return `$${val.toFixed(2)}`;
                                };

                                const levels = 5;
                                const gridLines = [];
                                for (let i = 0; i < levels; i++) {
                                  const pValue = minP + (rangeP * (i / (levels - 1)));
                                  const yPos = priceToY(pValue);
                                  gridLines.push({ value: pValue, y: yPos });
                                }

                                const candleWidth = Math.max(2, Math.floor((width - paddingLeft - paddingRight) / candles.length) - 4);
                                const barSpacing = (width - paddingLeft - paddingRight) / candles.length;

                                const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const mouseX = e.clientX - rect.left - paddingLeft;
                                  if (mouseX < 0 || mouseX > width - paddingLeft - paddingRight) {
                                    setHoveredCandle(null);
                                    return;
                                  }
                                  
                                  const index = Math.min(candles.length - 1, Math.max(0, Math.floor(mouseX / barSpacing)));
                                  setHoveredCandle({
                                    ...candles[index],
                                    index,
                                    x: paddingLeft + (index + 0.5) * barSpacing
                                  });
                                };

                                const handleMouseLeave = () => {
                                  setHoveredCandle(null);
                                };

                                return (
                                  <div className="w-full h-full flex flex-col justify-between">
                                    <div className="h-6 flex items-center justify-between text-[10px] font-mono px-2 text-legacy-muted border-b border-legacy-border/30 bg-[#080c10]/40 rounded-t">
                                      {hoveredCandle ? (
                                        <div className="flex gap-4 font-mono font-bold text-left w-full">
                                          <span className="text-white uppercase">HORA: <span className="text-legacy-cyan">{hoveredCandle.time}</span></span>
                                          <span>O: <span className="text-white">{formatPriceLabel(hoveredCandle.open)}</span></span>
                                          <span>H: <span className="text-[#14f195]">{formatPriceLabel(hoveredCandle.high)}</span></span>
                                          <span>L: <span className="text-rose-400">{formatPriceLabel(hoveredCandle.low)}</span></span>
                                          <span>C: <span className={hoveredCandle.close >= hoveredCandle.open ? "text-[#14f195]" : "text-rose-400"}>{formatPriceLabel(hoveredCandle.close)}</span></span>
                                        </div>
                                      ) : (
                                        <div className="text-left font-mono">
                                          ⚡ PASE EL CURSOR POR EL GRÁFICO PARA INSPECCIONAR VELAS EXNESS
                                        </div>
                                      )}
                                    </div>

                                    <svg 
                                      width="100%" 
                                      height="290" 
                                      onMouseMove={handleMouseMove}
                                      onMouseLeave={handleMouseLeave}
                                      className="bg-transparent overflow-visible"
                                    >
                                      {gridLines.map((gl, idx) => (
                                        <g key={idx}>
                                          <line 
                                            x1={paddingLeft} 
                                            y1={gl.y} 
                                            x2={width - paddingRight} 
                                            y2={gl.y} 
                                            stroke="#1e293b" 
                                            strokeWidth={1} 
                                            strokeDasharray="4 4" 
                                            opacity={0.4} 
                                          />
                                          <text 
                                            x={width - paddingRight + 6} 
                                            y={gl.y + 3} 
                                            fill="#847484" 
                                            fontSize={9} 
                                            fontFamily="monospace"
                                            fontWeight="bold"
                                            textAnchor="start"
                                          >
                                            {formatPriceLabel(gl.value)}
                                          </text>
                                        </g>
                                      ))}

                                      {candles.map((c, idx) => {
                                        const x = paddingLeft + (idx + 0.5) * barSpacing;
                                        const yOpen = priceToY(c.open);
                                        const yClose = priceToY(c.close);
                                        const yHigh = priceToY(c.high);
                                        const yLow = priceToY(c.low);
                                        const isBullish = c.close >= c.open;
                                        
                                        const candleStrokeColor = isBullish ? "#14F195" : "#FF3131";
                                        const candleFillColor = isBullish ? "rgba(20, 241, 149, 0.25)" : "rgba(255, 49, 49, 0.25)";

                                        return (
                                          <g key={idx} className="group">
                                            <line 
                                              x1={x} 
                                              y1={yHigh} 
                                              x2={x} 
                                              y2={yLow} 
                                              stroke={candleStrokeColor} 
                                              strokeWidth={1.5} 
                                            />
                                            <rect 
                                              x={x - candleWidth / 2} 
                                              y={Math.min(yOpen, yClose)} 
                                              width={candleWidth} 
                                              height={Math.max(1, Math.abs(yOpen - yClose))} 
                                              fill={candleFillColor} 
                                              stroke={candleStrokeColor} 
                                              strokeWidth={1.5}
                                              rx={0.5}
                                              className="transition-all duration-300"
                                            />
                                          </g>
                                        );
                                      })}

                                      {hoveredCandle && (
                                        <g>
                                          <line 
                                            x1={hoveredCandle.x} 
                                            y1={40} 
                                            x2={hoveredCandle.x} 
                                            y2={height - 30} 
                                            stroke={themeStyles[themeColor].primary} 
                                            strokeWidth={1} 
                                            strokeDasharray="2 2" 
                                            opacity={0.8} 
                                          />
                                          <line 
                                            x1={paddingLeft} 
                                            y1={priceToY(hoveredCandle.close)} 
                                            x2={width - paddingRight} 
                                            y2={priceToY(hoveredCandle.close)} 
                                            stroke={themeStyles[themeColor].primary} 
                                            strokeWidth={1} 
                                            strokeDasharray="2 2" 
                                            opacity={0.6} 
                                          />
                                          <circle 
                                            cx={hoveredCandle.x} 
                                            cy={priceToY(hoveredCandle.close)} 
                                            r={4} 
                                            fill={themeStyles[themeColor].primary} 
                                            stroke="#080c10" 
                                            strokeWidth={1.5} 
                                          />
                                        </g>
                                      )}
                                    </svg>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Technical description details */}
                        <div className="mt-4 p-3 bg-[#0a0f14]/50 border border-legacy-border/50 rounded text-left text-[11px] text-[#ccd6f6] leading-relaxed flex items-start gap-2">
                          <Info className="w-4 h-4 text-legacy-cyan shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white uppercase block mb-1">LECTURA DE FLUJO DE LIQUIDEZ Y ACCIÓN DEL PRECIO</span>
                            <span>
                              El activo {selectedAsset} se encuentra operando en una estructura técnica de rango local con sesgo {activeAssetData?.change24h >= 0 ? "alcista" : "bajista"}. Se observan importantes grupos de órdenes límite esperándose en las cotizaciones aledañas, operando como Order Blocks dinámicos. Para ejecutar un análisis asistido por Inteligencia Artificial, puede consultar al asistente de IA en la pestaña &quot;Panel Táctico&quot;.
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info line */}
      <footer className="bg-[#040608] border-t border-legacy-border/80 px-4 py-2.5 flex flex-col md:flex-row justify-between items-center text-[10px] text-legacy-muted font-mono z-15 gap-2">
        <span>© 2026 LEGACY KLOPPER INTEL INC. TODOS LOS DERECHOS RESERVADOS.</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-legacy-cyan">
            <Shield className="w-3 h-3 text-legacy-cyan" />
            CIFRADO LOCAL ACTIVO
          </span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-help" title="Esta terminal opera 100% localmente para evitar telemetría de brokers o fugas on-chain.">MODO OPERATIVO: INTRANET PROTEGIDA</span>
        </div>
      </footer>

      {/* Screen LED Flash overlay */}
      <AnimatePresence>
        {screenFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`fixed inset-0 pointer-events-none z-50 mix-blend-screen ${
              screenFlash === "green" 
                ? "bg-gradient-to-b from-[#14f195]/20 to-[#14f195]/5 shadow-[inset_0_0_80px_#14f195]" 
                : "bg-gradient-to-b from-rose-500/20 to-rose-500/5 shadow-[inset_0_0_80px_#ef4444]"
            }`}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
