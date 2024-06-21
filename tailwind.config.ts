import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const sidenavSizes = {
  "nav-narrow-width": "var(--nav-narrow-width)",
  "nav-medium-width": "var(--nav-medium-width)",
};

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      lg: "1264px",
    },
    extend: {
      flexGrow: {
        2: "2",
      },
      boxShadow: {
        ig: "0 4px 12px rgba(var(--web-always-black),.15)",
        "custom-bubble": "8px 14px 0 -6px var(--ig-bubble-background)",
        "custom-bubble-small": "3px 6px 0 -2px var(--ig-bubble-background)",
      },
      margin: {
        ...sidenavSizes,
      },
      width: {
        ...sidenavSizes,
      },
      maxWidth: {
        "lg-page": "935px",
      },
      colors: {
        "ig-blue": "#0095F6",
        "ig-blue-dark": "#00376B",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        badge: "rgb(var(--badge))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        white: "rgb(var(--web-always-white))",
        "hover-overlay": "rgba(var(--hover-overlay))",
        "banner-background": "rgb(var(--banner-background))",
        stroke: "rgb(var(--stroke))",
        "highlight-background": "rgb(var(--highlight-background))",
        "elevated-background": "rgb(var(--elevated-background))",
        "elevated-separator": "rgb(var(--elevated-separator))",
        "stroke-prism": "rgb(var(--stroke-prism))",
        "toggle-background-off-prism":
          "rgb(var(--toggle-background-off-prism))",
        "toggle-background-on-prism": "rgb(var(--toggle-background-on-prism))",
        "always-dark-overlay": "rgba(var(--always-dark-overlay))",
        "border-avatar": "rgba(var(--web-always-black),.0975)",
        "bubble-background": "rgb(var(--ig-bubble-background))",

        "ig-banner-background": "var(--ig-banner-background)",
        "web-always-black": "var(--web-always-black)",
        "ig-bubble-background": "var(--ig-bubble-background)",
        "system-20-font-size": "var(--system-20-font-size)",
        "system-20-line-height": "var(--system-20-line-height)",
        "ig-secondary-background": "var(--ig-secondary-background)",
        "font-family-system": "var(--font-family-system)",
        "ig-primary-text": "var(--ig-primary-text)",
        "system-12-font-size": "var(--system-12-font-size)",
        "ig-secondary-text": "var(--ig-secondary-text)",
        "web-always-white": "var(--web-always-white)",
        "font-weight-system-semibold": "var(--font-weight-system-semibold)",
        "system-14-line-height": "var(--system-14-line-height)",
        "ig-primary-button-hover": "var(--ig-primary-button-hover)",
        "ig-link": "var(--ig-link)",
        separator: {
          DEFAULT: "rgb(var(--separator))",
          post: "rgb(var(--separator-post))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          background: "rgb(var(--primary-background))",
          foreground: "hsl(var(--primary-foreground))",
          text: "rgb(var(--primary-text))",
          button: "rgb(var(--primary-button))",
          hover: "rgb(var(--primary-hover))",
          "link-hover": "rgb(var(--primary-link-hover))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          button: "rgb(var(--secondary-button))",
          text: "rgb(var(--secondary-text))",
          background: "rgb(var(--secondary-background))",
          foreground: "hsl(var(--secondary-foreground))",
          "button-background": "rgb(var(--secondary-button-background))",
        },
        "secondary-button-hover": {
          DEFAULT: "rgb(var(--secondary-button-hover))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addComponents }) {
      addComponents({
        ".debug": {
          border: "1px solid red",
        },
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
