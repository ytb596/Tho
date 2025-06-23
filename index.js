
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Cho phép xử lý dữ liệu POST
app.use(express.urlencoded({ extended: true }));

// ⚠️ Chặn truy cập file HTML trong public
app.use('/public', (req, res, next) => {
  if (req.url.endsWith('.html')) {
    return res.status(403).send('Không cho phép truy cập trực tiếp file HTML.');
  }
  next();
});

// ✅ Phục vụ file tĩnh (ảnh, JS, CSS…)
app.use('/public', express.static(path.join(__dirname, 'public')));

// ✅ Trang chủ (GET /)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thơ của Tiểu Đệ</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
        }
        
        .container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 90%;
          animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          line-height: 1.2;
        }
        
        .subtitle {
          font-size: 1.2rem;
          color: #7f8c8d;
          margin-bottom: 40px;
          font-style: italic;
        }
        
        .btn-container {
          margin-top: 30px;
        }
        
        button {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          border: none;
          padding: 18px 40px;
          font-size: 1.1rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          letter-spacing: 1px;
          box-shadow: 0 8px 20px rgba(238, 90, 82, 0.3);
          text-transform: uppercase;
        }
        
        button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(238, 90, 82, 0.4);
          background: linear-gradient(45deg, #ee5a52, #ff6b6b);
        }
        
        .decoration {
          font-size: 3rem;
          margin: 20px 0;
          opacity: 0.6;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 40px 20px;
          }
          h1 {
            font-size: 2rem;
          }
          button {
            padding: 15px 30px;
            font-size: 1rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="decoration">🌸</div>
        <h1>Tập Thơ của <strong>Tiểu Đệ</strong></h1>
        <p class="subtitle">Nơi lưu giữ những vần thơ đẹp nhất</p>
        <div class="decoration">📖</div>
        <form method="POST" action="/" class="btn-container">
          <button type="submit">Khám Phá Thơ</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// ✅ POST /: Liệt kê các bài thơ
app.post('/', (req, res) => {
  const poemsDir = path.join(__dirname, 'public', 'thơ');

  let poemButtons = '';
  try {
    const files = fs.readdirSync(poemsDir).filter(f => f.endsWith('.html'));
    if (files.length === 0) {
      poemButtons = '<p>Hiện chưa có bài thơ nào.</p>';
    } else {
      poemButtons = files.map(file => {
        const name = path.basename(file, '.html');
        const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // Ví dụ: dem-lang → Dem Lang
        return `
          <div class="poem-card">
            <form method="GET" action="/poem/${encodeURIComponent(name)}">
              <button type="submit">${displayName}</button>
            </form>
          </div>
        `;
      }).join('');
    }
  } catch (e) {
    poemButtons = `<p>Lỗi đọc thư mục thơ: ${e.message}</p>`;
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Danh sách thơ - Tiểu Đệ</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        h1 {
          text-align: center;
          color: #2d3436;
          font-size: 2.2rem;
          margin-bottom: 30px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .poems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .poem-card {
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(116, 185, 255, 0.2);
        }
        
        .poem-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .poem-card button {
          width: 100%;
          background: linear-gradient(45deg, #6c5ce7, #a29bfe);
          color: white;
          border: none;
          padding: 20px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .poem-card button:hover {
          background: linear-gradient(45deg, #5f3dc4, #6c5ce7);
        }
        
        .back-link {
          text-align: center;
          margin-top: 30px;
        }
        
        .back-link a {
          color: #0984e3;
          text-decoration: none;
          font-size: 1.1rem;
          padding: 12px 25px;
          border: 2px solid #0984e3;
          border-radius: 50px;
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .back-link a:hover {
          background: #0984e3;
          color: white;
          transform: translateY(-2px);
        }
        
        .empty-state {
          text-align: center;
          color: #636e72;
          font-size: 1.2rem;
          margin: 40px 0;
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 20px;
          }
          h1 {
            font-size: 1.8rem;
          }
          .poems-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📚 Tuyển Tập Thơ Tiểu Đệ</h1>
        <div class="poems-grid">
          ${poemButtons}
        </div>
        <div class="back-link">
          <a href="/">← Quay về trang chủ</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ✅ Trang chi tiết bài thơ
app.get('/poem/:name', (req, res) => {
  const fileName = req.params.name;
  const poemPath = path.join(__dirname, 'public', 'thơ', `${fileName}.html`);

  if (!fs.existsSync(poemPath)) return render404(res);

  const htmlContent = fs.readFileSync(poemPath, 'utf-8');

  const title = fileName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Thơ Tiểu Đệ</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          min-height: 100vh;
          padding: 20px;
          line-height: 1.6;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .header {
          background: linear-gradient(45deg, #fd79a8, #fdcb6e);
          padding: 40px;
          text-align: center;
          color: white;
        }
        
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .content {
          padding: 40px;
          background: #ffffff;
          font-size: 1.1rem;
          line-height: 1.8;
        }
        
        .content h2 {
          color: #2d3436;
          font-size: 2rem;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .content h4 {
          color: #636e72;
          font-style: italic;
          text-align: center;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }
        
        .content p {
          color: #2d3436;
          text-align: center;
          margin-bottom: 20px;
          padding: 0 20px;
        }
        
        .navigation {
          padding: 30px 40px;
          background: #f8f9fa;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        
        .nav-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .nav-links a {
          color: #0984e3;
          text-decoration: none;
          padding: 12px 25px;
          border: 2px solid #0984e3;
          border-radius: 50px;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .nav-links a:hover {
          background: #0984e3;
          color: white;
          transform: translateY(-2px);
        }
        
        .poem-decoration {
          text-align: center;
          font-size: 2rem;
          margin: 20px 0;
          opacity: 0.6;
        }
        
        @media (max-width: 768px) {
          .container {
            margin: 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .header h1 {
            font-size: 2rem;
          }
          .content {
            padding: 30px 20px;
          }
          .navigation {
            padding: 20px;
          }
          .nav-links {
            flex-direction: column;
            align-items: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ ${title} ✨</h1>
        </div>
        <div class="content">
          <div class="poem-decoration">🌺</div>
          ${htmlContent}
          <div class="poem-decoration">🌺</div>
        </div>
        <div class="navigation">
          <div class="nav-links">
            <a href="/">🏠 Trang chủ</a>
            <a href="javascript:history.back()">📚 Danh sách thơ</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ✅ Trang 404 đẹp
app.use((req, res) => render404(res));

function render404(res) {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Không tìm thấy</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: linear-gradient(135deg, #ff7675, #fd79a8);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .error-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 60px 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          max-width: 500px;
          width: 90%;
          animation: bounce 0.8s ease-out;
        }
        
        @keyframes bounce {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .error-icon {
          font-size: 5rem;
          margin-bottom: 20px;
        }
        
        h1 {
          color: #e17055;
          font-size: 3rem;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        p {
          color: #636e72;
          font-size: 1.2rem;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        
        a {
          background: linear-gradient(45deg, #0984e3, #74b9ff);
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 50px;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(9, 132, 227, 0.3);
        }
        
        a:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(9, 132, 227, 0.4);
        }
        
        @media (max-width: 768px) {
          .error-container {
            padding: 40px 20px;
          }
          h1 {
            font-size: 2.5rem;
          }
          .error-icon {
            font-size: 4rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-icon">📚💔</div>
        <h1>404</h1>
        <p>Ôi! Trang thơ bạn tìm kiếm<br>đã lạc mất trong gió...</p>
        <a href="/">🏠 Về nhà thơ</a>
      </div>
    </body>
    </html>
  `);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
