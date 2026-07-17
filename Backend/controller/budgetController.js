const Budget=require("../model/Budget");
const Expenses=require("../model/Expenses");

const getAllBudgets=async(req,res)=>{
    try{
        
        const budgets=await Budget.find({user:req.user._id});

        const budgetsData=await Promise.all(
            budgets.map(async(b)=>{
                const startOfMonth=new Date(b.year,b.month-1,1,0,0,0,0);  //first date of month eg 1 july
                const endOfMonth=new Date(b.year,b.month,0,23,59,59,999);  //last day eg 31 july 23:59:59


                const spent=await Expenses.aggregate([
                    {
                        $match:{
                            user:req.user._id,
                            category:b.category,
                            type:"Expense",
                            transactionDate:{
                                $gte:startOfMonth,
                                $lte:endOfMonth
                            }
                        }
                    },{
                        $group:{
                            _id:null,
                            total:{$sum:"$amount"}
                        }
                    }
                ]);


                const totalSpent=spent[0]?.total || 0;

                return {
                    ...b.toObject(),
                    spent:totalSpent,
                    remaining:b.monthlyLimit-totalSpent,
                    percentage:(totalSpent/b.monthlyLimit)*100
                }
            })
        )
        res.status(200).json({
            success:true,
            data:budgetsData,
            msg:"Data fetched successfully"
        });
    }
    catch(e){
        res.status(400).json({
            success:false,
            msg:"Unable to fetch budget data",
            error:e.message
        })
    }
}

const addBudget=async(req,res)=>{
    try{
        const {month,year,monthlyLimit,category,createdBy}=req.body;
        console.log(req.body);

        if(!month || !year || !monthlyLimit || !category)
            return res.status(400).json({
                success:false,
                msg:"Fill all required fields"
        });

        const budget=await Budget.create({
            user:req.user.id,
            month,
            year,
            monthlyLimit,
            category,
            createdBy
        });

        res.status(201).json({
            success:true,
            msg:"Budget added successfully",
            data:budget
        });

    }catch(e){
        res.status(400).json({
            success:false,
            error:e.message
        })
    }
}

const editBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, year, monthlyLimit, category } = req.body;

        const updatedBudget = await Budget.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { month, year, monthlyLimit, category },
            { new: true }
        );

        if (!updatedBudget) {
            return res.status(404).json({ success: false, msg: 'Budget not found' });
        }

        res.status(200).json({ success: true, data: updatedBudget, msg: 'Budget updated successfully' });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBudget = await Budget.findOneAndDelete({ _id: id, user: req.user._id });

        if (!deletedBudget) {
            return res.status(404).json({ success: false, msg: 'Budget not found' });
        }

        res.status(200).json({ success: true, msg: 'Budget deleted successfully' });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};

const getBudgetSummary = async (req, res) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        // Total budget for this month
        const budgets = await Budget.find({
            user: req.user._id,
            month,
            year
        });

        const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0 );

        // Total expenses this month
        const expenses = await Expenses.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: "Expense",
                    transactionDate: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const totalSpent = expenses[0]?.totalSpent || 0;

        const remaining = totalBudget - totalSpent;

        const daysInMonth = new Date(year, month, 0).getDate();
        const today = new Date();

        let daysPassed;

        if (
            today.getMonth() + 1 === month &&
            today.getFullYear() === year
        ) {
            daysPassed = today.getDate();
        } else {
            daysPassed = daysInMonth;
        }

        const burnRate = daysPassed > 0 ? totalSpent / daysPassed : 0;

        const daysRemaining = Math.max(daysInMonth - daysPassed, 0);

        const dailyBudget = totalBudget / daysInMonth;

        let burnStatus;

        if (burnRate <= dailyBudget * 0.9) {
            burnStatus = "excellent";
        }
        else if (burnRate <= dailyBudget * 1.1) {
            burnStatus = "on-track";
        }
        else if (burnRate <= dailyBudget * 1.3) {
            burnStatus = "warning";
        }
        else {
            burnStatus = "danger";
        }

        res.status(200).json({
            success: true,
            data: {
                totalBudget,
                totalSpent,
                remaining,
                burnRate,
                burnStatus,
                daysRemaining,
                percentageUsed:
                    totalBudget > 0
                        ? (totalSpent / totalBudget) * 100
                        : 0
            }
        });

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            error: e.message
        });
    }
};

module.exports={getAllBudgets,addBudget,editBudget,deleteBudget,getBudgetSummary};