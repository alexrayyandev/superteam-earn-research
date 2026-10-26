const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8088;
const BASE_DIR = '/home/bansos-lab/superteam_bounties';

const PROJECTS = [
    {
        name: "MultiHopper Build & Route Challenge",
        reward: "5,000 USDC",
        category: "Routing Engine & SDK",
        path: "multihopper-build-and-route-challenge/submission/README.md",
        desc: "Graph-based multi-hop Dijkstra liquidity routing algorithm across Raydium, Orca Whirlpools, and Meteora with sub-millisecond execution."
    },
    {
        name: "Vaultline Security Audit Grants for Colosseum",
        reward: "Up to 4,000 USDC",
        category: "Security Audit Grant",
        path: "vaultline-security-audit-grants/submission/03_SUBMISSION_DOSSIER.md",
        desc: "End-to-end security audit suite covering 12 Solana Anchor program architectures and Token-2022 extensions."
    },
    {
        name: "Inside The Block: Solana Validator Ordering",
        reward: "2,500 USDC",
        category: "Technical Research & Whitepaper",
        path: "solana_block_ordering/deliverable/INSIDE_THE_BLOCK_REPORT.md",
        desc: "Exhaustive 29 KB whitepaper on continuous block production, TPU banking stages, Jito-Solana bundle ordering, and priority fee dynamics."
    },
    {
        name: "Rumbo a Breakpoint 2026 (La Familia)",
        reward: "5,000 USDG Pool",
        category: "Community & Video Script",
        path: "rumbo-a-breakpoint-2026-gana-una-entrada-y-apoyo-para-tu-viaje/submission/DOSSIER_SUMISION_ESPANOL.md",
        desc: "Technical X thread and 5-minute Spanish video script for Solana Breakpoint 2026 community travel grant."
    },
    {
        name: "Show us how you use MozaikPay",
        reward: "500 USDC",
        category: "Integration Code & Demo",
        path: "mozaikpay-video-chile-colombia/submission/README.md",
        desc: "TypeScript Express webhook HMAC-SHA256 verification, Next.js 14 checkout component, and Latin American localization demo."
    },
    {
        name: "Panta x NectarFi Trading Competition",
        reward: "500 USDG",
        category: "Quantitative Strategy & Threads",
        path: "panta-x-nectarfi-trading-competition-bounty/submission/SUBMISSION_DOSSIER.md",
        desc: "Master research thread, deep dive on prediction market AMMs, and 5 proposed community prediction markets."
    },
    {
        name: "$CHIMP Fair Launch Thread",
        reward: "500 USDC",
        category: "Technical Content & Tokenomics",
        path: "chimp-on-metaplex/submission/README.md",
        desc: "10-tweet high-signal X thread, CPMM liquidity mathematical whitepaper, and Solscan verification guide."
    },
    {
        name: "Premier League Predictions with worm",
        reward: "500 USDC",
        category: "Quantitative Modeling & Video",
        path: "create-content-on-premier-league-predictions-with-worm/submission/README.md",
        desc: "Mathematical breakdown of AMM odds vs traditional sportsbook vig, 5 matchday prediction models, and Hanson LMSR appendix."
    },
    {
        name: "RaptorX Research Challenge (REX 5.0)",
        reward: "125 USDC",
        category: "DeFi Alpha Research",
        path: "raptorx_challenge/submission/RAPTORX_FINAL_SUBMISSION.md",
        desc: "9 advanced quantitative alpha generation questions for decentralized exchange liquidity models and on-chain intelligence."
    }
];

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderMarkdown(md) {
    let html = escapeHtml(md);
    // Simple fast styling
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
    html = html.replace(/\n\n/gim, '<p></p>');
    html = html.replace(/\n/gim, '<br>');
    return html;
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname === '/' || pathname === '/index.html') {
        let cardsHtml = PROJECTS.map((p, idx) => `
            <div class="card">
                <div class="card-header">
                    <span class="badge">${p.category}</span>
                    <span class="reward">${p.reward}</span>
                </div>
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="card-footer">
                    <a href="/view?file=${encodeURIComponent(p.path)}" class="btn">View Deliverable</a>
                </div>
            </div>
        `).join('');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex Rayyan | Solana Research & Bounty Portfolio</title>
    <style>
        :root {
            --bg: #090d16;
            --surface: #111827;
            --border: #1f2937;
            --primary: #38bdf8;
            --accent: #10b981;
            --text: #f3f4f6;
            --text-dim: #9ca3af;
        }
        body {
            margin: 0;
            padding: 0;
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
        }
        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        header {
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
            margin-bottom: 32px;
        }
        h1 { margin: 0 0 8px 0; font-size: 28px; }
        .author { color: var(--text-dim); font-size: 14px; }
        .author strong { color: var(--primary); }
        .wallet-box {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 12px 16px;
            margin-top: 16px;
            font-family: monospace;
            font-size: 13px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
        }
        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .badge {
            background: rgba(56, 189, 248, 0.1);
            color: var(--primary);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
        }
        .reward {
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 700;
        }
        .card h3 { margin: 0 0 10px 0; font-size: 17px; }
        .card p { color: var(--text-dim); font-size: 13px; margin: 0 0 16px 0; }
        .btn {
            display: inline-block;
            background: var(--primary);
            color: #000;
            text-decoration: none;
            padding: 8px 14px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 13px;
        }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Alex Rayyan | Solana Research & Audit Showcase</h1>
            <div class="author">
                Lead Security Researcher & Quantitative Analyst | Contact: <strong>bansoslab2026@tutamail.com</strong>
            </div>
            <div class="wallet-box">
                Solana Payout Wallet: <strong>39YTqgacjKt1iz22SrvX4G3Ds8TUUjd9hWPPSJpdd2jZ</strong><br>
                Base EVM Wallet: <strong>0xf71e0734cb53162e8c9baaf5f49841a51c945899</strong>
            </div>
        </header>

        <h2>Verified Deliverable Portfolios (${PROJECTS.length} Completed Projects)</h2>
        <div class="grid">
            ${cardsHtml}
        </div>
    </div>
</body>
</html>`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
    }

    if (pathname === '/view') {
        const fileRel = url.searchParams.get('file');
        if (!fileRel || fileRel.includes('..')) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request');
            return;
        }

        const filePath = path.join(BASE_DIR, fileRel);
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File Not Found');
            return;
        }

        const mdContent = fs.readFileSync(filePath, 'utf8');
        const rendered = renderMarkdown(mdContent);

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${path.basename(fileRel)} - Alex Rayyan Showcase</title>
    <style>
        body {
            background: #090d16;
            color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            padding: 40px 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #111827;
            padding: 32px;
            border-radius: 8px;
            border: 1px solid #1f2937;
        }
        a.back {
            display: inline-block;
            margin-bottom: 20px;
            color: #38bdf8;
            text-decoration: none;
            font-weight: 600;
        }
        h1, h2, h3 { color: #38bdf8; }
        code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        hr { border: 0; border-top: 1px solid #334155; margin: 24px 0; }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back">&larr; Back to Portfolio Index</a>
        ${rendered}
    </div>
</body>
</html>`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Showcase server running on http://0.0.0.0:${PORT}`);
});
