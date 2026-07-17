import axios from "axios";

const API_URL="http://localhost:7771/api/goals/";

export const addGoal=async(goal)=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.post(`${API_URL}addGoal`,goal,{
            headers:{  
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error adding goal:", error);
        throw error;    
    }
}

export const editGoal=async(goal)=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.put(`${API_URL}editGoal/${goal._id}`,goal,{
            headers:{  
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error editing goal:", error);
        throw error;    
    }
}

export const deleteGoal=async(goal)=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.delete(`${API_URL}deleteGoal/${goal._id}`,{
            headers:{  
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting goal:", error);
        throw error;    
    }
}

export const getGoals=async()=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.get(`${API_URL}getGoals`,{
            headers:{  
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error adding goal:", error);
        throw error;    
    }
}

export const getGoalSummary=async()=>{
    try{
        const token=localStorage.getItem("token");
        const res=await axios.get(`${API_URL}getGoalSummary`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    }   catch (error) {
        console.error("Error fetching goal summary:", error);
        throw error;
    }
}

export const getGoalById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}getGoalById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching goal:", error);
    throw error;
  }
};

export const addGoalContribution = async (id, contributionData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}addGoalContribution/${id}`, contributionData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }); 
    return res.data;
  }
    catch (error) {
    console.error("Error adding goal contribution:", error);
    throw error;
    }
}