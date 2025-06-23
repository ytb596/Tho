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
    <html>
    <head>
      <title>Thơ của Tiểu Đệ</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f4f8;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #003366;
        }
        form {
          margin-top: 30px;
        }
        button {
          padding: 12px 24px;
          font-size: 16px;
          background: #0059b3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background: #003d80;
        }
      </style>
    </head>
    <body>
      <h1>Chào mừng đến với tập thơ của <strong>Tiểu Đệ</strong></h1>
      <form method="POST" action="/">
        <button>Xem các bài thơ</button>
      </form>
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
          <form method="GET" action="/poem/${encodeURIComponent(name)}">
            <button>${displayName}</button>
          </form>
        `;
      }).join('');
    }
  } catch (e) {
    poemButtons = `<p>Lỗi đọc thư mục thơ: ${e.message}</p>`;
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Danh sách thơ</title>
      <style>
        body {
          font-family: sans-serif;
          background-color: #ffffff;
          padding: 40px;
        }
        h1 {
          color: #222;
        }
        form {
          margin: 10px 0;
        }
        button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 18px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #388e3c;
        }
      </style>
    </head>
    <body>
      <h1>Danh sách các bài thơ của Tiểu Đệ</h1>
      ${poemButtons}
      <p><a href="/">← Quay về trang chủ</a></p>
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
    <html>
    <head>
      <title>${title} - Thơ Tiểu Đệ</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          background: #fffef2;
          padding: 60px;
          color: #444;
        }
        h1 {
          color: #996600;
        }
        .content {
          background: #ffffff;
          padding: 25px;
          border-left: 6px solid #cc9900;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="content">
        ${htmlContent}
      </div>
      <p><a href="/">← Về trang chủ</a></p>
    </body>
    </html>
  `);
});

// ✅ Trang 404 đẹp
app.use((req, res) => render404(res));

function render404(res) {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Không tìm thấy</title>
      <style>
        body {
          font-family: sans-serif;
          text-align: center;
          background: #fdecea;
          padding: 80px;
        }
        h1 {
          color: #d32f2f;
          font-size: 48px;
        }
        p {
          color: #555;
        }
        a {
          text-decoration: none;
          color: #1976d2;
        }
      </style>
    </head>
    <body>
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn truy cập không tồn tại.</p>
      <p><a href="/">Quay lại trang chủ</a></p>
    </body>
    </html>
  `);
}

// 🔥 Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
