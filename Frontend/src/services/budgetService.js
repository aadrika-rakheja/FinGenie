import axios from "axios";

const API_URL="http://localhost:7771/api/budgets/";

export const addBudget=async(budget)=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.post(`${API_URL}addBudget`,budget,{
            headers:{  
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error adding budget:", error);
        throw error;    
    }
}

export const getAllBudgets=async()=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.get(`${API_URL}getAllBudgets`,{
            headers:{  
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching budget:", error);
        throw error;    
    }
}

export const getBudgetSummary = async (month, year) => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}budget-summary`, {
        params: {
            month,
            year
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};

export const editBudget = async (id, budget) => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${API_URL}editBudget/${id}`, budget, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error editing budget:", error);
        throw error;
    }
};

export const deleteBudget = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${API_URL}deleteBudget/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting budget:", error);
        throw error;
    }
};