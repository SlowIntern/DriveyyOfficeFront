'use client'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Menu } from "antd";
import { toast } from "react-toastify";
import { StepBackwardOutlined } from "@ant-design/icons";

export default function TryPage() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("TryPage must be used inside AuthProvider");
    }

    const { user, loading } = context;
    const handleAlert = () => {
        toast.success("This is a success alert from Try Page!");
    }

    return (
        <div>
            <Menu theme="dark" mode='horizontal' className="justify-between">
                <Menu.Item key="1">Try Page Menu Item 1</Menu.Item>
                <Menu.Item key="2">Try Page Menu Item 2</Menu.Item>     
                <Menu.Item key="3">Try Page Menu Item 3</Menu.Item>
                <Menu.Item key="4">Try Page Menu Item 4</Menu.Item>
                <Menu.Item key="5">Try Page Menu Item 5</Menu.Item>
            </Menu>
            <h1>Try Page</h1>
            <p>This is a placeholder for the Try Page.</p>
            <Button type="primary" onClick={handleAlert} className="pd-2" >alert</Button>
            <StepBackwardOutlined onClick={handleAlert}/>
            {loading ? (
                <p>Loading...</p>
            ) : user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <p>Your role is: {user.role}</p>
                </div>
            ) : (
                <p>You are not logged in.</p>
            )}  
        </div>
    );
}