import axios from "axios";

const API_URL="http://localhost:7771/api/auth/";


export const signUp=async(user)=>{
    try{
        const res=await axios.post(`${API_URL}sign-up`,user);
        return res.data;
    }
    catch(e){
        console.log("Backend Error:", e.response?.data);
        throw e;
    }
}

export const signIn=async(user)=>{
    try{
        const res=await axios.post(`${API_URL}sign-in`,user);
        return res.data;
    }
    catch(e){
        console.log("Backend Error:", e.response?.data);
        return e;
    }
}

export const forgotPassword=async(email)=>{
    try{
        const res=await axios.post(`${API_URL}forgot-password`,{email});
        return res.data;
    }catch(e){
        console.log("Backend Error:", e.response?.data);
        throw e;
    }
}

export const resetPassword=async(token,password)=>{
    try{
        const res=await axios.post(`${API_URL}reset-password/${token}`,{password});
        return res.data;
    }catch(e){
        console.log("Backend Error:", e.response?.data);
        throw e;
    }
}