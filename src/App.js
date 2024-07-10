import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateProduct from './component/CreateProduct';
import Product from './component/Product';
import UpdateProduct from './component/UpdateProduct';
import Detail from './component/detail';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Product />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product/:pId' element={<Detail />} />
        <Route path='/product/edit/:pId' element={<UpdateProduct />} />
        <Route path='/create' element={<CreateProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
