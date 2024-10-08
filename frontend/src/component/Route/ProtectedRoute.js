import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min';

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
    const { loading, isAuthenticated, user } = useSelector(state => state.user);
    return (
        <>
            {loading === false && (
                <Route
                    {...rest}
                    render={props => {
                        if (isAuthenticated === false) {
                            return <Redirect to="/login" />;
                          }
                          if (isAdmin === true && user.role !== "admin") {
                            return <Redirect to="/login" />;
                          }
                          return <Component {...props} />;
                    }
                    }
                />
            )}
        </>
    )
}

export default ProtectedRoute
