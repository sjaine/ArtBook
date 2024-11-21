import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CardArray from './CardArray';
import ArtStyle from './categories/ArtStyle';
import Department from './categories/Department';
import Medium from './categories/Medium';
import Category from './Category';
import Period from './categories/Period';
import SignUp from './signInForm/SignInForm';
import Saved from './saved/Saved';
import Recommend from './recommend/Recommend';
import Profile from './account/Account';
import SignIn from './SignIn';
import First from './First';

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

