import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
      maxWidth: {
        "lg-page": "935px",
      },
      boxShadow: {
        custom: "0 4px 12px rgba(var(--web-always-black), 0.15)",
      },
      colors: {
        chat: {
          "incoming-message-bubble-background-color":
            "rgb(var(--chat-outgoing-message-bubble-background-color))",
          "outgoing-message-bubble-background-color":
            "rgb(var(--chat-incoming-message-bubble-background-color))",
        },
        barcelona: {
          logo: "rgb(var(--barcelona-logo))",
          "primary-button": "rgb(var(--barcelona-primary-button))",
          "secondary-text": "rgb(var(--barcelona-secondary-text))",
        },
        post: {
          separator: "rgb(var(--post-separator))",
        },
        blue: {
          0: "rgb(var(--blue-0))",
          1: "rgb(var(--blue-1))",
          2: "rgb(var(--blue-2))",
          3: "rgb(var(--blue-3))",
          4: "rgb(var(--blue-4))",
          5: "rgb(var(--blue-5))",
          6: "rgb(var(--blue-6))",
          7: "rgb(var(--blue-7))",
          8: "rgb(var(--blue-8))",
          9: "rgb(var(--blue-9))",
        },
        cyan: {
          5: "rgb(var(--cyan-5))",
        },
        green: {
          4: "rgb(var(--green-4))",
          5: "rgb(var(--green-5))",
          6: "rgb(var(--green-6))",
        },
        grey: {
          0: "rgb(var(--grey-0))",
          1: "rgb(var(--grey-1))",
          2: "rgb(var(--grey-2))",
          3: "rgb(var(--grey-3))",
          4: "rgb(var(--grey-4))",
          5: "rgb(var(--grey-5))",
          6: "rgb(var(--grey-6))",
          7: "rgb(var(--grey-7))",
          8: "rgb(var(--grey-8))",
          9: "rgb(var(--grey-9))",
          10: "rgb(var(--grey-10))",
        },
        orange: {
          5: "rgb(var(--orange-5))",
        },
        pink: {
          5: "rgb(var(--pink-5))",
        },
        purple: {
          5: "rgb(var(--purple-5))",
        },
        red: {
          4: "rgb(var(--red-4))",
          5: "rgb(var(--red-5))",
          6: "rgb(var(--red-6))",
          7: "rgb(var(--red-7))",
        },
        yellow: {
          5: "rgb(var(--yellow-5))",
        },
        always: {
          "dark-overlays": "var(--always-dark-overlay)",
        },
        ig: {
          badge: "rgb(var(--ig-badge))",
          "avatar-border": "var(--avatar-border)",
          "banner-background": "rgb(var(--ig-banner-background))",
          "banner-highlight-background":
            "rgb(var(--ig-banner-highlight-background))",
          "bubble-background": "rgb(var(--ig-bubble-background))",
          "close-friends-refreshed": "rgb(var(--ig-close-friends-refreshed))",
          "disabled-action-text": "rgb(var(--ig-disabled-action-text))",
          "dropdown-background": "rgb(var(--ig-dropdown-background))",
          "elevated-background": "rgb(var(--ig-elevated-background))",
          "elevated-highlight-background":
            "rgb(var(--ig-elevated-highlight-background))",
          "elevated-separator": "rgb(var(--ig-elevated-separator))",
          "error-or-destructive": "rgb(var(--ig-error-or-destructive))",
          "facebook-blue": "rgb(var(--ig-facebook-blue))",
          "focus-stroke": "rgb(var(--ig-focus-stroke))",
          "highlight-background": "rgb(var(--ig-highlight-background))",
          "hover-overlay": "rgb(var(--ig-hover-overlay))",
          link: "rgb(var(--ig-link))",
          "live-badge": "rgb(var(--ig-live-badge))",
          "primary-background": "rgb(var(--ig-primary-background))",
          "primary-button": "rgb(var(--ig-primary-button))",
          "primary-button-hover": "rgb(var(--ig-primary-button-hover))",
          "primary-icon": "rgb(var(--ig-primary-icon))",
          "primary-text": "rgb(var(--ig-primary-text))",
          "secondary-background": "rgb(var(--ig-secondary-background))",
          "secondary-button": "rgb(var(--ig-secondary-button))",
          "secondary-button-background":
            "rgb(var(--ig-secondary-button-background))",
          "secondary-button-hover": "rgb(var(--ig-secondary-button-hover))",
          "secondary-icon": "rgb(var(--ig-secondary-icon))",
          "secondary-text": "rgb(var(--ig-secondary-text))",
          separator: "rgb(var(--ig-separator))",
          stroke: "rgba(var(--ig-stroke), <alpha-value>)",
          "stroke-on-media": "rgb(var(--ig-stroke-on-media))",
          "subscribers-only": "rgb(var(--ig-subscribers-only))",
          success: "rgb(var(--ig-success))",
          "temporary-highlight": "rgb(var(--ig-temporary-highlight))",
          "tertiary-button-background":
            "rgb(var(--ig-tertiary-button-background))",
          "tertiary-button-border": "rgb(var(--ig-tertiary-button-border))",
          "tertiary-button-hover": "rgb(var(--ig-tertiary-button-hover))",
          "tertiary-button-text": "rgb(var(--ig-tertiary-button-text))",
          "tertiary-icon": "rgb(var(--ig-tertiary-icon))",
          "tertiary-text": "rgb(var(--ig-tertiary-text))",
          "text-on-color": "rgb(var(--ig-text-on-color))",
          "text-on-media": "rgb(var(--ig-text-on-media))",
        },
        web: {
          "always-black": "rgb(var(--web-always-black))",
          "always-white": "rgb(var(--web-always-white))",
          "overlay-on-media": "rgb(var(--web-overlay-on-media))",
          "secondary-action": "rgb(var(--web-secondary-action))",
        },
      },
      spacing: {
        "base-unit": "var(--base-unit)",
        "creation-header-height": "var(--creation-header-height)",
        "creation-min-padding-x": "var(--creation-min-padding-x)",
        "creation-modal-max-height": "var(--creation-modal-max-height)",
        "creation-modal-min-height": "var(--creation-modal-min-height)",
        "creation-padding-x": "var(--creation-padding-x)",
        "creation-padding-y": "var(--creation-padding-y)",
        "creation-settings-width": "var(--creation-settings-width)",
        "desktop-grid-item-margin": "var(--desktop-grid-item-margin)",
        "desktop-grid-item-margin-slim": "var(--desktop-grid-item-margin-slim)",
        "desktop-in-feed-story-item-height":
          "var(--desktop-in-feed-story-item-height)",
        "desktop-in-feed-story-item-width":
          "var(--desktop-in-feed-story-item-width)",
        "direct-attachment-image-grid-item-size":
          "var(--direct-attachment-image-grid-item-size)",
        "direct-attachment-story-height":
          "var(--direct-attachment-story-height)",
        "direct-attachment-story-large-height":
          "var(--direct-attachment-story-large-height)",
        "direct-attachment-story-large-width":
          "var(--direct-attachment-story-large-width)",
        "direct-attachment-story-width": "var(--direct-attachment-story-width)",
        "direct-message-max-width": "var(--direct-message-max-width)",
        "fb-signup-page-profile-pic-size":
          "var(--fb-signup-page-profile-pic-size)",
        "feed-sidebar-padding": "var(--feed-sidebar-padding)",
        "feed-sidebar-padding-familiar": "var(--feed-sidebar-padding-familiar)",
        "feed-sidebar-width": "var(--feed-sidebar-width)",
        "in-feed-story-item-height": "var(--in-feed-story-item-height)",
        "in-feed-story-item-width": "var(--in-feed-story-item-width)",
        "input-border-radius": "var(--input-border-radius)",
        "large-layout-min": "var(--large-layout-min)",
        "live-video-border-radius": "var(--live-video-border-radius)",
        "media-info": "var(--media-info)",
        "medium-layout-max": "var(--medium-layout-max)",
        "medium-layout-min": "var(--medium-layout-min)",
        "mobile-grid-item-margin": "var(--mobile-grid-item-margin)",
        "mobile-nav-height": "var(--mobile-nav-height)",
        "modal-border-radius": "var(--modal-border-radius)",
        "modal-padding": "var(--modal-padding)",
        "nav-narrow-width": "var(--nav-narrow-width)",
        "nav-medium-width": "var(--nav-medium-width)",
        "nav-wide-width": "var(--nav-wide-width)",
        "nav-wide-screen-min": "var(--nav-wide-screen-min)",
        photo: "var(--photo)",
        "refinement-section-height": "var(--refinement-section-height)",
        "revamp-nav-bottom-toolbar-height":
          "var(--revamp-nav-bottom-toolbar-height)",
        "revamp-feed-card-max-height": "var(--revamp-feed-card-max-height)",
        "revamp-feed-card-min-height": "var(--revamp-feed-card-min-height)",
        "revamp-feed-card-media-min-width":
          "var(--revamp-feed-card-media-min-width)",
        "revamp-feed-card-dense-padding":
          "var(--revamp-feed-card-dense-padding)",
        "revamp-feed-horizontal-padding-small-screen":
          "var(--revamp-feed-horizontal-padding-small-screen)",
        "revamp-feed-horizontal-padding-large-screen":
          "var(--revamp-feed-horizontal-padding-large-screen)",
        "revamp-feed-vertical-padding": "var(--revamp-feed-vertical-padding)",
        "right-rail-width": "var(--right-rail-width)",
        "scrollable-content-header-height-med":
          "var(--scrollable-content-header-height-med)",
        "scrollable-content-header-height":
          "var(--scrollable-content-header-height)",
        "search-box-height": "var(--search-box-height)",
        "search-modal-height-expanded": "var(--search-modal-height-expanded)",
        "search-modal-height": "var(--search-modal-height)",
        "search-modal-top-offset": "var(--search-modal-top-offset)",
        "search-result-height": "var(--search-result-height)",
        "search-result-inline-top-offset":
          "var(--search-result-inline-top-offset)",
        "search-result-list-width": "var(--search-result-list-width)",
        "small-layout-max": "var(--small-layout-max)",
        "small-layout-min": "var(--small-layout-min)",
      },
      fontFamily: {
        system: "var(--font-family-system)",
        "system-prism": "var(--font-family-system-prism)",
      },
      fontSize: {
        "system-10": [
          "var(--system-10-font-size)",
          "var(--system-10-line-height)",
        ],
        "system-11": [
          "var(--system-11-font-size)",
          "var(--system-11-line-height)",
        ],
        "system-12": [
          "var(--system-12-font-size)",
          "var(--system-12-line-height)",
        ],
        "system-14": [
          "var(--system-14-font-size)",
          "var(--system-14-line-height)",
        ],
        "system-16": [
          "var(--system-16-font-size)",
          "var(--system-16-line-height)",
        ],
        "system-18": [
          "var(--system-18-font-size)",
          "var(--system-18-line-height)",
        ],
        "system-22": [
          "var(--system-22-font-size)",
          "var(--system-22-line-height)",
        ],
        "system-24": [
          "var(--system-24-font-size)",
          "var(--system-24-line-height)",
        ],
        "system-26": [
          "var(--system-26-font-size)",
          "var(--system-26-line-height)",
        ],
        "system-28": [
          "var(--system-28-font-size)",
          "var(--system-28-line-height)",
        ],
        "system-32": [
          "var(--system-32-font-size)",
          "var(--system-32-line-height)",
        ],
      },
      fontWeight: {
        "system-bold": "var(--font-weight-system-bold)",
        "system-extra-bold": "var(--font-weight-system-extra-bold)",
        "system-extra-light": "var(--font-weight-system-extra-light)",
        "system-light": "var(--font-weight-system-light)",
        "system-medium": "var(--font-weight-system-medium)",
        "system-regular": "var(--font-weight-system-regular)",
        "system-semibold": "var(--font-weight-system-semibold)",
      },
      zIndex: {
        modal: "var(--modal-z-index)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addComponents }) => {
      addComponents({
        ".debug": {
          border: "1px solid red",
        },
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".filter-bubble": {
          boxShadow: "4px 7px 0px -1.5px rgb(var(--ig-bubble-background))",
        },
        ".filter-big-bubble": {
          boxShadow: "9px 15px 0px -4.5px rgb(var(--ig-bubble-background))",
        },
        ".w-fill": {
          width: "-webkit-fill-available",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
