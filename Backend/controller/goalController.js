const Goals = require("../model/Goals");
const Expenses = require("../model/Expenses");

/* =======================================================
   Helper Functions
======================================================= */

const MONTH_MS = 1000 * 60 * 60 * 24 * 30;

const getGoalSavings = async (goalId, userId) => {
    const result = await Expenses.aggregate([
        {
            $match: {
                goal: goalId,
                user: userId,
                isGoalContribution: true,
                type: "Income"
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
    ]);
    return result[0]?.total || 0;
};

const calculatePercentage = (saved, target) => {
    if (!target) return 0;
    return Math.min(Math.round((saved / target) * 100), 100);
};

const calculateRemaining = (saved, target) => {
    return Math.max(target - saved, 0);
};

const calculateStatus = async (goal, userId) => {

    const saved = await getGoalSavings(goal._id, userId);

    if (saved >= goal.targetAmount)
        return "Completed";

    const today = new Date();

    if (today > goal.targetDate)
        return "Overdue";

    const totalDuration =
        goal.targetDate.getTime() - goal.startDate.getTime();

    const elapsed =
        today.getTime() - goal.startDate.getTime();

    const expectedPercentage =
        Math.max(
            0,
            Math.min(
                (elapsed / totalDuration) * 100,
                100
            )
        );

    const actualPercentage =
        calculatePercentage(saved, goal.targetAmount);

    if (actualPercentage + 10 < expectedPercentage)
        return "Behind Schedule";

    return "Active";
};

const buildGoalResponse = async (goal, userId) => {

    const currentSavings =
        await getGoalSavings(goal._id, userId);

    const percentage =
        calculatePercentage(
            currentSavings,
            goal.targetAmount
        );

    const remaining =
        calculateRemaining(
            currentSavings,
            goal.targetAmount
        );

    const status =
        await calculateStatus(goal, userId);

    return {
        ...goal.toObject(),
        currentSavings,
        remaining,
        percentage,
        status
    };
};



const addGoal = async (req, res) => {
    try {
        const {goalName, goalIcon,targetAmount,currentSavings,targetDate,priority,description} = req.body;
        if (!goalName ||!goalIcon ||!targetAmount ||!targetDate ||!priority) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }
        const goal = await Goals.create({
            user: req.user._id,
            goalName,
            goalIcon,
            targetAmount,
            targetDate,
            priority,
            description
        });

        if (Number(currentSavings) > 0) {
            await Expenses.create({
                user: req.user._id,
                merchant: "Opening Balance",
                amount: Number(currentSavings),
                type: "Income",
                category: "Goal Contribution",
                currency: "INR",
                paymentMethod: "Cash",
                transactionDate: new Date(),
                goal: goal._id,
                isGoalContribution: true
            });
        }

        const response =
            await buildGoalResponse(
                goal,
                req.user._id
            );

        res.status(201).json({
            success: true,
            message: "Goal created successfully.",
            data: response
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const editGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const goal =
            await Goals.findOne({
                _id: id,
                user: req.user._id
            });

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: "Goal not found."
            });

        }

        const {
            goalName,
            goalIcon,
            targetAmount,
            targetDate,
            priority,
            description
        } = req.body;

        goal.goalName = goalName;
        goal.goalIcon = goalIcon;
        goal.targetAmount = targetAmount;
        goal.targetDate = targetDate;
        goal.priority = priority;
        goal.description = description;

        await goal.save();

        const response =
            await buildGoalResponse(
                goal,
                req.user._id
            );

        res.status(200).json({
         success: true,
            data: response
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const goal =
            await Goals.findOne({
                _id: id,
                user: req.user._id
            });

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: "Goal not found."
            });
        }
        await Expenses.deleteMany({
            goal: id,
            user: req.user._id,
            isGoalContribution: true
        });

        await goal.deleteOne();

        res.status(200).json({
            success: true,
            message: "Goal deleted successfully."
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const getGoals = async (req, res) => {
    try {
        const goals = await Goals.find({
            user: req.user._id
        }).sort({ createdAt: -1 });
        const enrichedGoals = await Promise.all(
            goals.map(goal => buildGoalResponse(goal, req.user._id))
        );
        res.status(200).json({
            success: true,
            data: enrichedGoals
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


const getGoalById = async (req, res) => {
    try {
        const { id } = req.params;
        const goal = await Goals.findOne({
            _id: id,
            user: req.user._id
        });
        if (!goal) {
            return res.status(404).json({
                success: false,
                error: "Goal not found."
            });
        }
        const currentSavings = await getGoalSavings(goal._id, req.user._id);
        const remaining =  calculateRemaining(
                currentSavings,
                goal.targetAmount
            );
        const percentage =
            calculatePercentage(
                currentSavings,
                goal.targetAmount
            );

        const status =
            await calculateStatus(
                goal,
                req.user._id
            );

        const contributions = await Expenses.find({
            goal: goal._id,
            user: req.user._id,
            isGoalContribution: true
        })
        .sort({ transactionDate: -1 });

        let monthlyPace = 0;

        if (contributions.length > 0) {
            const latestThree = contributions.slice(0, 3);
            const total =
                latestThree.reduce(
                    (sum, tx) => sum + tx.amount,
                    0
                );

            const first =
                new Date(latestThree[0].transactionDate);

            const last =
                new Date(
                    latestThree[
                        latestThree.length - 1
                    ].transactionDate
                );

            const span =
                Math.max(
                    (first - last) / MONTH_MS,
                    1
                );

            monthlyPace = total / span;
        }

        let projectedCompletion = null;

        if (
            monthlyPace > 0 &&
            remaining > 0
        ) {

            const monthsNeeded =
                remaining / monthlyPace;

            projectedCompletion =
                new Date(
                    Date.now() +
                    monthsNeeded * MONTH_MS
                );

        }

        res.status(200).json({
            success: true,
            data: {
                ...goal.toObject(),
                currentSavings,
                remaining,
                percentage,
                status,
                monthlyPace: Math.round(monthlyPace),
                projectedCompletion,
                contributions
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const getGoalSummary = async (req, res) => {

    try {

        const goals = await Goals.find({
            user: req.user._id
        });

        let totalSaved = 0;
        let totalTarget = 0;
        let activeGoals = 0;
        let completedGoals = 0;
        let overdueGoals = 0;
        let behindScheduleGoals = 0;

        for (const goal of goals) {
            const saved =
                await getGoalSavings(
                    goal._id,
                    req.user._id
                );

            totalSaved += saved;
            totalTarget += goal.targetAmount;

            const status =
                await calculateStatus(
                    goal,
                    req.user._id
                );

            switch (status) {

                case "Completed":
                    completedGoals++;
                    break;

                case "Behind Schedule":
                    behindScheduleGoals++;
                    break;

                case "Overdue":
                    overdueGoals++;
                    break;

                default:
                    activeGoals++;

            }

        }

        const totalRemaining =
            Math.max(
                totalTarget - totalSaved,
                0
            );

        const overallCompletion =
            totalTarget === 0
                ? 0
                : (totalSaved / totalTarget) * 100;

        res.status(200).json({
            success: true,
            data: {
                totalGoals: goals.length,
                activeGoals,
                completedGoals,
                overdueGoals,
                behindScheduleGoals,
                totalSaved,
                totalTarget,
                totalRemaining,
                overallCompletion
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const addGoalContribution = async (req, res) => {
    try {
        const {id} = req.params;
        const {  amount, paymentMethod } = req.body;
        
        if (!id || !amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                error: "Goal ID and valid amount are required."
            });
        }
        const goal = await Goals.findOne({
            _id: id,
            user: req.user._id
        });
        if (!goal) {
            return res.status(404).json({
                success: false,
                error: "Goal not found."
            });
        }
        const contribution = await Expenses.create({
            user: req.user._id,
            merchant: goal.goalName,
            amount: Number(amount),
            type: "Income",
            category: "Goal Contribution",
            currency: "INR",
            paymentMethod: paymentMethod || "Cash",
            transactionDate: new Date(),
            goal: goal._id,
            isGoalContribution: true
        });

        const response =
            await buildGoalResponse(
                goal,
                req.user._id
            );

        res.status(201).json({
            success: true,
            message: "Contribution added successfully.",
            contribution,
            goal: response
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = {addGoal,editGoal,deleteGoal,getGoals,getGoalById,getGoalSummary,addGoalContribution};