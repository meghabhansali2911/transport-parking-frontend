import React, { createContext, useState } from "react";

export const DataContext = createContext(null)

function Context({ children }) {
    const [userData, setUserData] = useState({});
    const [isLogin, setIsLogin] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [perform, setPerform] = useState('');
    const [userId, setUserId] = useState('');
    const [userDetails, setUserDetails] = useState({});


    return (
        <DataContext.Provider
            value={{
                userData,
                setUserData,
                isLogin,
                setIsLogin,
                clicked,
                setClicked,
                perform,
                setPerform,
                userId,
                setUserId,
                userDetails,
                setUserDetails
            }}
        >

            {children}
        </DataContext.Provider>
    )
}

export default Context