const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = __dirname;
const CONFIG_PATH = '/home/bansos-lab/stealth_researcher/config.json';
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const TOKENS_DIR = path.join(BASE_DIR, 'tokens');
const REPORTS_DIR = path.join(BASE_DIR, 'research_reports');
const QUESTIONS_DIR = path.join(BASE_DIR, 'alpha_questions');
const SUBMISSION_DIR = path.join(BASE_DIR, 'submission');

function log(msg) {
    console.log(`[${new Date().toISOString()}] [RAPTORX-GEN] ${msg}`);
}

async function requestOnce(model, systemPrompt, userPrompt, maxTokens = 3500) {
    return new Promise((resolve, reject) => {
        const u = new URL(config.upstream.endpoint);
        const payload = JSON.stringify({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.25,
            max_tokens: maxTokens
        });

        const req = https.request({
            hostname: u.hostname,
            port: 443,
            path: u.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.upstream.apiKey}`
            }
        }, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const msg = data.choices?.[0]?.message;
                    let text = msg?.content || '';
                    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                    if (!text && msg?.reasoning) {
                        text = msg.reasoning.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                    }
                    if (!text || text.length < 50) {
                        reject(new Error(`Empty response from ${model}`));
                    } else {
                        resolve(text);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(240000, () => {
            req.destroy();
            reject(new Error(`Timeout on ${model}`));
        });
        req.write(payload);
        req.end();
    });
}

async function callModel(model, systemPrompt, userPrompt, maxTokens = 3500, retries = 3) {
    let lastErr = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await requestOnce(model, systemPrompt, userPrompt, maxTokens);
        } catch (err) {
            lastErr = err;
            log(`[WARNING] Attempt ${attempt}/${retries} failed for ${model}: ${err.message}. Retrying in 4s...`);
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, 4000));
            }
        }
    }
    throw lastErr;
}

const TARGET_TOKENS = [
    {
        symbol: "JUP",
        name: "Jupiter",
        address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        ecosystem: "Solana DEX Aggregator & Perps",
        focus: "Fee capture dynamics, JupSOL liquidity routing efficiency, ASR staking rewards dilution vs treasury runway, and emissions absorption post-Genesis unlock"
    },
    {
        symbol: "PYTH",
        name: "Pyth Network",
        address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
        ecosystem: "Financial Oracle Network",
        focus: "Pull oracle latency vs push economics, cross-chain verification overhead on Pythnet, token staking utility (governance rights vs slashable security pool), and emission cliff absorption"
    },
    {
        symbol: "RAY",
        name: "Raydium",
        address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        ecosystem: "Solana Automated Market Maker & CLMM",
        focus: "Concentrated liquidity (CLMM) fee generation during extreme volatility events, LP impermanent loss risk surface, Buyback-and-Burn efficacy against FDV dilution"
    }
];

async function main() {
    log("Starting Superteam Earn RaptorX Research Challenge Generation...");

    for (const t of TARGET_TOKENS) {
        const reportPath = path.join(REPORTS_DIR, `${t.symbol}_INTELLIGENCE_REPORT.md`);
        const questionsPath = path.join(QUESTIONS_DIR, `${t.symbol}_ALPHA_QUESTIONS.md`);

        // Check if report already exists
        let report = "";
        if (fs.existsSync(reportPath) && fs.statSync(reportPath).size > 500) {
            log(`[SKIP] ${t.symbol}_INTELLIGENCE_REPORT.md already exists.`);
            report = fs.readFileSync(reportPath, 'utf8');
        } else {
            log(`Generating Research Profile & Questions for ${t.name} ($${t.symbol})...`);
            fs.writeFileSync(path.join(TOKENS_DIR, `${t.symbol}.json`), JSON.stringify(t, null, 2), 'utf8');

            const prompt1_sys = `You are a Principal Crypto Quantitative Analyst.
Target: ${t.name} ($${t.symbol}) on Solana.
ZERO AI tells, ZERO AI slop, ZERO decorative emojis.
Focus on hard financial mechanics:
1. Architectural Position & Core Value Accrual
2. Liquidity & Volume Depth Analysis (Slippage profiles, AMM/CLMM dynamics)
3. Tokenomic Vulnerabilities & Unlock Schedules (FDV vs Circulating float, inflation rate)
4. Empirical Scenarios: Bullish Catalyst vs Downside Structural Fragility.`;

            report = await callModel(
                "MiniMaxAI/MiniMax-M2.7",
                prompt1_sys,
                `Analyze the structural market reality and financial mechanics of ${t.name} ($${t.symbol}). Focus on: ${t.focus}.`
            );
            fs.writeFileSync(reportPath, report, 'utf8');
            log(`[+] Saved ${t.symbol}_INTELLIGENCE_REPORT.md (${report.length} bytes)`);
        }

        // Check if questions already exist
        if (fs.existsSync(questionsPath) && fs.statSync(questionsPath).size > 500) {
            log(`[SKIP] ${t.symbol}_ALPHA_QUESTIONS.md already exists.`);
        } else {
            log(`Formulating Alpha Questions for ${t.name} ($${t.symbol})...`);
            const prompt2_sys = `You are an elite institutional crypto researcher preparing questions for RaptorX's REX AI 5.0.
The competition judging criteria: "We want to see how you think, how you interpret market intelligence, and how effectively you use AI to explore a cryptocurrency beyond surface-level price movements. The best questions win."
Examples of winning style:
- Not "Will this go up?", but "The report identifies increasing volume alongside weakening momentum. Could this indicate distribution, or a temporary liquidity event? Which on-chain indicators distinguish these scenarios?"
- Not "Is it safe?", but "Based on order book depth, how vulnerable is this asset to large market sells, and what exact volume shift signals structural risk?"

ZERO AI tells, ZERO decorative emojis.
Provide 3 distinct, highly sophisticated analytical questions for ${t.name} ($${t.symbol}) based on the intelligence report.
Each question must include:
- Question Title
- Analytical Question Text (deep, challenging, rigorous)
- The Core Market Hypothesis Behind the Question
- What Counter-Signals / Metrics REX AI 5.0 Should Evaluate`;

            const questions = await callModel(
                "deepseek-ai/DeepSeek-V4-Flash-0731",
                prompt2_sys,
                `Formulate 3 winning analytical questions for ${t.name} ($${t.symbol}) based on this intelligence summary:\n${report.slice(0, 2500)}`
            );
            fs.writeFileSync(questionsPath, questions, 'utf8');
            log(`[+] Saved ${t.symbol}_ALPHA_QUESTIONS.md (${questions.length} bytes)`);
        }
    }

    // Agent 3 (GLM): Compile Final Turnkey Submission Dossier
    const submissionPath = path.join(SUBMISSION_DIR, 'RAPTORX_FINAL_SUBMISSION.md');
    if (fs.existsSync(submissionPath) && fs.statSync(submissionPath).size > 1000) {
        log("[SKIP] RAPTORX_FINAL_SUBMISSION.md already exists.");
    } else {
        log("Synthesizing final Superteam Earn submission dossier...");
        const jupQ = fs.readFileSync(path.join(QUESTIONS_DIR, 'JUP_ALPHA_QUESTIONS.md'), 'utf8');
        const pythQ = fs.readFileSync(path.join(QUESTIONS_DIR, 'PYTH_ALPHA_QUESTIONS.md'), 'utf8');
        const rayQ = fs.readFileSync(path.join(QUESTIONS_DIR, 'RAY_ALPHA_QUESTIONS.md'), 'utf8');

        const prompt3_sys = `You are the Lead Submission Coordinator for an independent quantitative research lab.
Compile a cohesive, master submission dossier for the Superteam Earn RaptorX Research Challenge.
ZERO AI tells, ZERO AI slop, ZERO decorative emojis.
Include:
1. Executive Submission Brief
2. Target Assets Evaluated (Jupiter $JUP, Pyth Network $PYTH, Raydium $RAY)
3. Research Methodology & Market Hypotheses
4. The Complete Set of High-Alpha Questions for REX AI 5.0
5. Solana Payout Address: ${config.wallets.solana}
6. Researcher Signature: ${config.persona.name} (${config.persona.email})`;

        const finalDoc = await callModel(
            "zai-org/GLM-5.3-Flash",
            prompt3_sys,
            `Compile the master Superteam Earn submission for RaptorX Challenge using these question sets:\n\n=== JUPITER ===\n${jupQ.slice(0, 1500)}\n\n=== PYTH ===\n${pythQ.slice(0, 1500)}\n\n=== RAYDIUM ===\n${rayQ.slice(0, 1500)}`
        );

        fs.writeFileSync(submissionPath, finalDoc, 'utf8');
        log(`[+] Saved RAPTORX_FINAL_SUBMISSION.md (${finalDoc.length} bytes)`);
    }
    log("All RaptorX challenge deliverables successfully created!");
}

main().catch(err => log(`Fatal RaptorX generation error: ${err.message}`));
