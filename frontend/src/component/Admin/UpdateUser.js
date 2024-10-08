import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core"; 
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import SideBar from "./Sidebar";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userActions";
import { UPDATE_USER_RESET } from "../../constants/userConstants";


const UpdateUser = ({ history, match }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error: updateError, isUpdated } = useSelector((state) => state.profile);
    const { error, user } = useSelector((state) => state.userDetails);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const userId = match.params.id;

    useEffect(() => {
        if (user && user._id !== userId) {
            dispatch(getUserDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success("User Updated Successfully");
            history.push("/admin/users");
            dispatch({ type: UPDATE_USER_RESET });
        }
    }, [error, alert, dispatch, isUpdated, history, user, userId, updateError]);

    const submitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);
        dispatch(updateUser(userId, myForm));
    };


    return (
        <>
            <MetaData title="Update User --- Admin" />
            <div className="dashboard">
                <SideBar />
                <div className="newProductContainer">
                    <form
                        className="createProductForm"
                        onSubmit={submitHandler}
                    >
                        <h1>Update User</h1>
                        <div>
                            <PersonIcon />
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <MailOutlineIcon />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <VerifiedUserIcon />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        
                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false || role === "" ? true : false}
                        >
                            Update
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateUser
