import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='main-app'>
        <h1>Qiankun 主应用</h1>
        <nav>
          <Link to='/' style={{ marginRight: 10 }}>
            首页
          </Link>
          <Link to='/react-app' style={{ marginRight: 10 }}>
            React子应用
          </Link>
        </nav>

        {/* 主应用自身路由 */}
        <Routes>
          <Route path='/' element={<div>这是主应用首页</div>} />
        </Routes>

        {/* 子应用挂载容器 */}
        <div
          id='micro-container'
          style={{ marginTop: 20, padding: 20, border: '1px solid #ccc' }}
        />
      </div>
    </Router>
  );
}

export default App;
