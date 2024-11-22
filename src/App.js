import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CardArray from './pages/CardArray';
import ArtStyle from './components/categories/ArtStyle';
import Department from './components/categories/Department';
import Medium from './components/categories/Medium';
import Category from './pages/Category';
import Period from './components/categories/Period';
import SignUp from './components/signUpForm/SignUpForm';
import Saved from './components/saved/Saved';
import Recommend from './components/recommend/Recommend';
import Profile from './pages/Account';
import SignIn from './pages/SignIn';
import First from './pages/First';

function App() {
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId') || null;
    });

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId'); 
        }
    }, [userId]);

    return (
        <Router>
            <Routes>
                {/* https://stackoverflow.com/questions/69868956/how-can-i-redirect-in-react-router-v6 */}
                <Route path="/" element={<First />} />
                <Route path="/sign-up" element={<SignUp setUserId={setUserId} />} />
                <Route path="/sign-in" element={<SignIn setUserId={setUserId} />} />
                <Route path="/list" element={<CardArray userId={userId} />} />
                <Route path="/category" element={<Category userId={userId} />} />
                <Route path="/artStyle" element={<ArtStyle userId={userId} />} />
                <Route path="/department" element={<Department userId={userId} />} />
                <Route path="/medium" element={<Medium userId={userId} />} />
                <Route path="/period" element={<Period userId={userId} />} />
                <Route path="/saved" element={<Saved userId={userId} />} />
                <Route path="/recommend" element={<Recommend userId={userId} />} />
                <Route path="/profile" element={<Profile userId={userId} />} />
            </Routes>
        </Router>
    );
}

export default App;

