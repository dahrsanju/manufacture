// FlowSense Brand Configuration
export const brand = {
  name: "FlowSense",
  tagline: "Smart Manufacturing. Simplified.",
  description: "AI-Powered Enterprise Manufacturing ERP System",

  // Logo assets - using exact PNG files
  logo: "/branding/flowsense/logo-full.jpg", // Main logo (white on black)
  logoWhite: "/branding/flowsense/logo-full.jpg", // White version for dark backgrounds
  logoDark: "/branding/flowsense/logo-full.jpg",
  logoFull: "/branding/flowsense/logo-full.jpg",
  logoMark: "/branding/flowsense/favicon.png", // Small icon/favicon version

  // Favicon and app icons
  favicon: "/branding/flowsense/favicon.png",
  appleTouchIcon: "/branding/flowsense/apple-touch-icon.png",
  icon32: "/branding/flowsense/icon-32x32.png",
  icon16: "/branding/flowsense/icon-16x16.png",
  icon64: "/branding/flowsense/icon-64x64.png",

  // OG/Social images
  ogImage: "/branding/flowsense/og-default.png",

  // Brand colors
  colors: {
    primary: "#3B82F6", // FlowSense blue
    dark: "#0B0B0B",
    darkAlt: "#111827",
    white: "#ffffff",
  },

  // Contact/Support
  support: {
    email: "support@flowsense.io",
    phone: "+1 (800) 123-4567",
  },

  // Social links
  social: {
    twitter: "https://twitter.com/flowsense",
    linkedin: "https://linkedin.com/company/flowsense",
  },

  // App metadata
  meta: {
    title: "FlowSense – Smart Manufacturing. Simplified.",
    titleTemplate: "%s | FlowSense",
    keywords: ["manufacturing", "erp", "inventory", "production", "quality", "ai", "flowsense"],
  },
} as const;

export type Brand = typeof brand;
