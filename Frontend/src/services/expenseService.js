import axios from "axios";

const API_URL="http://localhost:7771/api/expenses/";

export const addExpense=async(expense)=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.post(`${API_URL}addExpense`,expense,{
            headers:{  
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;    
    }
}

export const getExpenses=async()=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.get(`${API_URL}getAllExpenses`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;    
    }   
}

export const editExpense=async(id)=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.put(`${API_URL}editExpense/${id}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;    
    }   
}

export const deleteExpense=async(id)=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.delete(`${API_URL}deleteExpense/${id}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;    
    }   
}



