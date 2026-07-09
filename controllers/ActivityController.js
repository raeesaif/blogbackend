import activityModel from "../models/Activity.js";

const logActivity = async ({ icon, action, description }) => {
    try {
        await activityModel.create({ icons: icon, action, description });
    } catch (_) {}
};

const getAllActivities = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await activityModel.countDocuments();
        const activities = await activityModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: activities.length,
            total,
            totalpages: Math.ceil(total / limit),
            page,
            data: activities,
        });
    } catch (error) {
        next(error);
    }
};

export { logActivity, getAllActivities };
