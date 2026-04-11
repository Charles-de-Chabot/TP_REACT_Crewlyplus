import React from 'react';

const Layout = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden animate-slideup ${className}`}>
            {children}
        </div>
    );
};

export default Layout;