import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { register } from "../actions/auth";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

const Register = () => {
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [image, setImage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [imageError, setImageError] = useState("");

    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const onChangePassword2 = (e) => {
        const password2 = e.target.value;
        setPassword2(password2);
    };
    const reader = new FileReader();
    const onChangeImage = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const image = e.target.files[0];
        if (!image) {
            setImageError('Please select an image.');
            return false;
        }

        if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            setImageError('Please select a valid image.');
            return false;
        }

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImage(image);
                const imgDisplay = document.getElementById("imgDisplay");
                if(imgDisplay){
                    imgDisplay.src = URL.createObjectURL(image);
                }
            };
            img.onerror = () => {
                setImageError('Invalid image content.');
                return false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(image);
    };

    const imageClick = () => {
        const input = document.getElementById("imageInput");
        if(input){
            input.click();
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();

        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(register(username, email, password, password2, image))
                .then(() => {
                    setSuccessful(true);
                })
                .catch(() => {
                    setSuccessful(false);
                });
        }
    };
    return (
        <div style={{justifyContent: "center"}}>
            <div className="card card-container">
                <input id="imageInput"
                       accept="image/*"
                       type="file"
                       style={{display: 'none'}}
                       onChange={onChangeImage}
                />

                <img
                    id="imgDisplay"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="Profile Image"
                    className="profile-img-card"
                    onClick={imageClick}
                />

                <Form onSubmit={handleRegister} ref={form}>
                    {!successful && (
                        <div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={onChangeUsername}
                                    validations={[required, vusername]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={onChangeEmail}
                                    validations={[required, validEmail]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={onChangePassword}
                                    validations={[required, vpassword]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password2">Password2</label>
                                <Input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password2}
                                    onChange={onChangePassword2}
                                    validations={[required, vpassword]}
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Sign Up</button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Register;