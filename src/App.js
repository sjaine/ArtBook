import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CardArray from './CardArray';
import ArtStyle from './categories/ArtStyle';
import Department from './categories/Department';
import Medium from './categories/Medium';
import Category from './Category';
import Period from './categories/Period';
import First from './First';

function App() {
    return (
        <Router>
            <Routes>
                {/* https://stackoverflow.com/questions/69868956/how-can-i-redirect-in-react-router-v6 */}
                <Route path="/" element={<First />} />
                <Route path="/list" element={<CardArray />} />
                <Route path="/category" element={<Category />} />
                <Route path="/artStyle" element={<ArtStyle />} />
                <Route path="/department" element={<Department />} />
                <Route path="/medium" element={<Medium />} />
                <Route path="/period" element={<Period />} />
            </Routes>
        </Router>
    );
}

export default App;

