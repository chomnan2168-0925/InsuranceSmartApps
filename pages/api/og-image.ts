import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, result } = req.query;

    if (!type || !result) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Parse inputs
    const parsedInputs = [];
    let i = 0;
    while (req.query[`input${i}`]) {
      const inputStr = req.query[`input${i}`] as string;
      const [label, value] = inputStr.split(':');
      if (label && value) {
        parsedInputs.push({ label, value });
      }
      i++;
    }

    const calculatorResult = {
      type: type as string,
      result: result as string,
      inputs: parsedInputs,
    };

    // Return HTML for screenshot/OG image
    const html = generateOGImageHTML(calculatorResult);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}

function generateOGImageHTML(result: any) {
  const colors: Record<string, string> = {
    auto: 'from-blue-400 to-blue-600',
    home: 'from-green-400 to-green-600',
    life: 'from-purple-400 to-purple-600',
    disability: 'from-orange-400 to-orange-600',
    health: 'from-sky-400 to-sky-600',
    pet: 'from-yellow-400 to-yellow-600',
  };

  const icons: Record<string, string> = {
    auto: "🚗",
    home: "🏠",
    life: "❤️",
    disability: "🛡️",
    health: "🏥",
    pet: "🐾",
  };

  const titles: Record<string, string> = {
    auto: "Auto Insurance",
    home: "Home Insurance",
    life: "Life Insurance",
    disability: "Disability Insurance",
    health: "Health Insurance",
    pet: "Pet Insurance",
  };

  const gradient = colors[result.type] || 'from-blue-400 to-blue-600';
  const icon = icons[result.type] || '💼';
  const title = titles[result.type] || 'Insurance';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; 
            width: 1200px;
            height: 630px;
            overflow: hidden;
          }
          .container {
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            background: white;
            border-radius: 24px;
            padding: 60px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-bottom: 40px;
          }
          .icon {
            font-size: 80px;
            line-height: 1;
          }
          .title {
            font-size: 48px;
            font-weight: 900;
            color: #1a202c;
            text-transform: capitalize;
            margin: 0;
          }
          .subtitle {
            font-size: 24px;
            color: #718096;
            margin: 8px 0 0 0;
          }
          .result-box {
            background: linear-gradient(135deg, ${gradient});
            padding: 48px;
            border-radius: 16px;
            text-align: center;
            margin-bottom: 32px;
          }
          .result-label {
            font-size: 28px;
            color: white;
            opacity: 0.9;
            margin: 0 0 16px 0;
            font-weight: 600;
          }
          .result-value {
            font-size: 96px;
            font-weight: 900;
            color: white;
            margin: 0;
            line-height: 1;
          }
          .inputs {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 32px;
          }
          .input-item {
            background: #f7fafc;
            padding: 20px;
            border-radius: 12px;
          }
          .input-label {
            font-size: 16px;
            color: #718096;
            margin: 0 0 8px 0;
          }
          .input-value {
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
          }
          .footer {
            text-align: center;
            padding-top: 32px;
            border-top: 2px solid #e2e8f0;
          }
          .footer-text {
            font-size: 20px;
            color: #4a5568;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div class="icon">${icon}</div>
              <div>
                <h1 class="title">${title}</h1>
                <p class="subtitle">Smart Calculator Result</p>
              </div>
            </div>
            <div class="result-box">
              <p class="result-label">Your Estimated Premium</p>
              <p class="result-value">${result.result}</p>
            </div>
            ${result.inputs.length > 0 ? `
              <div class="inputs">
                ${result.inputs.slice(0, 4).map((input: any) => `
                  <div class="input-item">
                    <p class="input-label">${input.label}</p>
                    <p class="input-value">${input.value}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <div class="footer">
              <p class="footer-text">
                🎯 <strong>Try the Smart Insurance Calculator</strong> — Get your personalized estimate in 2 minutes!
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}