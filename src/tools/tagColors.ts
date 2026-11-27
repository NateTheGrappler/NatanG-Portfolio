
interface twoColors 
{
    foreground: string;
    background: string;
}

// Hold all tags
export const tagColors: Record<string, twoColors> =
{
    "C":                   {foreground: "#b4c7e7", background: "#34445b"},
    "Bytecode VM":         {foreground: "#cbb9e8", background: "#443953"},
    "Interpreter":         {foreground: "#bdc2e8", background: "#3c405c"},
    "Language Design":     {foreground: "#e2bddd", background: "#514052"},
    "Compilers":           {foreground: "#a9d9ce", background: "#354e4b"},
    "Low-Level":           {foreground: "#add5e2", background: "#354b55"},
    "Systems Engineering": {foreground: "#e4d09c", background: "#514a35"},
    "Cloudflare":          {foreground: "#e8c1a7", background: "#554437"},
    "Self-Hosting":        {foreground: "#e4d09c", background: "#514a35"},
    "Proxmox":             {foreground: "#e8c1a7", background: "#554437"},
    "Docker":              {foreground: "#add5e2", background: "#354b55"},
    "Express":             {foreground: "#d0d0dc", background: "#454550"},
    "Node.js":             {foreground: "#b8d9b3", background: "#3b503e"},
    "Linux":               {foreground: "#e2d5a5", background: "#504a37"},
    "Homelab":             {foreground: "#e2bddd", background: "#514052"},
    "TypeScript":          {foreground: "#b4c7e7", background: "#34445b"},
    "Obsidian":            {foreground: "#cbb9e8", background: "#443953"},
    "Plugin API":          {foreground: "#bdc2e8", background: "#3c405c"},
    "Productivity":        {foreground: "#a9d9ce", background: "#354e4b"},
};
