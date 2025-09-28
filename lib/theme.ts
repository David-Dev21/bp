export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(79 30% 30%)', // primary - matching global.css
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(79 30% 15%)', // background - matching global.css dark mode
    border: 'hsl(79 25% 25%)', // border - matching global.css dark mode
    card: 'hsl(79 30% 15%)', // card - matching global.css dark mode
    notification: 'hsl(0 72% 51%)', // destructive - matching global.css dark mode
    primary: 'hsl(79 50% 84%)', // primary - matching global.css dark mode
    text: 'hsl(79 50% 84%)', // foreground - matching global.css dark mode
  },
};

// Complete theme configuration with all CSS variables
export const THEME_COLORS = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    card: 'hsl(0 0% 100%)',
    'card-foreground': 'hsl(240 10% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    'popover-foreground': 'hsl(240 10% 3.9%)',
    primary: 'hsl(79 30% 30%)',
    'primary-foreground': 'hsl(0 0% 98%)',
    secondary: 'hsl(79 50% 84%)',
    'secondary-foreground': 'hsl(79 30% 30%)',
    muted: 'hsl(79 50% 84%)',
    'muted-foreground': 'hsl(240 3.8% 46.1%)',
    accent: 'hsl(79 28% 50%)',
    'accent-foreground': 'hsl(0 0% 98%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    'destructive-foreground': 'hsl(0 0% 98%)',
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    ring: 'hsl(79 30% 30%)',
  },
  dark: {
    background: 'hsl(79 30% 15%)',
    foreground: 'hsl(79 50% 84%)',
    card: 'hsl(79 30% 15%)',
    'card-foreground': 'hsl(79 50% 84%)',
    popover: 'hsl(79 30% 15%)',
    'popover-foreground': 'hsl(79 50% 84%)',
    primary: 'hsl(79 50% 84%)',
    'primary-foreground': 'hsl(79 30% 30%)',
    secondary: 'hsl(79 25% 20%)',
    'secondary-foreground': 'hsl(79 50% 84%)',
    muted: 'hsl(79 25% 20%)',
    'muted-foreground': 'hsl(79 30% 60%)',
    accent: 'hsl(79 28% 40%)',
    'accent-foreground': 'hsl(79 50% 84%)',
    destructive: 'hsl(0 72% 51%)',
    'destructive-foreground': 'hsl(0 0% 98%)',
    border: 'hsl(79 25% 25%)',
    input: 'hsl(79 25% 25%)',
    ring: 'hsl(79 50% 84%)',
  },
};
