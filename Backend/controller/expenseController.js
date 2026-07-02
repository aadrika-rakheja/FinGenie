const Expenses=require('../model/Expenses');

const getAllExpenses=async(req,res)=>{
    try{
       
        const data=await Expenses.find({user:req.user._id});
        res.status(200).json({
            success:true,
            data:data,
            msg:"Data fetched successfully"
        });
    }
    catch(e){
        res.status(400).json({
            success:false,
            msg:"Unable to fetch data",
            error:e.message
        })
    }
}

const addExpense=async(req,res)=>{
    try{
        const {merchant,amount,type,category,currency,paymentMethod,transactionDate}=req.body;

        if(!transactionDate || !merchant || !amount || !type || !category)
            return res.status(400).json({
                success:false,
                msg:"Fill all required fields"
        });

        const expense=await Expenses.create({
            user:req.user.id,
            merchant,
            amount:Number(amount),
            type,
            category,
            currency,
            paymentMethod,
            transactionDate
        });

        res.status(201).json({
            success:true,
            msg:"Expense added successfully",
            data:expense
        });

    }catch(e){
        res.status(400).json({
            success:false,
            error:e.message
        })
    }
}

const editExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            merchant,
            amount,
            type,
            category,
            currency,
            paymentMethod,
            transactionDate
        } = req.body;

        const expense = await Expenses.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id
            },
            {
                merchant,
                amount: Number(amount),
                type,
                category,
                currency,
                paymentMethod,
                transactionDate
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                msg: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Expense updated successfully",
            data: expense
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message
        });
    }
};

const deleteExpense=async(req,res)=>{
    try{
        const {id}=req.params;
        const item=await Expenses.findOneAndDelete({
            _id:id,
            user:req.user._id
        });
         if (!item) {
            return res.status(404).json({
                success: false,
                msg: "Expense not found"
            });
        }
         res.status(200).json({
            success: true,
            msg: "Expense deleted successfully",
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message
        });
    }

}

module.exports={getAllExpenses,addExpense,editExpense,deleteExpense};